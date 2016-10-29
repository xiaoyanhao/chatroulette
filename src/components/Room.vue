<template>
  <div class="room flex">
<!--     <div class="header-wrapper">
      <h2>Text chat</h2>
    </div>
 -->
    <div class="chat-wrapper">
      <ul class="chat">
        <li v-for="(message, index) of messages" :key="index" :class="message.role">
          <p>{{message.text}}</p>
        </li>
      </ul>
    </div>

    <div class="input-wrapper flex">
      <div class="input-area">
        <div class="tool-bar">
          <ul>
            <li></li>
            <li>️</li>
          </ul>
        </div>
        <textarea class="textarea" ref="textarea"></textarea>
      </div>
      <div class="action-area">
        <my-button value="Send" classname="send" @click.native="send" />
      </div>
    </div>
  </div>
</template>

<script>
import myButton from './Button'
import socket from '../socket'

let messages = []

socket.on('chat', function (message) {
  console.log('get message')
  messages.push(message)
})

export default {
  name: 'room',
  data () {
    return {
      messages
    }
  },
  methods: {
    send: function (event) {
      let textarea = this.$refs.textarea
      let text = textarea.value
      if (text) {
        this.messages.push({text, role: 'you'})
        console.log('send message')
        textarea.value = ''
        socket.emit('chat', text)
      }
    }
  },
  components: {
    myButton
  }
}
</script>

<style lang="scss">
.room {
  flex: 1 1 auto;
  flex-flow: column nowrap;
}

.header-wrapper {
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  h2 {
    font-size: 1rem;
    color: #767676;
  }
}

.chat-wrapper {
  padding: 20px;
  flex: 1 1 100%;
  border-bottom: 1px solid #ddd;
  overflow-y: auto;

  .chat {
    li {
      border-radius: 5px;
      padding: 10px;
      clear: both;
      max-width: 70%;
      list-style-type: none;
      margin: 10px 0;
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
}

.input-wrapper {
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
    min-height: 50px;
    resize: none;
    border: none;
    padding: 0;
    outline: none;
    font-size: 1rem;
  }

  .tool-bar {
    margin-bottom: 10px;
    li {
      display: inline-block;
    }
  }
}

.send {
  width: 80px;
}
</style>
