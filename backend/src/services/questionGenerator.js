const groq = require('./groq')
const Question = require('../models/Question')
const { INTERVIEW_QUESTION_LIMITS } = require('../config/constants')

function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

async function generateQuestions({ role, specialization, level, questionType, count = 5 }) {
    const safeCount = Math.min(
        Math.max(count, INTERVIEW_QUESTION_LIMITS.min),
        INTERVIEW_QUESTION_LIMITS.max
    )

    const prompt = `Generate exactly ${safeCount} interview questions for a ${level} ${role} role${specialization ? ` specializing in ${specialization}` : ''}.
The questions must be of type: ${questionType}.

Return a JSON object with a "questions" key containing the array. Each question MUST include at least 3-5 relevant technical keywords:
{
  "questions": [
    { "text": "...", "expectedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"] }
  ]
}`

    let raw
    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a technical interviewer. You only output valid JSON. You must return a JSON object with a "questions" key.' },
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
                : []
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