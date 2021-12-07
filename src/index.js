const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const config = require('./config')
const dotenv = require('dotenv')
const http = require('http')
const routes = require('./api/v1/routes')
const { WebSocket } = require('./api/v1/utils')
const { checkSocket } = require('./api/v1/middlewares')

const io = require('socket.io')({
  cors: { origin: process.env.CORS_ORIGIN },
})

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
app.use(cors(corsOptions))
app.options(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
io.use((socket, next) => {
  // creating persistent session id
  const sessionID = socket.handhake.auth.sessionID
  if (sessionID) {
    //find existing session
    const session = sessionStore.findSession(sessionID)
    socket.userID = session.userID
    socket.username = session.username
    return next()
  }

  // check if username exists
  const username = socket.handshake.auth.username
  if (!username) {
    return next(new Error('Invalid username!'))
  }

  socket.sessionID = randomId()
  socket.userID = randomId()
  socket.username = username
  next()
})

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
global.io = io.listen(server)
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
