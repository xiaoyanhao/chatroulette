import state from './state'
import createLogger from 'vuex/dist/logger'

const createWebSocket = socket => {
  return ({commit, dispatch, state}) => {
    socket.on('signal', signal => {
      switch (signal.type) {
        case 'icecandidate':
          dispatch('addIceCandidate', signal.data)
          .catch((error) => console.error(error.name, ':', error.message))
          break

        case 'offer':
          dispatch('setRemoteDescription', signal.data)
          .then(() => dispatch('createAnswer'))
          .then(answer => dispatch('setLocalDescription', answer))
          .then(() => socket.emit('signal', {type: 'answer', data: state.peerConnection.localDescription}))
          .catch((error) => console.error(error.name, ':', error.message))
          break

        case 'answer':
          dispatch('setRemoteDescription', signal.data)
          .catch((error) => console.error(error.name, ':', error.message))
          break

        default:
          break
      }
    })

    socket.on('find peer', () => {
      let offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      }

      commit('createDataChannel')

      dispatch('createOffer', offerOptions)
      .then(offer => dispatch('setLocalDescription', offer))
      .then(() => socket.emit('signal', {type: 'offer', data: state.peerConnection.localDescription}))
      .catch((error) => console.error(error.name, ':', error.message))
    })

    socket.on('restart', () => {
      commit('closeDataChannel')
      commit('closePeerConnection')
      commit('createPeerConnection')
      commit('addLocalStream', state.localStream)
    })

    socket.on('log', array => {
      console.log.apply(console, array)
    })
  }
}

export default process.env.NODE_ENV !== 'production'
  ? [createLogger(), createWebSocket(state.socket)]
  : [createWebSocket(state.socket)]
