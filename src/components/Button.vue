<template>
  <button type="button" class="btn" :class="classname">{{ value }}</button>
</template>

<script>
export default {
  name: 'button',
  props: ['classname', 'value']
}
</script>

<style lang="scss">
.btn {
  height: 100%;
  border: none;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  color: #767676;
  background-color: #fff;

  &:hover {
    color: #333;
    background-color: #f5f5f5;
  }

  &:active {
    color: #000;
    background-color: #eeeeee;
  }
}
</style>
