import util from '../util'

/**
 * Handle errors which occur when trying to access the local media
 * hardware; that is, exceptions thrown by getUserMedia(). The two most
 * likely scenarios are that the user has no camera and/or microphone
 * or that they declined to share their equipment when prompted. If
 * they simply opted not to share their media, that's not really an
 * error, so we won't present a message in that situation.
 */
function handleGetUserMediaError (err) {
  util.trace(err)

  switch (err.name) {
    case 'NotFoundError':
      alert('Unable to open your call because no camera and/or microphone were found.')
      break
    case 'SecurityError':
    case 'PermissionDeniedError':
      // Do nothing; this is the same as the user canceling the call.
      break
    default:
      alert('Error opening your camera and/or microphone: ' + err.message)
      break
  }
}

export default {
  /**
   * A new ICE candidate has been received from the other peer. Call
   * RTCPeerConnection.addIceCandidate() to send it along to the
   * local ICE framework.
   */
  addIceCandidate ({ state }, candidateInfo) {
    const candidate = new RTCIceCandidate(candidateInfo)
    util.log('*** Adding received ICE candidate: ' + JSON.stringify(candidate))
    return state.peerConnection.addIceCandidate(candidate)
  },

  setLocalDescription ({ state }, description) {
    util.log('---> Setting local description to the offer')
    return state.peerConnection.setLocalDescription(description)
  },

  setRemoteDescription ({ state }, sdp) {
    util.log('---> Setting remote description')
    const description = new RTCSessionDescription(sdp)
    return state.peerConnection.setRemoteDescription(description)
  },

  createOffer ({ state }) {
    util.log('---> Creating offer')
    return state.peerConnection.createOffer()
  },

  sendOfferToPeer ({ state }) {
    util.log('---> Sending the offer to the remote peer')
    state.socket.emit('video-offer', state.peerConnection.localDescription)
  },

  createAnswer ({ state }) {
    util.log('---> Creating answer')
    return state.peerConnection.createAnswer()
  },

  sendAnswerToPeer ({ state }) {
    util.log('---> Sending answer to the remote peer')
    state.socket.emit('video-answer', state.peerConnection.localDescription)
  },

  hangUpCall ({ state }) {
    util.log('---> Notify the remote peer to hang up the call')
    state.socket.emit('hang-up')
  },

  ping ({ state }) {
    state.socket.emit('ping')
  },

  getUserMedia ({ commit, state }) {
    return navigator.mediaDevices.getUserMedia(state.mediaConstraints)
      .then((mediaStream) => {
        commit('addLocalStream', mediaStream)
      })
      .catch((err) => {
        handleGetUserMediaError(err)
        // Make sure we shut down our end of the RTCPeerConnection so we're ready to try again.
        commit('closePeerConnection')
      })
  }
}
