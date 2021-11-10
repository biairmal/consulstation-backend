const express = require('express')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const config = require('./config')
const routes = require('./api/v1/routes')
const cors = require('cors')
const socketio = require('socket.io')()
const WebSocket = require('./api/v1/utils/WebSocket')
const http = require('http')
const { allowCors } = require('./api/v1/helpers')

const app = express()

// Setting up environment variables
dotenv.config()
const port = process.env.PORT || 8090

// Setting up cors policy
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

// Middlewares
// app.use(cors(corsOptions))
// app.options('*', cors())
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  next()
})
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Importing routes
app.get('/api', (req, res) => {
  res.send('You are connected to Consulstation APIs!')
})
routes.forEach((route) => app.use('/api', route))
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Invalid API endpoint!',
  })
})

// Create HTTP server
const server = http.createServer(app)

// Create socket connection
global.io = socketio.listen(server)
global.io.on('connection', WebSocket.connection)

// Database connection
config.database(() => {
  // Listen on provided port
  server.listen(port)
  // Event listener for HTTP server
  server.on('listening', () => {
    console.log(`Listening on port: ${port}`)
  })
})
