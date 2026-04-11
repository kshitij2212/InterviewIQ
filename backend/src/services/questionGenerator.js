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

    const prompt = `Generate ${safeCount} interview questions.
Role: ${role}
Specialization: ${specialization || 'none'}
Level: ${level}
Type: ${questionType}
Return ONLY a valid JSON array, no markdown, no explanation, no extra text:
[
  {
    "text": "question here",
    "expectedKeywords": ["keyword1", "keyword2"]
  }
]`

    let raw
    try {
        const response = await groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        })
        raw = response.choices[0]?.message?.content
    } catch (err) {
        throw new Error(`Groq API call failed: ${err.message}`)
    }

    if (!raw) throw new Error('Groq returned empty response')
    const match = raw.match(/\[[\s\S]*?\]/)
    if (!match) throw new Error('Groq response contains no JSON array')

    let parsed
    try {
        parsed = JSON.parse(match[0])
    } catch {
        throw new Error('Groq returned invalid JSON — could not parse array')
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Groq returned empty or invalid array')
    }

    const docs = parsed
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