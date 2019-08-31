<template>
  <div id="emoji">
    <ul class="groups" v-for="(group, index) in groups" :key="index" v-show="activeIndex === index" @click="select">
      <li v-for="(emoji, index) in group" :key="index" class="emoji">{{emoji}}</li>
    </ul>
    <ul class="tabs">
      <li v-for="(tab, index) in tabs" class="tab" :key="index" @click="activeIndex = index">
        <i class="fas" :class="[tab, {active: index === activeIndex}]"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import Emoji from '../assets/emoji.json'

export default {
  name: 'emoji',
  data () {
    return {
      activeIndex: 0,
      tabs: ['fa-user', 'fa-leaf', 'fa-bell', 'fa-car', 'fa-font'],
      groups: Emoji.groups
    }
  },
  methods: {
    select (event) {
      if (event.target !== event.currentTarget) {
        this.$emit('addEmoji', event.target.textContent)
      }
    }
  }
}
</script>

<style lang="less">
#emoji {
  position: absolute;
  top: -218px;
  width: 34 * 7px;
  height: 200px;
  background-color: whitesmoke;
  border: 1px solid #ddd;
  border-radius: 5px 5px 5px 0;

  &::before, &::after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    left: -1px;
    border: 10px solid transparent;
  }

  &::before {
    bottom: -21px;
    border-color: #ddd transparent transparent transparent;
  }

  &::after {
    bottom: -20px;
    border-color: whitesmoke transparent transparent transparent;
  }

  .groups {
    height: 175px;
    overflow: auto;
    display: flex;
    flex-flow: row wrap;

    .emoji {
      width: 32px;
      height: 32px;
      font-size: 20px;
      line-height: 32px;
      text-align: center;
      border: 1px solid transparent;
      cursor: default;

      &:hover {
        border-color: #767676;
      }
    }
  }

  .tabs {
    border-top: 1px solid #ddd;
    background-color: whitesmoke;
    display: flex;
    width: 100%;
    border-radius: 0 0 5px 0;
    height: 24px;
    line-height: 24px;
    font-size: 14px;

    .tab {
      flex: 1 1 0;
      text-align: center;

      .fas {
        color: #aaa;
        font-size: 16px;

        &.active {
          color: #333;
        }
      }
    }
  }
}
</style>
