const groq = require('./groq')
const { SCORE_RANGE } = require('../config/constants')

function getKeywordScore(transcript, expectedKeywords) {
    if (!transcript || typeof transcript !== 'string') return 0
    if (!expectedKeywords || expectedKeywords.length === 0) return 0
    const text = transcript.toLowerCase()
    const matched = expectedKeywords.filter(k => text.includes(k.toLowerCase()))
    return (matched.length / expectedKeywords.length) * SCORE_RANGE.max
}

async function evaluateWithLLM({ questionText, transcript, expectedKeywords }) {
    const safeKeywords = Array.isArray(expectedKeywords) ? expectedKeywords : []

    const prompt = `Evaluate this interview answer strictly.
Question: ${questionText}
Answer: ${transcript}
Expected Keywords: ${safeKeywords.join(', ')}

Return ONLY valid JSON in this exact shape:
{
  "score": number,
  "feedback": {
    "strengths": ["point1"],
    "improvements": ["point1"],
    "suggestion": "string or null"
  },
  "breakdown": {
    "content": number,
    "communication": number
  }
}`

    let raw
    try {
        const res = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a technical interviewer assistant. You only output valid JSON objects. Do not include markdown or explanations.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3
        })
        raw = res.choices[0]?.message?.content
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

    if (typeof parsed.score !== 'number') throw new Error('Groq returned invalid score')
    if (!parsed.feedback || !Array.isArray(parsed.feedback.strengths)) {
        throw new Error('Groq returned invalid feedback shape')
    }

    parsed.score = Math.min(
        Math.max(Math.round(parsed.score), SCORE_RANGE.min),
        SCORE_RANGE.max
    )

    if (!parsed.feedback.suggestion || !parsed.feedback.suggestion.trim()) {
        parsed.feedback.suggestion = null
    }

    return parsed
}

async function evaluateAnswer({ questionText, transcript, expectedKeywords, status }) {
    if (status === 'skipped' || status === 'timeout') {
        return {
            score: 0,
            feedback: { strengths: [], improvements: [], suggestion: null },
            breakdown: { content: 0, keywords: 0, communication: 0 }
        }
    }

    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
        return {
            score: 0,
            feedback: {
                strengths: [],
                improvements: ['No answer provided'],
                suggestion: 'Try to attempt the question'
            },
            breakdown: { content: 0, keywords: 0, communication: 0 }
        }
    }

    const safeKeywords = Array.isArray(expectedKeywords) ? expectedKeywords : []
    const keywordScore = getKeywordScore(transcript, safeKeywords)
    const llmResult = await evaluateWithLLM({ questionText, transcript, expectedKeywords: safeKeywords })

    const finalScore = safeKeywords.length > 0
        ? Math.min(Math.round(0.6 * llmResult.score + 0.4 * keywordScore), SCORE_RANGE.max)
        : Math.round(llmResult.score)

    return {
        score: finalScore,
        feedback: llmResult.feedback,
        breakdown: {
            content:       typeof llmResult.breakdown?.content === 'number' ? llmResult.breakdown.content : 0,
            keywords:      Number(keywordScore.toFixed(1)),
            communication: typeof llmResult.breakdown?.communication === 'number' ? llmResult.breakdown.communication : 0
        }
    }
}

module.exports = { evaluateAnswer }