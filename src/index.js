const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { database } = require('./config')

const app = express()

// Setting up environment variables
dotenv.config()
const port = process.env.APP_PORT || 8090

// Connecting to MongoDB
database()

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('<h1>You are connected to Consulstation APIs!</h1>')
})

// Importing routes
require('./api/v1/routes')(app)

app.get('*', (req, res) => {
  res.send('<h1>Invalid enpoint!</h1>')
})

app.listen(port, () => {
  console.log(`Listening on port:${port}`)
})
