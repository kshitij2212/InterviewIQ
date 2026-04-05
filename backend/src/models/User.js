const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email'
            ]
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

        planType: {
            type: String,
            enum: ['free', 'pro'],
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
            type: Date,
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
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastDate = this.dailyInterviewDate
        ? new Date(this.dailyInterviewDate).setHours(0, 0, 0, 0)
        : null

    if (lastDate !== today.getTime()) {
        this.dailyInterviewCount = 0
        this.dailyInterviewDate = today
    }

    const limit = this.isProActive() ? Infinity : 5
    return this.dailyInterviewCount < limit
}

module.exports = mongoose.model('User', userSchema)