const Interview = require('../models/Interview')
const Answer = require('../models/Answer')
const Question = require('../models/Question')
const User = require('../models/User')
const { generateQuestions } = require('../services/questionGenerator')
const { evaluateAnswer } = require('../services/answerEvaluator')
const { INTERVIEW_QUESTION_LIMITS, ROLE_SPECIALIZATION_MAP, DAILY_INTERVIEW_LIMIT, LEVELS, INTERVIEW_TYPES } = require('../config/constants')

function getISTDateString() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}

async function startInterview(req, res, next) {
    try {
        const userId = req.user._id
        let { 
            role, 
            specialization, 
            level, 
            type, 
            interviewType, 
            questionCount, 
            totalQuestions = 5 
        } = req.body

        type = type || interviewType
        questionCount = questionCount || totalQuestions || 5

        role = role?.trim().toLowerCase()
        specialization = specialization?.trim().toLowerCase()

        if (!['technical', 'hr'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid interview type. Must be "technical" or "hr"'
            })
        }

        if (!INTERVIEW_QUESTION_LIMITS.options.includes(questionCount)) {
            return res.status(400).json({
                success: false,
                message: `questionCount must be one of: ${INTERVIEW_QUESTION_LIMITS.options.join(', ')}`
            })
        }

        const allowedSpecs = ROLE_SPECIALIZATION_MAP[role]
        if (allowedSpecs !== null && !specialization) {
            return res.status(400).json({
                success: false,
                message: `Specialization required for role "${role}". Allowed: ${allowedSpecs.join(', ')}`
            })
        }
        if (allowedSpecs !== null && specialization && !allowedSpecs.includes(specialization)) {
            return res.status(400).json({
                success: false,
                message: `Invalid specialization "${specialization}" for role "${role}"`
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        if (!user.canStartInterview()) {
            return res.status(403).json({
                success: false,
                message: 'Daily interview limit reached. Upgrade to Pro for unlimited interviews.'
            })
        }

        const questionType = type === 'hr' ? 'hr' : 'technical'

        const questionQuery = { active: true, role, level, questionType }
        if (specialization) questionQuery.specialization = specialization

        let questions = await Question.aggregate([
            { $match: questionQuery },
            { $sample: { size: questionCount } }
        ])

        let attempts = 0
        while (questions.length < questionCount && attempts < 2) {
            const needed = questionCount - questions.length
            await generateQuestions({ role, specialization, level, questionType, count: needed })
            questions = await Question.aggregate([
                { $match: questionQuery },
                { $sample: { size: questionCount } }
            ])
            attempts++
        }

        if (questions.length < INTERVIEW_QUESTION_LIMITS.min) {
            return res.status(500).json({
                success: false,
                message: 'Not enough questions available. Please try again.'
            })
        }

        const questionIds = questions.map(q => q._id)

        const interview = await Interview.create({
            userId,
            role,
            specialization: specialization || null,
            level,
            type,
            questionIds
        })

        const todayStr = getISTDateString()
        
        if (user.dailyInterviewDate !== todayStr) {
            user.dailyInterviewDate = todayStr
            user.dailyInterviewCount = 1
        } else {
            user.dailyInterviewCount += 1
        }
        
        if (user.planType !== 'pro' && user.dailyInterviewCount > DAILY_INTERVIEW_LIMIT) {
            return res.status(403).json({
                success: false,
                message: 'Daily interview limit reached.'
            })
        }

        await user.save()

        return res.status(201).json({
            success: true,
            data: {
                interviewId: interview.id,
                currentQuestion: {
                    index: 0,
                    total: questionIds.length,
                    question: questions[0]
                }
            }
        })
    } catch (err) {
        next(err)
    }
}

async function getCurrentQuestion(req, res, next) {
    try {
        const userId = req.user._id
        const { id } = req.params

        const interview = await Interview.findById(id).lean()
        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' })
        }

        if (interview.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' })
        }

        if (interview.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                message: `Interview is already ${interview.status}`
            })
        }

        const { currentQuestionIndex, questionIds } = interview

        if (currentQuestionIndex >= questionIds.length) {
            return res.status(400).json({
                success: false,
                message: 'No more questions. Complete the interview.'
            })
        }

        const question = await Question.findById(
            questionIds[currentQuestionIndex],
            'text role level questionType expectedKeywords'
        ).lean()

        return res.status(200).json({
            success: true,
            data: {
                index: currentQuestionIndex,
                total: questionIds.length,
                question
            }
        })
    } catch (err) {
        next(err)
    }
}

async function submitAnswer(req, res, next) {
    try {
        const userId = req.user._id
        const { id } = req.params
        const { rawTranscript, transcript, duration, timeLimitExceeded, status = 'submitted' } = req.body

        const interview = await Interview.findById(id).lean()
        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' })
        }

        if (interview.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' })
        }

        if (interview.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                message: `Interview is already ${interview.status}`
            })
        }

        const { currentQuestionIndex, questionIds } = interview

        if (currentQuestionIndex >= questionIds.length) {
            return res.status(400).json({
                success: false,
                message: 'All questions already answered'
            })
        }

        const questionId = questionIds[currentQuestionIndex]

        const currentQuestion = await Question.findById(
            questionId,
            'text role level questionType expectedKeywords'
        ).lean()
        if (!currentQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' })
        }
        
        let evaluation
        if (status !== 'submitted') {
            evaluation = {
                score: 0,
                feedback: { strengths: [], improvements: [], suggestion: null },
                breakdown: { content: 0, keywords: 0, communication: 0 }
            }
        } else {
            try {
                evaluation = await evaluateAnswer({
                    questionText: currentQuestion.text,
                    transcript: transcript || null,
                    expectedKeywords: currentQuestion.expectedKeywords,
                    status
                })
            } catch {
                evaluation = {
                    score: 0,
                    feedback: { strengths: [], improvements: [], suggestion: null },
                    breakdown: { content: 0, keywords: 0, communication: 0 }
                }
            }
        }

        let answer
        try {
            answer = await Answer.create({
                interviewId: id,
                userId,
                questionId,
                rawTranscript: rawTranscript || null,
                transcript: transcript || null,
                answerOrder: currentQuestionIndex + 1,
                duration: duration || 0,
                timeLimitExceeded: timeLimitExceeded || false,
                status,
                score: evaluation.score,
                feedback: evaluation.feedback,
                breakdown: evaluation.breakdown
            })
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Answer already submitted for this question'
                })
            }
            throw err
        }

        const updatedInterview = await Interview.findOneAndUpdate(
            { _id: id, userId, status: 'in_progress', currentQuestionIndex },
            { $inc: { currentQuestionIndex: 1 } },
            { new: true }
        )

        if (!updatedInterview) {
            return res.status(409).json({
                success: false,
                message: 'Answer already processed for this question'
            })
        }

        const isLast = updatedInterview.currentQuestionIndex >= questionIds.length

        return res.status(201).json({
            success: true,
            data: {
                answer,
                isLastQuestion: isLast,
                nextIndex: isLast ? null : updatedInterview.currentQuestionIndex
            }
        })
    } catch (err) {
        next(err)
    }
}

async function completeInterview(req, res, next) {
    try {
        const userId = req.user._id
        const { id } = req.params

        const interview = await Interview.findById(id)
        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' })
        }

        if (interview.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' })
        }

        if (interview.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                message: `Interview is already ${interview.status}`
            })
        }

        const answers = await Answer.find({ interviewId: id })

        if (answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot complete interview with no answers'
            })
        }

        const validAnswers = answers.filter(a => a.status === 'submitted')
        const totalQuestions = interview.questionIds.length
        const overallScore = validAnswers.length > 0
            ? Math.round(validAnswers.reduce((sum, a) => sum + a.score, 0) / totalQuestions)
            : 0

        let overallFeedback
        if (validAnswers.length === 0) {
            overallFeedback = {
                strengths: [],
                improvements: ['No valid answers submitted'],
                suggestion: 'Try attempting questions seriously for useful feedback'
            }
        } else {
            const strengths    = [...new Set(answers.flatMap(a => a.feedback?.strengths    ?? []))]
            const improvements = [...new Set(answers.flatMap(a => a.feedback?.improvements ?? []))]
            overallFeedback = {
                strengths:    strengths.slice(0, 5),
                improvements: improvements.slice(0, 5),
                suggestion:   null
            }
        }

        interview.status       = 'completed'
        interview.overallScore = overallScore
        interview.overallFeedback = overallFeedback
        await interview.save()

        return res.status(200).json({
            success: true,
            data: {
                interviewId: interview.id,
                overallScore,
                overallFeedback: interview.overallFeedback,
                totalAnswers: answers.length
            }
        })
    } catch (err) {
        next(err)
    }
}

async function abandonInterview(req, res, next) {
    try {
        const userId = req.user._id
        const { id } = req.params

        const interview = await Interview.findById(id)
        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' })
        }

        if (interview.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' })
        }

        if (interview.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                message: `Interview is already ${interview.status}`
            })
        }

        interview.status = 'abandoned'
        await interview.save()

        return res.status(200).json({
            success: true,
            message: 'Interview abandoned'
        })
    } catch (err) {
        next(err)
    }
}

async function getHistory(req, res, next) {
    try {
        const userId = req.user._id
        const { page = 1, limit = 10, status } = req.query

        const filter = { userId }
        if (status) filter.status = status

        const skip = (Number(page) - 1) * Number(limit)

        const [interviews, total] = await Promise.all([
            Interview.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .select('-questionIds -answerIds')
                .lean(),
            Interview.countDocuments(filter)
        ])

        return res.status(200).json({
            success: true,
            data: {
                interviews,
                pagination: {
                    total,
                    page:       Number(page),
                    totalPages: Math.ceil(total / Number(limit))
                }
            }
        })
    } catch (err) {
        next(err)
    }
}

async function getInterviewSession(req, res, next) {
    try {
        const userId = req.user._id
        const { id } = req.params

        const interview = await Interview.findById(id).lean()
        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' })
        }

        if (interview.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' })
        }

        const answers = await Answer.find({ interviewId: id })
            .populate('questionId', 'text expectedKeywords bestResponse')
            .sort({ answerOrder: 1 })
            .lean()
        
        let currentQuestion = null
        if (interview.status === 'in_progress' && interview.currentQuestionIndex < interview.questionIds.length) {
            currentQuestion = await Question.findById(interview.questionIds[interview.currentQuestionIndex]).lean()
        }

        return res.status(200).json({
            success: true,
            data: {
                interview,
                answers,
                currentQuestion: currentQuestion ? {
                    index: interview.currentQuestionIndex,
                    total: interview.questionIds.length,
                    question: currentQuestion
                } : null
            }
        })
    } catch (err) {
        next(err)
    }
}

async function getSetupConfig(req, res, next) {
    try {
        return res.status(200).json({
            success: true,
            data: {
                roles: ROLE_SPECIALIZATION_MAP,
                levels: LEVELS,
                interviewTypes: INTERVIEW_TYPES,
                questionOptions: INTERVIEW_QUESTION_LIMITS.options
            }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    startInterview,
    getCurrentQuestion,
    submitAnswer,
    completeInterview,
    abandonInterview,
    getHistory,
    getSetupConfig,
    getInterviewSession
}