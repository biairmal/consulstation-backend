const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express()

dotenv.config()
const port = process.env.APP_PORT || 8090

// Connecting to MongoDB
mongoose
  .connect(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`)
  .then(() => {
    console.log(`Database ${process.env.DB_NAME} is now connected!`)
  })
  .catch((err) => {
    console.log(err)
  })

app.get('/', (req, res) => {
  res.send('<h1>You are connected to Consulstation APIs!</h1>')
})

app.get('*', (req, res) => {
  res.send('<h1>Invalid enpoint!</h1>')
})

app.listen(port, () => {
  console.log(`Listening on port:${port}`)
})
