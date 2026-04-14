const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

function generateToken(userId) {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
}

function sanitizeUser(user) {
    return {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        avatar:    user.avatar || null,
        googleId:  user.googleId || null,
        planType:  user.planType || 'free',
        createdAt: user.createdAt
    }
}


async function register(req, res, next) {
    try {
        let { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            })
        }

        email = email.toLowerCase().trim()

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            })
        }

        const user = await User.create({ name, email, password })

        const token = generateToken(user._id)

        return res.status(201).json({
            success: true,
            token,
            data: { user: sanitizeUser(user) }
        })
    } catch (err) {
        next(err)
    }
}


async function login(req, res, next) {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        email = email.toLowerCase().trim()
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: 'This account uses Google login. Please sign in with Google.'
            })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const token = generateToken(user._id)

        return res.status(200).json({
            success: true,
            token,
            data: { user: sanitizeUser(user) }
        })
    } catch (err) {
        next(err)
    }
}


async function googleAuth(req, res, next) {
    try {
        const { idToken } = req.body

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: 'Google ID token is required'
            })
        }

        let payload
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            payload = ticket.getPayload()
        } catch {
            return res.status(401).json({
                success: false,
                message: 'Invalid Google token'
            })
        }

        const { sub: googleId, email: rawEmail, name, picture } = payload

        if (!rawEmail) {
            return res.status(400).json({
                success: false,
                message: 'Google account has no email'
            })
        }

        const email = rawEmail.toLowerCase().trim()
        let user = await User.findOne({ googleId })

        if (!user) {
            user = await User.findOne({ email })

            if (user) {
                user.googleId = googleId
                if (!user.name)   user.name   = name
                if (!user.avatar) user.avatar = picture || null
                await user.save()
            } else {
                user = await User.create({ name, email, googleId, avatar: picture || null })
            }
        }

        const token = generateToken(user._id)

        return res.status(200).json({
            success: true,
            token,
            data: { user: sanitizeUser(user) }
        })
    } catch (err) {
        next(err)
    }
}


async function getMe(req, res, next) {
    try {
        const user = await User.findById(req.user._id).lean()
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: { user: sanitizeUser(user) }
        })
    } catch (err) {
        next(err)
    }
}


async function updateMe(req, res, next) {
    try {
        const { name } = req.body
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (name) user.name = name
        await user.save()

        return res.status(200).json({
            success: true,
            data: { user: sanitizeUser(user) }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { register, login, googleAuth, getMe, updateMe }