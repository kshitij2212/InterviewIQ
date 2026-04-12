const fs = require('fs')
const { transcribeAudio } = require('../services/transcribeAudio')

async function transcribe(req, res, next) {
    const filePath = req.file?.path

    try {
        if (!filePath) {
            return res.status(400).json({
                success: false,
                message: 'Audio file is required'
            })
        }

        const transcript = await transcribeAudio(filePath, req.file.mimetype)

        return res.status(200).json({
            success: true,
            data: { transcript }
        })
    } catch (err) {
        next(err)
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, () => {})
        }
    }
}

module.exports = { transcribe }