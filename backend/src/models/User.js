const mongoose = require('mongoose')
const bcrypt   = require('bcrypt')
const { PLAN_TYPES, DAILY_INTERVIEW_LIMIT } = require('../config/constants')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: function () { return !this.googleId },
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/,'Please enter a valid email']
        },
        password: {
            type: String,
            required: function () { return !this.googleId },
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
            default: null
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        avatar: {
            type: String,
            default: null
        },
        planType: {
            type: String,
            enum: PLAN_TYPES,
            default: 'free'
        },
        planExpiresAt: {
            type: Date,
            default: null
        },

        razorpayOrderId: {
            type: String,
            default: null
        },
        razorpayPaymentId: {
            type: String,
            default: null
        },

        dailyInterviewCount: {
            type: Number,
            default: 0
        },

        dailyInterviewDate: {
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
                delete ret.password
                delete ret.googleId
                delete ret.razorpayOrderId
                delete ret.razorpayPaymentId
            }
        }
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    if (!this.password) return next()
    const salt    = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate()
    if (!update.$set) update.$set = {}

    const newPassword = update.$set.password ?? update.password

    if (newPassword) {
        const salt = await bcrypt.genSalt(10)
        update.$set.password = await bcrypt.hash(newPassword, salt)
        delete update.password
    }

    next()
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false
    return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.isProActive = function () {
    if (this.planType !== 'pro') return false
    if (!this.planExpiresAt) return false
    return new Date() < new Date(this.planExpiresAt)
}

userSchema.methods.canStartInterview = function () {
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

    const effectiveCount = this.dailyInterviewDate !== todayStr
        ? 0
        : this.dailyInterviewCount

    return this.isProActive() || effectiveCount < DAILY_INTERVIEW_LIMIT
}

module.exports = mongoose.model('User', userSchema)