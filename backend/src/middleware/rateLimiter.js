const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, 
    skipSuccessfulRequests: true, 
    keyGenerator: (req) => {
        const email = req.body.email ? String(req.body.email).toLowerCase().trim() : 'anonymous'
        return `${req.ip}_${email}`
    },
    message: {
        success: false,
        message: 'Too many failed login attempts for this email. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = { apiLimiter, authLimiter }
