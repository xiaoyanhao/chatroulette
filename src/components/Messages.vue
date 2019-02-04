<template>
  <transition-group tag="ul" id="messages" name="messages" @enter="enter">
    <li v-for="(message, index) of messages" :key="`${index}`" :class="message.role" class="message">
      <p class="text"><span class="tip" v-html="message.html"></span>{{message.text}}</p>
    </li>
  </transition-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'messages',
  computed: mapState(['messages']),
  methods: {
    enter (el) {
      el.scrollIntoView({ block: 'end', behavior: 'auto' })
      // let chatWrapper = el.parentNode.parentNode
      // chatWrapper.scrollTop = chatWrapper.scrollHeight - chatWrapper.clientHeight
    }
  }
}
</script>

<style lang="scss">
#messages {
  padding: 20px;
  flex: 1 1 100%;
  overflow-y: auto;
  position: relative;

  .messages-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .messages-move {
    transition: all 0.5s;
  }

  .message {
    border-radius: 5px;
    padding: 10px;
    clear: both;
    max-width: 70%;
    list-style-type: none;
    margin: 10px 0;
    transition: all 0.5s;
  }

  .text {
    margin: 0;
    line-height: 1.5;
  }

  .system {
    .tip {
      margin-right: 10px;
    }
  }

  .you {
    float: right;
    background-color: lawnGreen;
    position: relative;

    .text::after {
      content: '';
      width: 0;
      height: 0;
      border: 10px solid lawnGreen;
      position: absolute;
      top: 0;
      right: -10px;
      border-color: lawnGreen transparent transparent transparent;
    }
  }

  .partner {
    float: left;
    background-color: whiteSmoke;
    position: relative;

    .text::before {
      content: '';
      width: 0;
      height: 0;
      border: 10px solid lawnGreen;
      position: absolute;
      top: 0;
      left: -10px;
      border-color: whiteSmoke transparent transparent transparent;
    }
  }
}
</style>
