const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const questionRoutes = require('./routes/questionRoutes')
const interviewRoutes = require('./routes/interviewRoutes')
const transcribeRoutes = require('./routes/transcribeRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

const app = express()
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(morgan('dev'))
app.use(compression())
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("InterviewIQ backend is running")
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/questions', questionRoutes)
app.use('/api/v1/interviews', interviewRoutes)
app.use('/api/v1/transcribe', transcribeRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use(notFound)
app.use(errorHandler)

module.exports = app;