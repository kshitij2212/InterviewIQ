const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema(
    {
        interviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interview',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },

        rawTranscript: {
            type: String,
            default: null,
            trim: true
        },
        transcript: {
            type: String,
            default: null,
            trim: true
        },

        answerOrder: {
            type: Number,
            required: true,
            min: [1, 'Answer order cannot be less than 1']
        },

        duration: {
            type: Number,
            min: [0, 'Duration cannot be negative'],
            default: 0
        },
        timeLimitExceeded: {
            type: Boolean,
            default: false
        },
        hintUsed: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['submitted', 'skipped', 'timeout'],
            default: 'submitted'
        },

        score: {
            type: Number,
            min: 0,
            max: 10,
            default: null
        },
        feedback: {
            strengths: {
                type: [String],
                default: []
            },
            improvements: {
                type: [String],
                default: []
            },
            suggestion: {
                type: String,
                default: null
            }
        },
        breakdown: {
            content: {
                type: Number,
                min: 0,
                max: 10,
                default: null
            },
            keywords: {
                type: Number,
                min: 0,
                max: 10,
                default: null
            },
            communication: {
                type: Number,
                min: 0,
                max: 10,
                default: null
            }
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

answerSchema.index({ interviewId: 1, questionId: 1 }, { unique: true })
answerSchema.index({ interviewId: 1, answerOrder: 1 }, { unique: true })
answerSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Answer', answerSchema)