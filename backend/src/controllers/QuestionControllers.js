const Question = require('../models/Question')
const { ROLE_SPECIALIZATION_MAP, LEVELS, QUESTION_TYPES } = require('../config/constants')


function buildFilterQuery(query) {
    const { role, specialization, level, questionType, active } = query
    const filter = {}

    if (role)             filter.role           = role.trim().toLowerCase()
    if (specialization)   filter.specialization = specialization.trim().toLowerCase()
    if (level)            filter.level          = level.trim().toLowerCase()
    if (questionType)     filter.questionType   = questionType.trim().toLowerCase()

    filter.active = active === 'false' ? false : true

    return filter
}

async function getQuestions(req, res, next) {
    try {
        const { page = 1, limit = 20 } = req.query
        const filter = buildFilterQuery(req.query)
        const skip = (Number(page) - 1) * Number(limit)

        const [questions, total] = await Promise.all([
            Question.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Question.countDocuments(filter)
        ])

        return res.status(200).json({
            success: true,
            data: {
                questions,
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

async function getQuestionById(req, res, next) {
    try {
        const question = await Question.findById(req.params.id).lean()
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' })
        }

        return res.status(200).json({ success: true, data: { question } })
    } catch (err) {
        next(err)
    }
}

async function createQuestion(req, res, next) {
    try {
        const { text, role, specialization, level, questionType, expectedKeywords } = req.body

        const question = await Question.create({
            text,
            role,
            specialization: specialization || null,
            level,
            questionType,
            expectedKeywords: expectedKeywords || []
        })

        return res.status(201).json({ success: true, data: { question } })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate question already exists for this role/level/type'
            })
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
        next(err)
    }
}

async function updateQuestion(req, res, next) {
    try {
        const { text, role, specialization, level, questionType, expectedKeywords, active } = req.body

        const question = await Question.findById(req.params.id)
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' })
        }

        // Only update provided fields
        if (text             !== undefined) question.text             = text
        if (role             !== undefined) question.role             = role
        if (specialization   !== undefined) question.specialization   = specialization
        if (level            !== undefined) question.level            = level
        if (questionType     !== undefined) question.questionType     = questionType
        if (expectedKeywords !== undefined) question.expectedKeywords = expectedKeywords
        if (active           !== undefined) question.active           = active

        await question.save() // pre('save') hooks run — normalizedText + validation

        return res.status(200).json({ success: true, data: { question } })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate question already exists for this role/level/type'
            })
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
        next(err)
    }
}

async function deleteQuestion(req, res, next) {
    try {
        const question = await Question.findById(req.params.id)
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' })
        }

        // Soft delete — never hard delete, interviews reference questionIds
        question.active = false
        await question.save()

        return res.status(200).json({ success: true, message: 'Question deactivated' })
    } catch (err) {
        next(err)
    }
}

async function bulkImport(req, res, next) {
    try {
        const { questions } = req.body

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'questions must be a non-empty array'
            })
        }

        if (questions.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Bulk import limit is 100 questions per request'
            })
        }

        const docs = questions
            .filter(q => q.text && typeof q.text === 'string' && q.text.trim())
            .map(q => ({
                text:             q.text.trim(),
                role:             q.role,
                specialization:   q.specialization || null,
                level:            q.level,
                questionType:     q.questionType,
                expectedKeywords: Array.isArray(q.expectedKeywords)
                    ? q.expectedKeywords.filter(k => typeof k === 'string' && k.trim())
                    : [],
                normalizedText: q.text.trim().toLowerCase().replace(/\s+/g, ' ')
            }))

        if (docs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid questions found in payload'
            })
        }

        let inserted = []
        let duplicateCount = 0

        try {
            inserted = await Question.insertMany(docs, { ordered: false })
        } catch (err) {
            if (err.writeErrors) {
                duplicateCount = err.writeErrors.filter(e => e.code === 11000).length
                const insertedNormalized = docs
                    .filter((_, i) => !err.writeErrors.find(e => e.index === i))
                    .map(d => d.normalizedText)

                if (insertedNormalized.length > 0) {
                    inserted = await Question.find({
                        normalizedText: { $in: insertedNormalized }
                    }).lean()
                }
            } else {
                throw err
            }
        }

        return res.status(201).json({
            success: true,
            data: {
                inserted:   inserted.length,
                duplicates: duplicateCount,
                failed:     docs.length - inserted.length - duplicateCount
            }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkImport
}