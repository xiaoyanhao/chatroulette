import io from 'socket.io-client'

export default {
  peerConnection: null,
  dataChannel: null,
  localStream: null,
  remoteStream: null,
  showCanvas: false,
  remoteCanvas: {
    prev: {x: 0, y: 0},
    curr: {x: 0, y: 0},
    ctx: null,
    lineWidth: 1,
    strokeStyle: 'black',
    style: {width: 0, height: 0}
  },
  hasTrack: false,
  messages: [],
  connectionState: 'closed',
  socket: io()
}
