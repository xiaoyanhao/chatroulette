const port = 8081
const io = require('socket.io')(port)

let waiting = []
let matched = {}

function log (text) {
  const time = new Date()
  console.log('[' + time.toLocaleString() + '] ' + text)
}

function searchPeer (socket) {
  while (waiting.length) {
    let index = Math.floor(Math.random() * waiting.length)
    let id = waiting[index]
    waiting.splice(index, 1)

    if (io.sockets.connected[id]) {
      matched[id] = socket.id
      matched[socket.id] = id
      socket.emit('peer-matched')
      log(`#${socket.id} matched #${id}`)
      return
    }
  }

  waiting.push(socket.id)
  log(`#${socket.id} adds self into waiting queue`)
}

function hangUp (socketId) {
  let id = matched[socketId]

  if (id) {
    delete matched[socketId]
    delete matched[id]
    io.sockets.connected[id].emit('hang-up')
    log(`#${socketId} hang up #${id}`)
  } else {
    let myIndex = waiting.indexOf(socketId)
    if (myIndex !== -1) {
      waiting.splice(myIndex, 1)
      log(`#${socketId} removes self from waiting queue`)
    }
  }
}

function sendToPeer (socketId, event, msg) {
  let id = matched[socketId]

  if (id && io.sockets.connected[id]) {
    io.sockets.connected[id].emit(event, msg)
    log(`#${socketId} send ${event} to #${id}`)
  }
}

io.on('connection', function (socket) {
  log(`#${socket.id} socket connect`)

  socket.on('search-peer', () => {
    searchPeer(socket)
  })

  socket.on('hang-up', () => {
    hangUp(socket.id)
  })

  socket.on('disconnect', () => {
    log(`#${socket.id} socket disconnect`)
    hangUp(socket.id)
  })

  socket.on('video-offer', (msg) => {
    sendToPeer(socket.id, 'video-offer', msg)
  })

  socket.on('video-answer', (msg) => {
    sendToPeer(socket.id, 'video-answer', msg)
  })

  socket.on('new-ice-candidate', (msg) => {
    sendToPeer(socket.id, 'new-ice-candidate', msg)
  })

  socket.on('message', (msg) => {
    sendToPeer(socket.id, 'message', msg)
  })

  socket.on('canvas', (msg) => {
    sendToPeer(socket.id, 'canvas', msg)
  })
})

module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:' + port
      }
    }
  }
}
