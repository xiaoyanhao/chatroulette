export default {
  connectionState: state => {
    if (!state.peerConnection) {
      return 'closed'
    }

    let iceConnectionState = state.iceConnectionState
    let iceGatheringState = state.peerConnection.iceGatheringState
    let signalingState = state.peerConnection.signalingState

    if (['connected', 'completed'].indexOf(iceConnectionState) > -1 && iceGatheringState === 'complete' && signalingState === 'stable') {
      return 'connected'
    } else if (['failed', 'disconnected', 'closed'].indexOf(iceConnectionState) > -1) {
      return 'closed'
    } else {
      return 'connecting'
    }
  }
}
