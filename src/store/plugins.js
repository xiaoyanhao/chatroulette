import {log, reportError} from '../logger'

export const createWebSocket = socket => {
  return ({commit, dispatch, state}) => {
    socket.on('chat', message => commit('addMessage', message))

    socket.on('ice candidate', candidate => {
      dispatch('addIceCandidate', candidate)
      .then(() => log('add ice candidate'))
      .catch(reportError)
    })

    socket.on('find peer', () => {
      let offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      }

      dispatch('createOffer', offerOptions)
      .then(offer => dispatch('setLocalDescription', offer))
      .then(() => socket.emit('send offer', state.peerConnection.localDescription))
      .catch(reportError)
    })

    socket.on('reconnect', () => commit('lookForPeer'))

    socket.on('get offer', offer => {
      dispatch('setRemoteDescription', offer)
      .then(() => dispatch('createAnswer'))
      .then(answer => dispatch('setLocalDescription', answer))
      .then(() => socket.emit('send answer', state.peerConnection.localDescription))
      .catch(reportError)
    })

    socket.on('get answer', answer => {
      dispatch('setRemoteDescription', answer)
      .catch(reportError)
    })

    socket.on('log', array => {
      console.log.apply(console, array)
    })
  }
}
