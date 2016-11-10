import {log} from '../logger'

const iceCandidate = function (event) {
  if (event.candidate) {
    this.socket.emit('ice candidate', event.candidate)
    log('send ice candidate')
  }
}

const track = function (event) {
  this.remoteStream = event.streams[0]
  log('add remote track')
}

const addStream = function (event) {
  this.remoteStream = event.stream
  log('add remote stream')
}

const removeStream = function (event) {
  this.remoteStream = null
  log('remove remote stream')
}

const iceConnectionStateChange = function (event) {
  if (event.target) {
    this.iceConnectionState = event.target.iceConnectionState
  }
}

const negotiationNeeded = function (event) {
  this.socket.emit('look for peer')
  log('negotiation needed')
}

export default {
  addLocalStream (state, stream) {
    state.localStream = stream
    if (state.hasTrack) {
      stream.getTracks().forEach(track => state.peerConnection.addTrack(track, stream))
    } else {
      state.peerConnection.addStream(stream)
    }
    log('add local stream')
  },

  removeLocalStream (state) {
    if (state.hasTrack) {
      state.localStream.getTracks().forEach(track => track.stop())
    }
    state.localStream = null
    log('remove local stream')
  },

  createPeerConnection (state) {
    // let configuration = {
    //   iceServers: [
    //     {urls: 'stun:23.21.150.121'},
    //     {urls: 'stun:stun.l.google.com:19302'},
    //     {urls: 'turn:numb.viagenie.ca', credential: 'webrtcdemo', username: 'louis%40mozilla.com'}
    //   ]
    // }

    let PeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
    state.peerConnection = new PeerConnection(null)

    state.hasTrack = !!state.peerConnection.addTrack

    state.peerConnection.addEventListener('icecandidate', iceCandidate.bind(state))
    state.peerConnection.addEventListener('removestream', removeStream.bind(state))
    state.peerConnection.addEventListener('iceconnectionstatechange', iceConnectionStateChange.bind(state))
    state.peerConnection.addEventListener('negotiationneeded', negotiationNeeded.bind(state))

    if (state.hasTrack) {
      state.peerConnection.addEventListener('track', track.bind(state))
    } else {
      state.peerConnection.addEventListener('addstream', addStream.bind(state))
    }
  },

  closePeerConnection (state) {
    if (state.peerConnection) {
      state.peerConnection.removeEventListener('icecandidate', iceCandidate)
      state.peerConnection.removeEventListener('track', track)
      state.peerConnection.removeEventListener('addstream', addStream)
      state.peerConnection.removeEventListener('removestream', removeStream)
      state.peerConnection.removeEventListener('iceconnectionstatechange', iceConnectionStateChange)
      state.peerConnection.removeEventListener('negotiationneeded', negotiationNeeded)
      state.peerConnection.close()
      state.peerConnection = null
      state.socket.emit('disconnect')
    }
  },

  lookForPeer (state) {
    state.socket.emit('look for peer')
  },

  clearMessages (state) {
    state.messages.splice(0)
  },

  addMessage (state, message) {
    state.messages.push(message)
  }
}
