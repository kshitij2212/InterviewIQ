const { body } = require('express-validator')

const registerSchema = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

const loginSchema = [
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
]

module.exports = { registerSchema, loginSchema }
