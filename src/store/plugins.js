import createLogger from 'vuex/dist/logger'
import rootState from './state'
import util from '../util'

const createWebSocket = socket => {
  return ({ state, commit, dispatch }) => {
    /**
     * Signaling messages: these messages are used to trade WebRTC
     * signaling information during negotiations leading up to a video call.
     */

    /* A new ICE candidate has been received */
    socket.on('new-ice-candidate', msg => {
      dispatch('addIceCandidate', msg)
        .catch((err) => util.trace(`Error ${err.name}: ${err.message}`))
    })

    /* Invitation and offer to chat */
    socket.on('video-offer', msg => {
      dispatch('setRemoteDescription', msg)
        .then(() => dispatch('createAnswer'))
        .then((answer) => dispatch('setLocalDescription', answer))
        .then(() => dispatch('sendAnswerToPeer'))
        .catch((err) => util.trace(`Error ${err.name}: ${err.message}`))
    })

    /* Callee has answered our offer */
    socket.on('video-answer', msg => {
      dispatch('setRemoteDescription', msg)
        .catch((err) => util.trace(`Error ${err.name}: ${err.message}`))
    })

    /* The other peer has hung up the call */
    socket.on('hang-up', () => {
      commit('closePeerConnection')
      commit('createPeerConnection')
      commit('addLocalStream', state.localStream)
    })

    /* A remote peer has been found and matched */
    socket.on('peer-matched', () => {
      dispatch('createOffer')
        .then((offer) => dispatch('setLocalDescription', offer))
        .then(() => dispatch('sendOfferToPeer'))
        .catch((err) => util.trace(`Error ${err.name}: ${err.message}`))
    })

    /**
     * Chatting messages: these messages are used to communicate with the remote peer.
     */

    socket.on('message', msg => {
      commit('addMessage', msg)
    })

    socket.on('canvas', msg => {
      commit('setRemoteCanvas', msg)
    })
  }
}

export default process.env.NODE_ENV !== 'production'
  ? [createLogger(), createWebSocket(rootState.socket)]
  : [createWebSocket(rootState.socket)]
