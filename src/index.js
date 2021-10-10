const express = require('express')
const dotenv = require('dotenv')
const config = require('./config')

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

// Importing routes
app.get('/', (req, res) => {
  res.send('You are connected to Consulstation APIs!')
})
require('./api/v1/routes')(app)
