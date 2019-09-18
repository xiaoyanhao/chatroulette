const WebSocket = require('ws')
const crypto = require('crypto')
const port = 8081

const wsServer = new WebSocket.Server({
  port,
  clientTracking: true
})

const idLen = 8
let waitingQueue = []
let matchedIds = new Map()

function log (text) {
  const time = new Date()
  console.log('[' + time.toLocaleString() + '] ' + text)
}

function getPeerSocket (peerId) {
  for (let client of wsServer.clients) {
    if (client.id === peerId && client.readyState === WebSocket.OPEN) {
      return client
    }
  }

  return null
}

function searchPeer (socket, msg) {
  while (waitingQueue.length) {
    let index = Math.floor(Math.random() * waitingQueue.length)
    let peerId = waitingQueue[index]
    let peerSocket = getPeerSocket(peerId)

    waitingQueue.splice(index, 1)

    if (peerSocket) {
      matchedIds.set(socket.id, peerId)
      matchedIds.set(peerId, socket.id)
      socket.send(JSON.stringify(msg))
      log(`#${socket.id} matches #${peerId}`)
      return
    }
  }

  waitingQueue.push(socket.id)
  log(`#${socket.id} adds self into waiting queue`)
}

function hangUp (socketId, msg) {
  if (matchedIds.has(socketId)) {
    let peerId = matchedIds.get(socketId)
    let peerSocket = getPeerSocket(peerId)

    matchedIds.delete(socketId)
    matchedIds.delete(peerId)

    if (peerSocket) {
      peerSocket.send(JSON.stringify(msg))
      log(`#${socketId} hangs up #${peerId}`)
      return
    }
  } else {
    let myIndex = waitingQueue.indexOf(socketId)
    if (myIndex !== -1) {
      waitingQueue.splice(myIndex, 1)
      log(`#${socketId} removes self from waiting queue`)
    }
  }
}

function sendToPeer (socketId, msg) {
  if (!matchedIds.has(socketId)) {
    return
  }

  let peerId = matchedIds.get(socketId)
  let peerSocket = getPeerSocket(peerId)

  if (peerSocket) {
    peerSocket.send(JSON.stringify({ type: msg.type, data: msg.data }))
    log(`#${socketId} sends ${msg.type} to #${peerId}`)
    return
  }
}

wsServer.on('connection', function (socket) {
  socket.id = crypto.randomBytes(idLen / 2).toString('hex').slice(0, idLen)

  log(`#${socket.id} connected`)

  socket.on('message', (message) => {
    let msg = JSON.parse(message)

    switch (msg.type) {
      case 'new-ice-candidate':
      case 'video-offer':
      case 'video-answer':
      case 'message':
      case 'canvas':
        sendToPeer(socket.id, msg)
        break
      case 'hang-up':
        hangUp(socket.id, { type: 'hang-up' })
        break
      case 'search-peer':
        searchPeer(socket, { type: 'peer-matched' })
        break
      case 'ping':
        socket.send(JSON.stringify({ type: 'pong' }))
        break
      default:
        break
    }
  })

  socket.on('close', (code, reason) => {
    log(`#${socket.id} disconnected: [${code}]${reason}`)
    hangUp(socket.id, { type: 'hang-up' })
  })
})

module.exports = {
  productionSourceMap: false
}
