const express = require('express')
const router = express.Router()
const upload = require('../middleware/uploadAudio')
const { transcribe } = require('../controllers/transcribeControllers')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, upload.single('audio'), transcribe)

module.exports = router