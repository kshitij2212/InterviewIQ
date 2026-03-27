const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res) => {
    res.send("InterviewIQ backend is running")
})

module.exports = app;