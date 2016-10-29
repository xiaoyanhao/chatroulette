<template>
  <aside class="webcam">
    <div class="partner">
      <h2>Partner</h2>
      <video class="remote" autoplay ref="remote" @loadedmetadata="loaded"></video>
    </div>
    <div class="you">
      <h2>You</h2>
      <video class="local" autoplay ref="local" @loadedmetadata="loaded"></video>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'webcam',
  methods: {
    loaded: function (event) {
      event.currentTarget.play()
    }
  },
  mounted () {
    let constraints = {audio: true, video: true}

    navigator.mediaDevices.getUserMedia(constraints)
    .then(mediaStream => {
      this.$refs.local.srcObject = mediaStream
      // this.$refs.local.src = window.URL.createObjectURL(mediaStream)
      window.localStream = mediaStream
    })
    .catch(err => {
      console.log(err.name, err.message)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.webcam {
  min-width: 320px;
  border-right: 1px solid #ddd;
  overflow: auto;
  padding: 10px;

  .partner, .you {
    margin-bottom: 30px;
  }

  h2 {
    color: #767676;
    font-size: 0.8rem;
    margin-bottom: 5px;
  }

  video {
    width: 320px;
    max-width: 100%;
    background-color: #333;
    box-shadow: 0 12px 15px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
  }
}
</style>
