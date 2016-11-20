<template>
  <header id="header" class="flex">
    <h1>
      <a href="/">Chatroulette</a>
    </h1>
    <ul class="control">
      <li>
        <button type="button" @click="start" ref="start">Start</button>
      </li>
      <li>
        <button type="button" @click="next" :disabled="state !== 'connected'">Next</button>
      </li>
      <li>
        <button type="button" @click="stop" ref="stop" disabled>Stop</button>
      </li>
    </ul>
  </header>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'header',
  computed: mapGetters({
    state: 'connectionState'
  }),
  methods: {
    start () {
      let constraints = {audio: false, video: true}
      this.$store.commit('createPeerConnection')
      this.$store.dispatch('getUserMedia', constraints)
      this.$store.commit('clearMessages')
      this.$refs.start.disabled = true
      this.$refs.stop.disabled = false
    },
    next () {
      this.$store.commit('closePeerConnection')
      this.$store.commit('clearMessages')
      this.$store.commit('createPeerConnection')
      this.$store.commit('addLocalStream', this.$store.state.localStream)
    },
    stop () {
      this.$store.commit('closePeerConnection')
      this.$refs.stop.disabled = true
      this.$refs.start.disabled = false
    }
  }
}
</script>

<style lang="scss">
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
