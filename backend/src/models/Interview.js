const mongoose = require('mongoose')
const { VALID_ROLES, LEVELS, INTERVIEW_TYPES, INTERVIEW_STATUS, ROLE_SPECIALIZATION_MAP } = require('../config/constants')

const interviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true,
            lowercase: true,
            enum: {
                values: VALID_ROLES,
                message: 'Invalid role: {VALUE}'
            }
        },

        specialization: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },

        level: {
            type: String,
            required: [true, 'Level is required'],
            enum: {
                values: LEVELS,
                message: 'Level must be: fresher | junior | senior'
            }
        },

        type: {
            type: String,
            required: [true, 'Interview type is required'],
            enum: {
                values: INTERVIEW_TYPES,
                message: 'Type must be: technical | hr'
            }
        },

        questionIds: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Question',
            default: [],
            validate: [
                {
                    validator: function (arr) { return arr.length >= 1 },
                    message: 'Interview must have at least one question'
                },
                {
                    validator: function (arr) {
                        const ids = arr.map(id => id.toString())
                        return ids.length === new Set(ids).size
                    },
                    message: 'questionIds must be unique — duplicate question detected'
                },
                {
                    validator: function (arr) {
                        return arr.every(id => mongoose.Types.ObjectId.isValid(id))
                    },
                    message: 'questionIds contains invalid ObjectId'
                }
            ]
        },

        currentQuestionIndex: {
            type: Number,
            default: 0,
            min: 0
        },

        overallScore: {
            type: Number,
            min: 0,
            max: 10,
            default: null
        },

        overallFeedback: {
            strengths:    { type: [String], default: [] },
            improvements: { type: [String], default: [] },
            suggestion:   { type: String,   default: null }
        },

        status: {
            type: String,
            enum: {
                values: INTERVIEW_STATUS,
                message: 'Status must be: in_progress | completed | abandoned'
            },
            default: 'in_progress',
            index: true
        },

        completedAt: {
            type: String,
            default: null
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
            }
        }
    }
)

interviewSchema.pre('save', function () {
    const allowedSpecs = ROLE_SPECIALIZATION_MAP[this.role]

    if (allowedSpecs !== null && !this.specialization) {
        throw new Error(`Specialization required for role "${this.role}". Allowed: ${allowedSpecs.join(', ')}`)
    }
    if (allowedSpecs !== null && this.specialization && !allowedSpecs.includes(this.specialization)) {
        throw new Error(`Invalid specialization "${this.specialization}" for role "${this.role}". Allowed: ${allowedSpecs.join(', ')}`)
    }

    if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
        this.completedAt = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    }
})

interviewSchema.index({ userId: 1, createdAt: -1 })
interviewSchema.index({ status: 1, role: 1, level: 1 })

module.exports = mongoose.model('Interview', interviewSchema)