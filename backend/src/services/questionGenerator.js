const groq = require('./groq')
const Question = require('../models/Question')
const { INTERVIEW_QUESTION_LIMITS, LEVEL_DIFFICULTY_HINTS } = require('../config/constants')

function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

async function generateQuestions({ role, specialization, level, questionType, count = 5 }) {
    const safeCount = Math.min(
        Math.max(count + 2, INTERVIEW_QUESTION_LIMITS.min),
        INTERVIEW_QUESTION_LIMITS.max
    )

    const levelHint = LEVEL_DIFFICULTY_HINTS[level] || ''
    const isHR = questionType === 'hr' || role === 'introduction'
    const systemPrompt = isHR 
        ? 'You are an expert HR and behavioral interviewer. You only output valid JSON. You must return a JSON object with a "questions" key.'
        : 'You are a technical interviewer. You only output valid JSON. You must return a JSON object with a "questions" key.'

    let prompt = `Generate exactly ${safeCount} interview questions for a ${level} ${role} role${specialization ? ` specializing strictly in ${specialization}` : ''}.
CRITICAL INSTRUCTION: You must strictly limit your questions to the specified role and specialization. Do NOT ask questions about unrelated frameworks, libraries, or languages (e.g., do not ask React questions in a pure Javascript interview, do not ask Java questions in a Node interview).
Difficulty Focus: ${levelHint}
The questions must be of type: ${questionType}.

Return a JSON object with a "questions" key containing the array. Each question MUST include:
1. The question text in "text"
2. At least 3-5 relevant ${isHR ? 'behavioral and soft-skill' : 'technical'} keywords in "expectedKeywords"
3. A highly accurate, concise, ideal 10/10 answer for this specific question in "bestResponse"

{
  "questions": [
    { 
      "text": "...", 
      "expectedKeywords": ["keyword1", "keyword2", "keyword3"],
      "bestResponse": "..."
    }
  ]
}`

    if (role === 'introduction') {
        prompt = `Generate exactly ${safeCount} personal introduction and behavioral interview questions for a candidate to assess their background, soft-skills, and communication baseline. Do not ask technical questions.
Return a JSON object with a "questions" key containing the array. Each question MUST include:
1. The question text in "text"
2. At least 3-5 relevant soft-skill/behavioral keywords in "expectedKeywords"
3. A highly accurate, concise, ideal 10/10 answer for this specific question in "bestResponse"

{
  "questions": [
    { 
      "text": "...", 
      "expectedKeywords": ["keyword1", "keyword2", "keyword3"],
      "bestResponse": "..."
    }
  ]
}`
    }

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
        throw new Error('Groq returned invalid JSON — could not parse object')
    }

    const questionsArray = parsed.questions || parsed
    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        throw new Error('Groq returned empty or invalid array')
    }

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

    if (docs.length === 0) throw new Error('Groq returned no valid questions after filtering')

    try {
        const saved = await Question.insertMany(docs, { ordered: false })
        return saved
    } catch (err) {
        if (err.writeErrors) {
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