import rootState from './state'
import util from '../util'

/**
 * Handles |icecandidate| events by forwarding the specified
 * ICE candidate (created by our local ICE agent) to the other
 * peer through the signaling server.
 */
function iceCandidateHandler (event) {
  if (event.candidate) {
    util.log('*** Outgoing ICE candidate: ' + event.candidate.candidate)
    rootState.socket.emit('new-ice-candidate', event.candidate)
  }
}

/**
 * Handle |iceconnectionstatechange| events. This will detect
 * when the ICE connection is closed, failed, or disconnected.
 * This is called when the state of the ICE agent changes.
 */
function iceConnectionStateChangeHandler (event) {
  util.log('*** ICE connection state changed to ' + event.target.iceConnectionState)

  switch (event.target.iceConnectionState) {
    case 'connected':
    case 'complete':
      rootState.connectionState = 'open'
      break
    case 'closed':
    case 'failed':
    case 'disconnected':
      closeVideoCall()
      break
  }
}

/**
 * Handle the |icegatheringstatechange| event. This lets us know what the
 * ICE engine is currently working on: "new" means no networking has happened
 * yet, "gathering" means the ICE engine is currently gathering candidates,
 * and "complete" means gathering is complete. Note that the engine can
 * alternate between "gathering" and "complete" repeatedly as needs and
 * circumstances change.
 */
function iceGatheringStateChangeHandler (event) {
  util.log('*** ICE gathering state changed to: ' + event.target.iceGatheringState)
}

/**
 * Set up a |signalingstatechange| event handler. This will detect when
 * the signaling connection is closed.
 */
function signalingStateChangeHandler (event) {
  util.log('*** WebRTC signaling state changed to: ' + event.target.signalingState)

  switch (event.target.signalingState) {
    case 'closed':
      closeVideoCall()
      break
  }
}

/**
 * Called by the WebRTC layer to let us know when it's time to
 * begin, resume, or restart ICE negotiation.
 */
function negotiationNeededHandler (event) {
  util.log('*** Negotiation needed')

  if (rootState.connectionState === 'closed') {
    rootState.connectionState = 'connecting'
    rootState.socket.emit('search-peer')
  }
}

/**
 * Called by the WebRTC layer when events occur on the media tracks
 * on our WebRTC call. This includes when streams are added to and
 * removed from the call.
 *
 * track events include the following fields:
 * RTCRtpReceiver       receiver
 * MediaStreamTrack     track
 * MediaStream[]        streams
 * RTCRtpTransceiver    transceiver
 *
 * In our case, we're just taking the first stream found and attaching
 * it to the <video> element for incoming media.
 */
function trackHandler (event) {
  util.log('*** the remote peer adds a track to the connection')
  rootState.remoteStream = event.streams[0]
}

function removeTrackHandler (event) {
  util.log('*** the remote peer removes a track from the connection')
  const trackList = rootState.remoteStream.getTracks()
  if (trackList.length === 0) {
    closeVideoCall()
  }
}

/**
 * Close the RTCPeerConnection and reset variables so that the user can
 * make or receive another call if they wish. This is called both
 * when the user hangs up, the other user hangs up, or if a connection
 * failure is detected.
 */
function closeVideoCall () {
  rootState.connectionState = 'closed'

  if (!rootState.peerConnection) {
    return
  }

  util.log('Closing the peer connection...')

  // Disconnect all our event listeners; we don't want stray events
  // to interfere with the hangup while it's ongoing.
  rootState.peerConnection.removeEventListener('icecandidate', iceCandidateHandler)
  rootState.peerConnection.removeEventListener('iceconnectionstatechange', iceConnectionStateChangeHandler)
  rootState.peerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateChangeHandler)
  rootState.peerConnection.removeEventListener('signalingstatechange', signalingStateChangeHandler)
  rootState.peerConnection.removeEventListener('negotiationneeded', negotiationNeededHandler)
  rootState.peerConnection.removeEventListener('track', trackHandler)
  rootState.peerConnection.removeEventListener('removetrack ', removeTrackHandler)

  if (rootState.remoteStream) {
    rootState.remoteStream.getTracks().forEach(track => {
      track.stop()
    })
    rootState.remoteStream = null
  }

  rootState.peerConnection.close()
  rootState.peerConnection = null
}

export default {
  addLocalStream (state, stream) {
    state.localStream = stream
    state.localStream.getTracks().forEach(track => {
      state.peerConnection.addTrack(track, state.localStream)
    })
  },

  removeLocalStream (state) {
    state.localStream.getTracks().forEach(track => track.stop())
    state.localStream = null
  },

  createPeerConnection (state) {
    util.log('Setting up a connection...')
    state.peerConnection = new RTCPeerConnection(null)
    state.peerConnection.addEventListener('icecandidate', iceCandidateHandler)
    state.peerConnection.addEventListener('iceconnectionstatechange', iceConnectionStateChangeHandler)
    state.peerConnection.addEventListener('icegatheringstatechange', iceGatheringStateChangeHandler)
    state.peerConnection.addEventListener('signalingstatechange', signalingStateChangeHandler)
    state.peerConnection.addEventListener('negotiationneeded', negotiationNeededHandler)
    state.peerConnection.addEventListener('track', trackHandler)
    state.peerConnection.addEventListener('removetrack ', removeTrackHandler)
  },

  closePeerConnection (state) {
    closeVideoCall()
    state.messages.splice(0)
  },

  toggleCanvas (state) {
    state.isCanvasShown = !state.isCanvasShown
  },

  setRemoteCanvas (state, remoteCanvas) {
    state.remoteCanvas = remoteCanvas
  },

  clearMessages (state) {
    state.messages.splice(0)
  },

  addMessage (state, message) {
    state.messages.push(message)
  }
}
