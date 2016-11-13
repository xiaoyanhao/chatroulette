<template>
  <div id="container" class="flex">
    <webcam></webcam>
    <room></room>      
  </div>
</template>

<script>
import Webcam from './Webcam'
import Room from './Room'

export default {
  name: 'container',
  components: {
    Webcam,
    Room
  }
}
</script>

<style lang="scss">
#container {
  height: calc(100% - 61px);
}
</style>
