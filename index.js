const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
const send = require('koa-send')

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500
    ctx.body = { message: err.message }
  }
})

app.use(async ctx => {
  if (ctx.path === '/') {
    await send(ctx, ctx.path + 'index.html', { root: __dirname + '/static' })
  } else {
    await send(ctx, ctx.path, { root: __dirname + '/static' })
  }
})

let waiting = []
let matched = {}

io.on('connection', function (socket) {
  const log = function (...args) {
    args.unshift('From server:')
    socket.emit('log', args)
  }

  log('socket connected', socket.id)

  socket.on('look for peer', function () {
    let myIndex = waiting.indexOf(socket.id)
    if (myIndex !== -1) {
      waiting.splice(myIndex, 1)
    }

    while (waiting.length) {
      let index = Math.floor(Math.random() * waiting.length)
      let id = waiting[index]
      waiting.splice(index, 1)

      if (io.sockets.connected[id]) {
        matched[id] = socket.id
        matched[socket.id] = id
        socket.emit('find peer')
        log('find peer')
        return
      }
    }

    waiting.push(socket.id)
    log('waiting')
  })

  socket.on('hangup', function () {
    let id = matched[socket.id]
    if (id) {
      delete matched[socket.id]
      delete matched[id]
      io.sockets.connected[id].emit('restart')
    }
  })

  socket.on('disconnect', function () {
    let id = matched[socket.id]
    if (id) {
      delete matched[socket.id]
      delete matched[id]
      io.sockets.connected[id].emit('restart')
    }
  })

  socket.on('signal', function (msg) {
    let id = matched[socket.id]

    if (id && io.sockets.connected[id]) {
      io.sockets.connected[id].emit('signal', { type: msg.type, data: msg.data })
    }
  })
})

server.listen(process.env.PORT || 5000)
