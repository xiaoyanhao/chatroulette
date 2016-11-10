<template>
  <header class="flex">
    <h1>Chatroulette</h1>
    <ul>
      <li>
        <button type="button" v-if="state == 'closed'" @click="start">Start</button>
        <button type="button" v-else @click="next" :disabled="state == 'connecting'">Next</button>
      </li>
      <li><button type="button" @click="stop" :disabled="state == 'closed'">Stop</button></li>
    </ul>
  </header>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

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
    },
    next () {
      this.$store.commit('clearMessages')
      this.$store.commit('lookForPeer')
    },
    ...mapMutations({
      stop: 'closePeerConnection'
    })
  }
}
</script>

<style lang="scss">
header {
  height: 60px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 1px 2px rgba(0,0,0,0.075);
  justify-content: space-between;
  align-items: center;

  h1 {
    margin-left: 10px;
  }

  ul {
    li {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
</style>
