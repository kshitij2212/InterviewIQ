const express = require('express')
const router = express.Router()
const {
    startInterview,
    getCurrentQuestion,
    submitAnswer,
    completeInterview,
    abandonInterview,
    getHistory,
    getSetupConfig,
    getInterviewSession,
    reattemptInterview
} = require('../controllers/InterviewControllers')
const authMiddleware = require('../middleware/authMiddleware')
const { apiLimiter } = require('../middleware/rateLimiter')

router.use(authMiddleware)
router.use(apiLimiter)

router.get('/setup', getSetupConfig)
router.get('/history', getHistory)
router.post('/start', startInterview)

router.get('/:id', getInterviewSession)

router.get('/:id/question', getCurrentQuestion)
router.post('/:id/answer', submitAnswer)
router.post('/:id/complete', completeInterview)
router.post('/:id/abandon', abandonInterview)
router.post('/:id/reattempt', reattemptInterview)

module.exports = router
