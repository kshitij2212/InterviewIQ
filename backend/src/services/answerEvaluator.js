const groq = require('./groq')
const { SCORE_RANGE, LEVEL_DIFFICULTY_HINTS } = require('../config/constants')

function getKeywordScore(transcript, expectedKeywords) {
    if (!transcript || typeof transcript !== 'string') return 0
    if (!expectedKeywords || expectedKeywords.length === 0) return 0
    const text = transcript.toLowerCase()
    const matched = expectedKeywords.filter(k => text.includes(k.toLowerCase()))
    return (matched.length / expectedKeywords.length) * SCORE_RANGE.max
}

async function evaluateWithLLM({ questionText, transcript, expectedKeywords, level = 'fresher', questionType = 'technical' }) {
    const isHR = questionType === 'hr'
    const safeKeywords = Array.isArray(expectedKeywords) ? expectedKeywords : []
    const levelHint = LEVEL_DIFFICULTY_HINTS[level] || ''

    const systemPrompt = isHR
        ? 'You are an expert HR and behavioral interviewer. You evaluate candidates based on their communication, soft skills, and situational responses. You only output valid JSON objects.'
        : 'You are a technical interviewer assistant. You evaluate candidates based on their technical accuracy and depth. You only output valid JSON objects.'

    const prompt = `Evaluate this interview answer strictly.
Candidate Level: ${level} (${levelHint})
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
                { role: 'system', content: systemPrompt },
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

async function evaluateAnswer({ questionText, transcript, expectedKeywords, status, level, questionType = 'technical' }) {
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
    const llmResult = await evaluateWithLLM({ 
        questionText, 
        transcript, 
        expectedKeywords: safeKeywords,
        level: level || 'fresher',
        questionType
    })

    const finalScore = safeKeywords.length > 0
        ? Math.min(Math.round(0.6 * llmResult.score + 0.4 * keywordScore), SCORE_RANGE.max)
        : Math.round(llmResult.score)

    return {
        score: finalScore,
        feedback: llmResult.feedback,
        breakdown: {
            content:       typeof llmResult.breakdown?.content === 'number' ? llmResult.breakdown.content : 0,
            keywords:      Math.round(keywordScore * 10) / 10,
            communication: typeof llmResult.breakdown?.communication === 'number' ? llmResult.breakdown.communication : 0
        }
    }
}

async function generateOverallFeedback({ role, level, type, answers }) {
    if (!answers || answers.length === 0) return null

    const isHR = type === 'hr'
    const sessionSummary = answers.map((a, i) => `
Q${i + 1}: ${a.questionId?.text || 'Question'}
Score: ${a.score}/10
Answer: ${a.transcript || 'Skipped'}
Strengths: ${a.feedback?.strengths?.join(', ')}
Improvements: ${a.feedback?.improvements?.join(', ')}
`).join('\n---\n')

    const prompt = `You are an ${isHR ? 'expert HR consultant' : 'elite technical career coach'}. 
Analyze this full interview session for a ${level} ${role} (${type} interview). 

SESSION DATA:
${sessionSummary}

TASK:
Provide a comprehensive, high-impact "Executive Summary" of their performance. 
Be constructive but firm. Address:
1. Their technical/professional persona.
2. Recurring patterns in their strengths and weaknesses.
3. A "Deep Dive" actionable strategy for their next 30 days of preparation.

LENGTH:
Write between 150-250 words. Be eloquent and professional.

Return ONLY a JSON object:
{
  "summary": "Full detailed report text here",
  "topStrengths": ["string"],
  "topImprovements": ["string"]
}`

    try {
        const res = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are an executive career coach. You only output valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.5
        })
        const raw = res.choices[0]?.message?.content
        return JSON.parse(raw)
    } catch (err) {
        console.error('Overall feedback generation failed:', err)
        return null
    }
}

module.exports = { evaluateAnswer, generateOverallFeedback }