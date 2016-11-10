import io from 'socket.io-client'

export default {
  messages: [],
  peerConnection: null,
  iceConnectionState: 'closed',
  localStream: null,
  remoteStream: null,
  hasTrack: false,
  socket: io()
}
