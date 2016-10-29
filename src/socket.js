import io from 'socket.io-client'

const socket = io()

socket.on('ice candidate', candidate => {
  console.log('client add ice candidate')
  window.pc.addIceCandidate(new window.RTCIceCandidate(candidate))
})

socket.on('matched', () => {
  console.log('matched')
  let offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  }

  window.pc.createOffer(offerOptions)
  .then(offer => {
    window.pc.setLocalDescription(offer)
    socket.emit('send offer', offer)
  })
  .catch(error => {
    console.log(error.name, error.message)
  })
})

socket.on('stopped', () => {
  window.pc.close()
  window.pc = null
})

socket.on('get offer', offer => {
  window.pc.setRemoteDescription(new window.RTCSessionDescription(offer))

  window.pc.createAnswer()
  .then(answer => {
    window.pc.setLocalDescription(answer)
    socket.emit('send answer', answer)
  })
  .catch(error => {
    console.log(error.name, error.message)
  })
})

socket.on('get answer', answer => {
  window.pc.setRemoteDescription(new window.RTCSessionDescription(answer))

  .then(res => {
    console.log('RTCPeerConnection established!')
  })
  .catch(error => {
    console.log(error.name, error.message)
  })
})

socket.on('log', array => {
  console.log.apply(console, array)
})

export default socket
