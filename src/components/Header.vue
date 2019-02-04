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
        <button type="button" @click="next" ref="next" disabled>Next</button>
      </li>
      <li>
        <button type="button" @click="stop" ref="stop" disabled>Stop</button>
      </li>
    </ul>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app-header',
  computed: mapState(['localStream', 'connectionState']),
  watch: {
    connectionState (state) {
      this.$store.commit('clearMessages')

      if (state === 'closed') {
        this.$refs.start.disabled = false
        this.$refs.next.disabled = true
        this.$refs.stop.disabled = true
      } else if (state === 'open') {
        this.$refs.start.disabled = true
        this.$refs.next.disabled = false
        this.$refs.stop.disabled = false
        this.$store.commit('addMessage', {
          role: 'system',
          html: '<i class="iconfont icon-check"></i>',
          text: 'Just say hello to each other :D'
        })
      } else if (state === 'connecting') {
        this.$refs.start.disabled = true
        this.$refs.next.disabled = true
        this.$refs.stop.disabled = false
        this.$store.commit('addMessage', {
          role: 'system',
          html: '<i class="iconfont icon-spinner icon-pulse"></i>',
          text: 'Life is like a non-stop roulette. You never know who you will meet next...'
        })
      }
    }
  },
  methods: {
    start () {
      let constraints = { audio: false, video: true }
      this.$store.commit('createPeerConnection')
      this.$store.dispatch('getUserMedia', constraints)
    },
    next () {
      this.$store.commit('closeDataChannel')
      this.$store.commit('closePeerConnection')
      this.$store.commit('createPeerConnection')
      this.$store.commit('addLocalStream', this.localStream)
    },
    stop () {
      this.$store.commit('closeDataChannel')
      this.$store.commit('closePeerConnection')
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
