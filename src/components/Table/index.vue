<template>
  <div class="table">
    <div class="left">
      <div class="icon" v-if="slots.left"><slot name="left"></slot></div>
      <div class="text">{{ title }}</div>
      <div class="text"><slot name="title" /></div>
    </div>
    <div class="right">
      <div class="info" @click="$emit('clickRight')"><slot name="right" /></div>
      <Iconfont
        v-if="!hideMore"
        class="more"
        name="iconright"
        size="15"
        color="#929292"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineProps, useSlots } from 'vue';
export default {
  name: 'Table',
};
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
defineProps({
  title: {
    type: String,
    requierd: true,
  },
  hideMore: {
    type: Boolean,
  },
});
const slots = useSlots();
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.table {
  display: flex;
  justify-content: space-between;
  position: relative;
  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .icon {
      margin-right: 10px;
    }
    .text {
      @include theme('color', main);
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 50%;
    .info {
      font-size: 14px;
      @include theme('color', input);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .more {
      margin-left: 5px;
    }
  }
}
</style>
