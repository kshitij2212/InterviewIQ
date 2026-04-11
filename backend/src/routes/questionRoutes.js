const express = require('express')
const router = express.Router()
const {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkImport
} = require('../controllers/QuestionControllers')
const authMiddleware = require('../middleware/authMiddleware')
const { apiLimiter } = require('../middleware/rateLimiter')

router.use(apiLimiter)

router.get('/', authMiddleware, getQuestions)
router.get('/:id', authMiddleware, getQuestionById)

router.post('/', authMiddleware, createQuestion)
router.put('/:id', authMiddleware, updateQuestion)
router.delete('/:id', authMiddleware, deleteQuestion)

router.post('/bulk-import', authMiddleware, bulkImport)

module.exports = router
