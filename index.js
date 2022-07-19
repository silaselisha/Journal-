const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const journalRouter = require('./routes/journalRoute')
const JournalError = require('./utils/appError')
const globalErrorHandler = require('./controllers/error/errorHandler')
const catchAsync = require('./utils/catchAsync')

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json({limit: '10kb'}))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


app.use('/api/v1/journals', journalRouter)

app.all('*', catchAsync(async (req, res, next) => {
    const message = `${req.protocol}://${req.get('host')}/${req.originalUrl} has not yet been implemented in the server`

    next(new JournalError(message, 500))
}))

app.use(globalErrorHandler)

module.exports = app