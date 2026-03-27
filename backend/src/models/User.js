const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is required"],
        trim : true
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        trim : true,
        lowercase : true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters long"],
            select: false
        },
        googleId: {
            type: String,
            sparse: true
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
    return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)