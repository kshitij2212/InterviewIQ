const { ValidationError } = require('mongoose').Error

function errorHandler(err, req, res, next) {
    let error = { ...err }
    error.message = err.message

    if (process.env.NODE_ENV !== 'production') {
        console.error('ERROR :', err)
    }
    if (err instanceof ValidationError || err.name === 'ValidationError') {
        const messages = Object.values(err.errors || {}).map(e => e.message)
        return res.status(400).json({
            success: false,
            message: messages.length > 0 ? messages.join(', ') : err.message
        })
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field'
        return res.status(409).json({
            success: false,
            message: `Duplicate value for ${field}`
        })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`
        })
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        })
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        })
    }

    let statusCode = err.statusCode || 500
    
    const isValidationError = 
        err.name === 'ValidationError' || 
        err.message?.includes('required') || 
        err.message?.includes('Invalid') ||
        err.message?.startsWith('Specialization')

    if (isValidationError && statusCode === 500) {
        statusCode = 400
    }
    
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    })
}

module.exports = errorHandler