<template>
  <header class="flex">
    <h1>Chatroulette</h1>
    <ul>
      <li><my-button @click.native="start" value="Start" /></li>
      <li><my-button @click.native="stop" value="Stop" /></li>
    </ul>
  </header>
</template>

<script>
import {start, stop} from '../connection'
import myButton from './Button'

export default {
  name: 'header',
  methods: {
    start,
    stop
  },
  components: {
    myButton
  }
}
</script>

<style lang="scss">
header {
  height: 60px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 1px 2px rgba(0,0,0,0.075);
  justify-content: space-between;
  align-items: center;

  h1 {
    margin-left: 10px;
  }

  ul {
    li {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
</style>
