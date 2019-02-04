<template>
  <div id="tool-bar">
    <ul>
      <li class="tool-bar-item emoji">
        <i class="iconfont icon-smile" :class="{active: showEmoji}" @click="toggleEmoji"></i>
        <toolbar-emoji @addEmoji="addEmoji" v-show="showEmoji"></toolbar-emoji>
      </li>

      <li class="tool-bar-item canvas">
        <i class="iconfont icon-edit" :class="{active: showCanvas}" @click="toggleCanvas"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import ToolbarEmoji from './Emoji'

export default {
  name: 'toolbar',
  data () {
    return {
      showEmoji: false,
      showCanvas: false
    }
  },
  methods: {
    toggleEmoji (event) {
      this.showEmoji = !this.showEmoji
    },
    toggleCanvas (event) {
      this.showCanvas = !this.showCanvas
      this.$store.commit('showCanvas')
    },
    addEmoji (emoji) {
      this.$emit('addEmoji', emoji)
    }
  },
  components: {
    ToolbarEmoji
  }
}
</script>

<style lang="scss">
#tool-bar {
  margin-bottom: 10px;
  font-size: 24px;

  .tool-bar-item {
    display: inline-block;
    margin-right: 20px;
    position: relative;

    .iconfont {
      color: #767676;
      font-size: 20px;

      &.active {
        color: #333;
      }
    }
  }
}
</style>
