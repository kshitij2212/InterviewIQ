const multer = require('multer')
const path = require('path')
const os = require('os')

const ALLOWED_MIME_TYPES = [
    'audio/webm',
    'audio/mp4',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/opus',
    'audio/ogg; codecs=opus'
]

const MAX_SIZE_MB = 25

const storage = multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname) || '.webm'
        // Groq Whisper expects specific extensions. Map .opus to .ogg
        if (ext === '.opus') ext = '.ogg'
        cb(null, `audio_${Date.now()}${ext}`)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error(`Unsupported audio format. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`))
        }
    }
})

module.exports = upload