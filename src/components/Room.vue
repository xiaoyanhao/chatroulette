<template>
  <div id="room" class="flex">
    <div class="chat-wrapper">
      <transition-group tag="ul" name="messages" @enter="enter">
        <li v-for="(message, index) of messages" :key="index" :class="message.role" class="message">
          <p>{{message.text}}</p>
        </li>
      </transition-group>
    </div>

    <div class="input-wrapper flex">
      <div class="input-area">
        <div class="tool-bar">
          <ul>
            <li class="tool-bar-item emoji">
              <i class="fa fa-smile-o" aria-hidden="true" :class="{active: showEmoji}" @click="highlight"></i>
              <emoji @addEmoji="addEmoji" :showEmoji="showEmoji"></emoji>
            </li>
          </ul>
        </div>
        <textarea class="textarea" ref="textarea" @keyup.stop="handleInput"></textarea>
      </div>
      <div class="action-area">
        <button type="button" class="send" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Emoji from './Emoji'

export default {
  name: 'room',
  data () {
    return {
      showEmoji: false
    }
  },
  computed: mapState(['messages']),
  methods: {
    enter (el) {
      el.scrollIntoView({block: 'end', behavior: 'auto'})
      // let chatWrapper = el.parentNode.parentNode
      // chatWrapper.scrollTop = chatWrapper.scrollHeight - chatWrapper.clientHeight
    },
    highlight (event) {
      this.showEmoji = !this.showEmoji
    },
    addEmoji (emoji) {
      let textarea = this.$refs.textarea
      let value = textarea.value
      let start = textarea.selectionStart
      let end = textarea.selectionEnd

      textarea.value = value.slice(0, start) + emoji + value.slice(end)
      textarea.setSelectionRange(start + 2, start + 2) // emoji takes up two code units
      textarea.focus()
    },
    handleInput (event) {
      if (!event.shiftKey && event.key === 'Enter') {
        this.sendMessage()
      }
    },
    sendMessage (event) {
      let textarea = this.$refs.textarea
      let text = textarea.value
      if (text) {
        this.$store.commit('addMessage', {text, role: 'you'})
        textarea.value = ''
        if (this.$store.getters.connectionState === 'connected') {
          this.$store.state.socket.emit('signal', {type: 'chat', data: {text, role: 'partner'}})
        }
      }
    }
  },
  components: {
    Emoji
  }
}
</script>

<style lang="scss">
#room {
  flex: 1 1 auto;
  flex-flow: column nowrap;

  .chat-wrapper {
    padding: 20px;
    flex: 1 1 100%;
    overflow-y: auto;

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

    p {
      margin: 0;
      line-height: 1.5;
    }

    .you {
      float: right;
      background-color: lawnGreen;
      position: relative;

      p::after {
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

      p::before {
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

  .input-wrapper {
    border-top: 1px solid #ddd;
    flex: 1 0 auto;

    .input-area {
      flex: 1 1 auto;
      padding: 5px 20px;
    }

    .action-area {
      border-left: 1px solid #ddd;
    }

    textarea {
      width: 100%;
      height: 60px;
      resize: none;
      border: none;
      padding: 0;
      outline: none;
      font-size: 1rem;
    }

    .tool-bar {
      margin-bottom: 10px;
      font-size: 24px;

      .tool-bar-item {
        display: inline-block;
        position: relative;
      }

      .emoji {
        color: #767676;

        .fa.active {
          color: #333;
        }
      }
    }
  }

  .send {
    width: 80px;

    &:hover {
      background-color: #f5f5f5;
    }

    &:active {
      background-color: #eeeeee;
    }
  }
}

</style>
