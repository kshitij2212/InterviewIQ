const groq = require('./groq')
const fs = require('fs')

async function transcribeAudio(filePath, mimeType = 'audio/webm') {
    const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-large-v3',
        response_format: 'text',
        language: 'en',
        prompt: 'Professional technical interview response in English, technical terms like Node.js, React, Backend, Frontend, DevOps, AI, ML.'
    })

    if (!transcription || typeof transcription !== 'string' || !transcription.trim()) {
        throw new Error('Whisper returned empty transcription')
    }

    return transcription.trim()
}

module.exports = { transcribeAudio }