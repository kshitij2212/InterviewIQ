const groq = require('./groq')
const Question = require('../models/Question')
const { 
    INTERVIEW_QUESTION_LIMITS, 
    LEVEL_DIFFICULTY_HINTS, 
    VALID_ROLES, 
    LEVELS, 
    QUESTION_TYPES 
} = require('../config/constants')

function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

function buildPrompt({ role, specialization, level, questionType, safeCount, isHR }) {
    const levelHint = LEVEL_DIFFICULTY_HINTS[level] || ''
    
    if (role === 'introduction') {
        return `Generate exactly ${safeCount} personal introduction and behavioral interview questions for a candidate to assess their background, soft-skills, and communication baseline. Do not ask technical questions.
Return a JSON object with a "questions" key containing the array. Each question MUST include:
1. The question text in "text"
2. At least 3-5 relevant soft-skill/behavioral keywords in "expectedKeywords"
3. A highly sophisticated, ideal 10/10 answer for this specific question in "bestResponse" (FAANG caliber)

{
  "questions": [
    { "text": "...", "expectedKeywords": ["..."], "bestResponse": "..." }
  ]
}`
    }

    const hrInstruction = isHR 
        ? `FOCUS: Since this is an HR/Behavioral round, DO NOT ask technical implementation, syntax, or coding questions. Instead, focus on behavioral, situational, and soft-skill questions specifically related to their experience with ${specialization || role} (e.g., handling project challenges, team collaboration, problem-solving experiences, or explaining concepts to stakeholders).`
        : `CRITICAL INSTRUCTION: You must strictly limit your questions to the specified role and specialization. Do NOT ask questions about unrelated frameworks, libraries, or languages.`

    return `Generate exactly ${safeCount} interview questions for a ${level} ${role} role${specialization ? ` specializing strictly in ${specialization}` : ''}.
${hrInstruction}
Difficulty Focus: ${levelHint}
The questions must be of type: ${questionType}.

Return a JSON object with a "questions" key containing the array. Each question MUST include:
1. The question text in "text"
2. At least 3-5 relevant ${isHR ? 'behavioral and soft-skill' : 'technical'} keywords in "expectedKeywords"
3. A highly sophisticated, ideal 10/10 answer for this specific question in "bestResponse". The answer should be of FAANG-interview caliber, reflecting deep expertise, industry best practices, and a structured delivery (e.g., using the STAR method for behavioral questions, or addressing architecture, trade-offs, and scalability for technical questions).

{
  "questions": [
    { "text": "...", "expectedKeywords": ["..."], "bestResponse": "..." }
  ]
}`
}

async function generateQuestions({ role, specialization, level, questionType, count = 5 }) {
    if (!VALID_ROLES.includes(role)) throw new Error(`Invalid role: ${role}`)
    if (!LEVELS.includes(level)) throw new Error(`Invalid level: ${level}`)
    if (!QUESTION_TYPES.includes(questionType)) throw new Error(`Invalid question type: ${questionType}`)

    const safeCount = Math.min(
        Math.max(count + 2, INTERVIEW_QUESTION_LIMITS.min),
        INTERVIEW_QUESTION_LIMITS.max
    )

    const isHR = questionType === 'hr' || role === 'introduction'
    const systemPrompt = isHR 
        ? 'You are an expert HR and behavioral interviewer from a top-tier FAANG company. You only output valid JSON.'
        : 'You are a senior technical interviewer from a top-tier FAANG company. You only output valid JSON.'

    const prompt = buildPrompt({ role, specialization, level, questionType, safeCount, isHR })

    let raw
    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7
        })
        raw = response.choices[0]?.message?.content
    } catch (err) {
        throw new Error(`Groq API call failed: ${err.message}`)
    }

    if (!raw) throw new Error('Groq returned empty response')

    let parsed
    try {
        parsed = JSON.parse(raw)
    } catch {
        throw new Error('Groq returned invalid JSON')
    }

    const questionsArray = parsed.questions || (Array.isArray(parsed) ? parsed : null)
    if (!questionsArray) throw new Error('Groq returned invalid response shape')

    const docs = questionsArray
        .filter(q => q.text && typeof q.text === 'string' && q.text.trim())
        .map(q => ({
            text: q.text.trim(),
            normalizedText: normalizeText(q.text),
            role,
            specialization: specialization || null,
            level,
            questionType,
            expectedKeywords: Array.isArray(q.expectedKeywords)
                ? q.expectedKeywords.filter(k => typeof k === 'string' && k.trim())
                : [],
            bestResponse: typeof q.bestResponse === 'string' ? q.bestResponse.trim() : null
        }))

    if (docs.length === 0) throw new Error('No valid questions generated')

    try {
        const saved = await Question.insertMany(docs, { ordered: false })
        return saved
    } catch (err) {
        if (err.writeErrors) {
            console.warn(`Skipped ${err.writeErrors.length} duplicate questions for role: ${role}`)
            
            const insertedNormalized = docs
                .filter((_, i) => !err.writeErrors.find(e => e.index === i))
                .map(d => normalizeText(d.text))

            if (insertedNormalized.length === 0) return []

            return Question.find({
                normalizedText: { $in: insertedNormalized },
                role,
                level,
                questionType
            })
        }
        throw err
    }
}

module.exports = { generateQuestions }