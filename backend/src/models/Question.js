const mongoose = require('mongoose')
const { VALID_ROLES, LEVELS, QUESTION_TYPES } = require('../config/constants')

function validateSpecialization(role, specialization) {
    const allowedSpecs = ROLE_SPECIALIZATION_MAP[role]
    if (allowedSpecs === null) return null          

    if (!specialization) {
        return `Specialization is required for role "${role}". Allowed: ${allowedSpecs.join(', ')}`
    }
    if (!allowedSpecs.includes(specialization)) {
        return `Invalid specialization "${specialization}" for role "${role}". Allowed: ${allowedSpecs.join(', ')}`
    }
    return null
}

function normalizeText(text) {
    if (typeof text !== 'string') return ''
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
}

function normalizeKeywords(keywords) {
    return [
        ...new Set(
            keywords
                .filter(k => typeof k === 'string')
                .map(k => k.trim().toLowerCase())
                .filter(k => k.length > 0)
        )
    ]
}

const questionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Question text is required'],
            trim: true
        },
        normalizedText: {
            type: String,
            index: true
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true,
            lowercase: true,
            enum: {
                values: VALID_ROLES,
                message: 'Invalid role "{VALUE}". Allowed: ' + VALID_ROLES.join(', ')
            }
        },
        specialization: {
            type: String,
            trim: true,
            lowercase: true
        },
        level: {
            type: String,
            enum: {
                values: LEVELS,
                message: 'Level must be: fresher | junior | senior'
            },
            required: [true, 'Level is required']
        },
        questionType: {
            type: String,
            enum: {
                values: QUESTION_TYPES,
                message: 'Type must be: technical | hr | dsa | system_design'
            },
            required: [true, 'Question type is required']
        },
        expectedKeywords: {
            type: [String],
            default: []
        },
        hint: {
            type: String,
            trim: true,
            default: ''
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: function (doc, ret) {
                ret.id = ret._id.toString()
                delete ret._id
                delete ret.normalizedText
            }
        }
    }
)

questionSchema.pre('save', function (next) {
    const error = validateSpecialization(this.role, this.specialization)
    if (error) return next(new Error(error))

    if (!this.normalizedText || this.isModified('text')) {
        this.normalizedText = normalizeText(this.text)
    }

    if (this.isModified('expectedKeywords')) {
        this.expectedKeywords = normalizeKeywords(this.expectedKeywords)
    }

    next()
})

questionSchema.pre(['updateOne', 'updateMany'], async function (next) {
    this.options.runValidators = true
    this.options.context = 'query'

    const update = this.getUpdate()
    if (!update.$set) update.$set = {}

    const incomingRole           = update.$set.role           ?? update.role
    const incomingSpecialization = update.$set.specialization ?? update.specialization
    const incomingText           = update.$set.text           ?? update.text
    const incomingKeywords       = update.$set.expectedKeywords ?? update.expectedKeywords

    if (incomingRole !== undefined || incomingSpecialization !== undefined) {
        const existing = await this.model.findOne(this.getQuery()).lean()
        if (!existing) return next(new Error('Document not found'))

        const finalRole           = incomingRole           ?? existing.role
        const finalSpecialization = incomingSpecialization ?? existing.specialization

        const error = validateSpecialization(finalRole, finalSpecialization)
        if (error) return next(new Error(error))
    }

    if (incomingText !== undefined) {
        update.$set.normalizedText = normalizeText(incomingText)
    }

    if (incomingKeywords !== undefined) {
        update.$set.expectedKeywords = normalizeKeywords(incomingKeywords)
    }

    const rootFields = ['role', 'specialization', 'text', 'expectedKeywords']
    rootFields.forEach(field => delete update[field])

    next()
})

questionSchema.index(
    { active: 1, role: 1, specialization: 1, level: 1, questionType: 1 }
)
questionSchema.index(
    { normalizedText: 1, role: 1, level: 1, questionType: 1 },
    {
        unique: true,
        partialFilterExpression: { active: true }
    }
)

module.exports = mongoose.model('Question', questionSchema)