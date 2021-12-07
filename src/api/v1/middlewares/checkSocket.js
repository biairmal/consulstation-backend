module.exports = (socket, next) => {
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
}
