<template>
  <div id="canvas" v-show="showCanvas" ref="canvas" :style="parentStyle">
    <canvas class="remote-canvas" ref="remoteCanvas" :width="style.width" :height="style.height"></canvas>
    <canvas class="local-canvas" ref="localCanvas" @mousedown.stop="startPaint" @mouseup.stop="stopPaint" @mouseout.stop="stopPaint" :width="style.width" :height="style.height"></canvas>

    <span class="canvas-tool">
      <input type="color" name="color" @change="setStrokeStyle">
      <input type="range" name="range" min="1" max="10" value="1" @change="setLineWidth">
      <input type="button" name="save" value="Save" @click="save">
      <input type="button" name="clear" value="Clear" @click="clear">
    </span>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'canvas',
  data () {
    return {
      prev: {x: 0, y: 0},
      curr: {x: 0, y: 0},
      ctx: null,
      strokeStyle: 'black',
      lineWidth: 1,
      style: {width: 0, height: 0}
    }
  },
  computed: {
    parentStyle () {
      return {
        width: this.style.width + 'px',
        height: this.style.height + 'px'
      }
    },
    ...mapState(['remoteCanvas', 'showCanvas', 'dataChannel', 'connectionState'])
  },
  watch: {
    remoteCanvas (payload) {
      let ctx = this.$refs.remoteCanvas.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(payload.prev.x, payload.prev.y)
      ctx.lineTo(payload.curr.x, payload.curr.y)
      ctx.lineWidth = payload.lineWidth
      ctx.strokeStyle = payload.strokeStyle
      ctx.stroke()
      ctx.closePath()
    },
    connectionState (state) {
      if (state === 'closed') {
        this.clear()
      }
    }
  },
  methods: {
    startPaint (event) {
      this.curr.x = event.offsetX
      this.curr.y = event.offsetY
      this.ctx.beginPath()
      event.target.addEventListener('mousemove', this.paint)
    },
    stopPaint (event) {
      this.ctx.closePath()
      event.target.removeEventListener('mousemove', this.paint)
    },
    paint (event) {
      event.stopPropagation()
      this.prev.x = this.curr.x
      this.prev.y = this.curr.y
      this.curr.x = event.offsetX
      this.curr.y = event.offsetY
      this.ctx.moveTo(this.prev.x, this.prev.y)
      this.ctx.lineTo(this.curr.x, this.curr.y)
      this.ctx.lineWidth = this.lineWidth
      this.ctx.strokeStyle = this.strokeStyle
      this.ctx.stroke()
      if (this.connectionState === 'open') {
        this.sync()
      }
    },
    sync () {
      this.dataChannel.send(JSON.stringify({
        type: 'canvas',
        payload: this.$data
      }))
    },
    setStrokeStyle (event) {
      this.strokeStyle = event.target.value
    },
    setLineWidth (event) {
      this.lineWidth = event.target.value
    },
    clear (event) {
      let remoteCtx = this.$refs.remoteCanvas.getContext('2d')
      remoteCtx.clearRect(0, 0, this.remoteCanvas.style.width, this.remoteCanvas.style.height)
      this.ctx.clearRect(0, 0, this.style.width, this.style.height)
    },
    save (event) {
      let canvas = document.createElement('canvas')
      canvas.width = this.style.width
      canvas.height = this.style.height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(this.$refs.remoteCanvas, 0, 0)
      ctx.drawImage(this.$refs.localCanvas, 0, 0)
      let dataURL = canvas.toDataURL('image/png')
      let link = document.createElement('a')
      link.download = 'chatroulette.png'
      link.href = dataURL
      link.click()
      canvas = link = null
    }
  },
  mounted () {
    let sibling = this.$refs.canvas.previousElementSibling
    this.style.width = sibling.offsetWidth
    this.style.height = sibling.offsetHeight
    this.ctx = this.$refs.localCanvas.getContext('2d')
  }
}
</script>

<style lang="scss">
#canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  .local-canvas, .remote-canvas {
    position: absolute;
    top: 0;
    left: 0;
    cursor: default;
  }

  .canvas-tool {
    position: absolute;
    bottom: -31px;
    left: 111px;

    input {
      vertical-align: middle;
    }
  }
}
</style>
