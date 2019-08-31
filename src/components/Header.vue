<template>
  <header id="header" class="flex">
    <h1>
      <a href="/">Chatroulette</a>
    </h1>
    <ul class="control">
      <li>
        <button @click="start" :disabled="connectionState !== 'closed'">Start</button>
      </li>
      <li>
        <button @click="next" :disabled="connectionState !== 'open'">Next</button>
      </li>
      <li>
        <button @click="stop" :disabled="connectionState === 'closed'">Stop</button>
      </li>
    </ul>
  </header>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'app-header',

  computed: mapState(['localStream', 'connectionState']),

  methods: {
    ...mapMutations(['createPeerConnection', 'closePeerConnection', 'addLocalStream', 'removeLocalStream']),
    ...mapActions(['getUserMedia', 'hangUpCall']),

    start () {
      this.createPeerConnection()
      this.getUserMedia()
    },

    next () {
      this.closePeerConnection()
      this.hangUpCall()
      this.createPeerConnection()
      this.addLocalStream(this.localStream)
    },

    stop () {
      this.closePeerConnection()
      this.hangUpCall()
      this.removeLocalStream()
    }
  }
}
</script>

<style lang="less">
#header {
  height: 60px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 1px 2px rgba(0,0,0,0.075);
  justify-content: space-between;
  align-items: center;

  h1 {
    margin-left: 10px;
  }

  .control {
    li {
      display: inline-block;
      margin-right: 20px;
    }

    button[disabled] {
      cursor: not-allowed;
      color: #767676;
    }
  }
}
</style>
