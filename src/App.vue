<template>
  <div id="app">
    <app-header></app-header>
    <app-container></app-container>
  </div>
</template>

<script>
import appHeader from './components/Header'
import appContainer from './components/Container'

export default {
  name: 'app',
  components: {
    appHeader,
    appContainer
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

li {
  list-style-type: none;
}

button {
  height: 100%;
  border: none;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  color: #767676;
  background-color: #fff;

  &:hover {
    color: #333;
  }

  &:active {
    color: #000;
  }
}

#app {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.flex {
  display: flex;
}
</style>
