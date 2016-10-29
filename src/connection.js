import socket from './socket'

let onICECandidate = event => {
  if (!event.candidate) {
    return
  }
  socket.emit('ice candidate', event.candidate)
  console.log('client send ice candidate')
}

let onAddStream = event => {
  document.querySelector('.webcam .remote').srcObject = event.stream
  console.log('on add stream')
}

let onRemoveStream = event => {
  document.querySelector('.webcam .remote').srcObject = ''
  console.log('on remove stream')
}

const start = event => {
  // let configuration = {
  //   iceServers: [
  //     {urls: 'stun:23.21.150.121'},
  //     {urls: 'stun:stun.l.google.com:19302'},
  //     {urls: 'turn:numb.viagenie.ca', credential: 'webrtcdemo', username: 'louis%40mozilla.com'}
  //   ]
  // }

  let PeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
  window.pc = new PeerConnection(null)

  window.pc.addEventListener('icecandidate', onICECandidate)
  window.pc.addEventListener('addstream', onAddStream)
  window.pc.addEventListener('removestream', onRemoveStream)

  window.pc.addStream(window.localStream)
  socket.emit('match')
}

const stop = event => {
  window.pc.close()
  socket.emit('stop')
}

export {start, stop}
