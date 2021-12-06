<template>
  <div @click="toggle" class="switch" :class="{ active: active }">
    <span class="on-off" :class="{ active: active }"></span>
  </div>
</template>
<script lang="ts">
import { ref } from 'vue';
export default {
  name: 'TableDoubleSwitch',
};
</script>
<script setup lang="ts">
const active = ref(false);
const toggle = () => {
  active.value = !active.value;
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.switch {
  width: 40px;
  height: 26px;
  border-radius: 13px;
  background: #ccc;
  position: relative;
  transition: all 0.1s linear;
  &.active {
    @include theme('background', prominent);
  }
  .on-off {
    display: inline-flex;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.1s linear;
    &.active {
      transition: all 0.1s linear;
      left: 17px;
    }
  }
}
</style>
