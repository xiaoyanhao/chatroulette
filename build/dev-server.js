var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = config.dev.env
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))


var server = require('http').createServer(app)
var io = require('socket.io')(server)
var waiting = []
var matched = {}

io.on('connection', function (socket) {
  var log = function () {
    var array = ['From server:']
    array.push.apply(array, arguments)
    socket.emit('log', array)
  }

  log('socket connected', socket.id)

  socket.on('look for peer', function () {

    var myIndex = waiting.indexOf(socket.id)
    if (myIndex != -1) {
      waiting.splice(myIndex, 1)
    }

    while (waiting.length) {
      var index = Math.floor(Math.random() * waiting.length)
      var id = waiting[index]
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
    var id = matched[socket.id]
    if (id) {
      delete matched[socket.id]
      delete matched[id]
      io.sockets.connected[id].emit('restart')
    }    
  })

  socket.on('disconnect', function () {
    var id = matched[socket.id]
    if (id) {
      delete matched[socket.id]
      delete matched[id]
      io.sockets.connected[id].emit('restart')
    }
  })

  socket.on('signal', function (msg) {
    var id = matched[socket.id]

    if (id && io.sockets.connected[id]) {
      io.sockets.connected[id].emit('signal', {type: msg.type, data: msg.data})
    }
  })
})

module.exports = server.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')
  // opn(uri)
})
