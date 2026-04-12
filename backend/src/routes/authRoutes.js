const express = require('express')
const router = express.Router()

const { register, login, googleAuth, getMe, updateMe } = require('../controllers/AuthControllers')
const authMiddleware = require('../middleware/authMiddleware')
const { apiLimiter, authLimiter } = require('../middleware/rateLimiter')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../validations/authValidation')

router.use(apiLimiter)

router.post('/register', authLimiter, registerSchema, validate, register)
router.post('/login', authLimiter, loginSchema, validate, login)
router.post('/google', authLimiter, googleAuth)
router.get('/me', authMiddleware, getMe)
router.put('/me', authMiddleware, updateMe)

module.exports = router