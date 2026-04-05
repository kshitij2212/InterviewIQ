const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Question text is required'],
            trim: true
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true,
            lowercase: true
        },
        domain: {
            type: String,
            required: [true, 'Domain is required'],
            trim: true,
            lowercase: true
        },
        specialization: {
            type: String,
            required: [true, 'Specialization is required'],
            trim: true,
            lowercase: true
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: [true, 'Level is required']
        },
        questionType: {
            type: String,
            enum: ['technical', 'hr', 'dsa', 'system_design'],
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
            }
        }
    }
)

questionSchema.pre('save', function (next) {
    if (this.isModified('expectedKeywords')) {
        this.expectedKeywords = [
            ...new Set(
                this.expectedKeywords
                    .map(k => k.trim().toLowerCase())
                    .filter(k => k.length > 0)
            )
        ]
    }
    next()
})

questionSchema.index(
    { role: 1, domain: 1, specialization: 1, level: 1, questionType: 1, active: 1 }
)

questionSchema.index(
    { text: 1, role: 1, domain: 1, specialization: 1, level: 1, questionType: 1 },
    { unique: true }
)

module.exports = mongoose.model('Question', questionSchema)