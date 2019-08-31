<template>
  <div id="container" class="flex">
    <container-webcam></container-webcam>
    <container-room></container-room>
  </div>
</template>

<script>
import ContainerWebcam from './Webcam'
import ContainerRoom from './Room'

export default {
  name: 'container',
  components: {
    ContainerWebcam,
    ContainerRoom
  }
}
</script>

<style lang="less">
#container {
  height: calc(100% - 61px);
}
</style>
