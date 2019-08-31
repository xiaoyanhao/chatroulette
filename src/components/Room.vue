<template>
  <div id="room" class="flex">
    <room-messages></room-messages>
    <room-canvas></room-canvas>
    <room-input></room-input>
  </div>
</template>

<script>
import RoomMessages from './Messages'
import RoomCanvas from './Canvas'
import RoomInput from './Input'

export default {
  name: 'room',
  components: {
    RoomMessages,
    RoomCanvas,
    RoomInput
  }
}
</script>

<style lang="less">
#room {
  flex: 1 1 auto;
  flex-flow: column nowrap;
  position: relative;
}
</style>
