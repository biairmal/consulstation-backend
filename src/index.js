const express = require('express')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const config = require('./config')
const routes = require('./api/v1/routes')

const app = express()

// Setting up environment variables
dotenv.config()
const port = process.env.APP_PORT || 8090

// Database connection
config.database(() => {
  app.listen(port, () => {
    console.log(`Listening on port:${port}`)
  })
})

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Importing routes
app.get('/api', (req, res) => {
  res.send('You are connected to Consulstation APIs!')
})
routes.forEach((route) => app.use('/api', route))
