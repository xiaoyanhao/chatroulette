<template>
  <aside id="webcam">
    <div class="partner">
      <h2>Partner</h2>
      <!-- <video autoplay ref="remote" @loadedmetadata="loaded"></video> -->
      <video autoplay ref="remote"></video>
    </div>
    <div class="you">
      <h2>You</h2>
      <!-- <video autoplay muted ref="local" @loadedmetadata="loaded"></video> -->
      <video autoplay muted ref="local"></video>
    </div>
  </aside>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'webcam',

  computed: mapState(['localStream', 'remoteStream']),

  watch: {
    remoteStream (stream) {
      this.$refs.remote.srcObject = stream
    },
    localStream (stream) {
      this.$refs.local.srcObject = stream
    }
  },

  methods: {
    // loaded (event) {
    //   event.currentTarget.play()
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
#webcam {
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
    box-shadow: 0 12px 15px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  }
}
</style>
