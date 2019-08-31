import io from 'socket.io-client'

export default {
  peerConnection: null,
  localStream: null,
  remoteStream: null,
  isCanvasShown: false,
  remoteCanvas: {
    prev: { x: 0, y: 0 },
    curr: { x: 0, y: 0 },
    ctx: null,
    lineWidth: 1,
    strokeStyle: 'black',
    style: { width: 0, height: 0 }
  },
  messages: [],
  /**
   * open, connecting, closed
   */
  connectionState: 'closed',
  connectionConfig: {
    iceServers: [{
      urls: 'stun:stun.stunprotocol.org'
    }]
  },
  mediaConstraints: {
    audio: true,
    video: {
      aspectRatio: {
        ideal: 1.333333 // 3:2 aspect is preferred
      }
    }
  },
  socket: io()
}
