export default {
  addIceCandidate: ({ state }, candidate) => state.peerConnection.addIceCandidate(candidate),

  setLocalDescription: ({ state }, description) => state.peerConnection.setLocalDescription(description),

  setRemoteDescription: ({ state }, description) => state.peerConnection.setRemoteDescription(description),

  createOffer: ({ state }, offerOptions) => state.peerConnection.createOffer(offerOptions),

  createAnswer: ({ state }) => state.peerConnection.createAnswer(),

  getUserMedia ({ commit, state }, constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        commit('addLocalStream', mediaStream)
      })
      .catch(error => {
        switch (error.name) {
          case 'NotAllowedError':
          case 'TypeError':
            break
          default:
            state.socket.emit('look for peer')
            window.alert(error.name, error.message)
        }
      })
  }
}
