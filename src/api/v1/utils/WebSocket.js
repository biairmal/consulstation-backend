const sessionStore = require('./sessionStore')

class WebSocket {
  connection(socket) {
    const users = []
    
    // create online users array
    for (let [id, socket] of io.of('/').sockets) {
      this.users.push({
        userID: id,
        username: socket.username,
      })
    }
    socket.emit('users', users)

    // notify existing users
    socket.broadcast.emit('user connected', {
      userID: socket.id,
      username: socket.username,
    })

    // show connected user
    socket.on('user connected', (socket) => {
      console.log('user connected', socket)
    })

    // send private message to specified user
    socket.on('private message', ({ content, to }) => {
      socket.to(to).emit('private message', {
        content,
        from: socket.id,
      })
    })

    // send session details to user
    socket.emit('session', {
      sessionID: socket.sessionID,
      userID: socket.userID,
    })

    // make the socket instance join the associated room
    socket.join(socket.userID)

    // update the forwarding handler
    socket.on('private message', ({ content, to }) => {
      socket.to(to).to(socket.userID).emit('private message', {
        content: content,
        from: socket.userID,
        to: to,
      })
    })

    socket.on('disconnect', async () => {
      const matchingSockets = await global.io.in(socket.userID).allSockets()
      const isDisconnected = matchingSockets.size = 0
      if(isDisconnected) {
        // notify other users
        socket.broadcast.emit('users disconnected', socket.userID)

        // update the connection status of the session
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          connected: false,
        })
      }
    })
  }
}

module.exports = new WebSocket()
