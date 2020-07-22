const express = require('express')
const http = require('http')
const {PORT} = require('./config/config')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

const {sendMessage, readMessages} = require('./chat')

app.use(express.static('client'))

io.on('connection',  async (socket) =>{
    socket.on('new-user-login', resp => {
    io.emit('user', resp)
  })

  socket.on('add-message', async (data) => {
    await sendMessage(data.from, data.message)

    readMessages(io)
  })

})

server.listen(PORT, () => {

})

