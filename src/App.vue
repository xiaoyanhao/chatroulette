<template>
  <div id="app">
    <my-header></my-header>
    <div class="container flex">
      <webcam></webcam>
      <room></room>      
    </div>
  </div>
</template>

<script>
import myHeader from './components/Header'
import Webcam from './components/Webcam'
import Room from './components/Room'

export default {
  name: 'app',
  components: {
    myHeader,
    Webcam,
    Room
  }
}
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  color: #333;
  background-color: #fff;
}

ul, h1, h2 {
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  overflow: hidden;
  position: relative;

  .container {
    height: calc(100% - 61px);
  }
}

.flex {
  display: flex;
}
</style>
