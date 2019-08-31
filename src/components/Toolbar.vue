<template>
  <div id="tool-bar">
    <ul>
      <li class="tool-bar-item emoji">
        <i class="fas fa-laugh" :class="{active: isEmojiShown}" @click="toggleEmoji"></i>
        <toolbar-emoji @addEmoji="addEmoji" v-show="isEmojiShown"></toolbar-emoji>
      </li>

      <li class="tool-bar-item canvas">
        <i class="fas fa-edit" :class="{active: isCanvasShown}" @click="toggleCanvas"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ToolbarEmoji from './Emoji'

export default {
  name: 'toolbar',

  components: {
    ToolbarEmoji
  },

  data () {
    return {
      isEmojiShown: false
    }
  },

  computed: {
    ...mapState(['isCanvasShown'])
  },

  methods: {
    ...mapMutations(['toggleCanvas']),

    toggleEmoji (event) {
      this.isEmojiShown = !this.isEmojiShown
    },

    addEmoji (emoji) {
      this.$emit('addEmoji', emoji)
    }
  }
}
</script>

<style lang="less">
#tool-bar {
  margin-bottom: 10px;
  font-size: 24px;

  .tool-bar-item {
    display: inline-block;
    margin-right: 20px;
    position: relative;

    .fas {
      color: #767676;
      font-size: 20px;

      &.active {
        color: #333;
      }
    }
  }
}
</style>
