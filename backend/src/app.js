const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const questionRoutes = require('./routes/questionRoutes')
const interviewRoutes = require('./routes/interviewRoutes')

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("InterviewIQ backend is running")
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/questions', questionRoutes)
app.use('/api/v1/interviews', interviewRoutes)
app.use(notFound)
app.use(errorHandler)

module.exports = app;