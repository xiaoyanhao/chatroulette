const iceCandidate = function (event) {
  if (event.candidate) {
    this.socket.emit('signal', {
      type: 'icecandidate',
      data: event.candidate
    })
  }
}

const track = function (event) {
  this.remoteStream = event.streams[0]
}

const addStream = function (event) {
  this.remoteStream = event.stream
}

const removeStream = function (event) {
  this.remoteStream = null
}

const iceConnectionStateChange = function (event) {
  console.log('iceConnectionState changes to', event.target.iceConnectionState)
}

const negotiationNeeded = function (event) {
  if (this.connectionState === 'closed') {
    this.connectionState = 'connecting'
    this.socket.emit('look for peer')
  }
}

const dataChannelState = function (event) {
  let readyState = event.target.readyState
  this.connectionState = readyState
  console.log('Data channel state changes to', readyState)
}

const dataChannelError = function (event) {
  console.error(event.name, event.message)
}

const dataChannelMessage = function (event) {
  let message = JSON.parse(event.data)

  switch (message.type) {
    case 'message':
      this.messages.push(message.payload)
      break
    case 'canvas':
      this.remoteCanvas = message.payload
      break
    default:
      break
  }
}

const dataChannelBufferedAmountLow = function (event) {
  console.log(event.target.bufferedAmountLowThreshold)
}

const dataChannel = function (event) {
  this.dataChannel = event.channel
  this.dataChannel.addEventListener('open', dataChannelState.bind(this))
  this.dataChannel.addEventListener('close', dataChannelState.bind(this))
  this.dataChannel.addEventListener('error', dataChannelError.bind(this))
  this.dataChannel.addEventListener('message', dataChannelMessage.bind(this))
  this.dataChannel.addEventListener('bufferedamountlow', dataChannelBufferedAmountLow.bind(this))
}

export default {
  addLocalStream (state, stream) {
    state.localStream = stream
    if (state.hasTrack) {
      stream.getTracks().forEach(track => state.peerConnection.addTrack(track, stream))
    } else {
      state.peerConnection.addStream(stream)
    }
  },

  removeLocalStream (state) {
    if (state.hasTrack) {
      state.localStream.getTracks().forEach(track => track.stop())
    } else {
      state.localStream = null
    }
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
    state.peerConnection.addEventListener('datachannel', dataChannel.bind(state))

    if (state.hasTrack) {
      state.peerConnection.addEventListener('track', track.bind(state))
    } else {
      state.peerConnection.addEventListener('addstream', addStream.bind(state))
    }
  },

  closePeerConnection (state) {
    state.remoteStream = null
    state.peerConnection.removeEventListener('icecandidate', iceCandidate)
    state.peerConnection.removeEventListener('track', track)
    state.peerConnection.removeEventListener('addstream', addStream)
    state.peerConnection.removeEventListener('removestream', removeStream)
    state.peerConnection.removeEventListener('iceconnectionstatechange', iceConnectionStateChange)
    state.peerConnection.removeEventListener('negotiationneeded', negotiationNeeded)
    state.peerConnection.close()
    state.peerConnection = null
    state.socket.emit('hangup')
  },

  createDataChannel (state) {
    state.dataChannel = state.peerConnection.createDataChannel('dataChannel')
    state.dataChannel.addEventListener('open', dataChannelState.bind(state))
    state.dataChannel.addEventListener('close', dataChannelState.bind(state))
    state.dataChannel.addEventListener('error', dataChannelError.bind(state))
    state.dataChannel.addEventListener('message', dataChannelMessage.bind(state))
    state.dataChannel.addEventListener('bufferedamountlow', dataChannelBufferedAmountLow.bind(state))
  },

  closeDataChannel (state) {
    if (!state.dataChannel) {
      state.connectionState = 'closed'
      return
    }
    state.dataChannel.removeEventListener('open', dataChannelState)
    state.dataChannel.removeEventListener('close', dataChannelState)
    state.dataChannel.removeEventListener('error', dataChannelError)
    state.dataChannel.removeEventListener('message', dataChannelMessage)
    state.dataChannel.removeEventListener('bufferedamountlow', dataChannelBufferedAmountLow)
    state.dataChannel.close()
    state.dataChannel = null
  },

  showCanvas (state) {
    state.showCanvas = !state.showCanvas
  },

  clearMessages (state) {
    state.messages.splice(0)
  },

  addMessage (state, message) {
    state.messages.push(message)
  }
}
