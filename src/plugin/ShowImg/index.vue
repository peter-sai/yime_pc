<template>
  <div class="showImg">
    <div class="close" @click="close"></div>
    <div
      class="img"
      :style="{
        background: `url(${src}) no-repeat  center`,
        backgroundSize: 'contain',
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps } from 'vue';
export default defineComponent({
  name: 'Loading',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  src: {
    type: String,
  },
  destroy: {
    type: Function,
  },
});
const close = () => {
  props.destroy && props.destroy();
};

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    close();
  }
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.showImg {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba($color: #000000, $alpha: 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 30px;
    cursor: pointer;
    height: 30px;
    &::after {
      width: 100%;
      display: block;
      content: '';
      height: 2px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::before {
      display: block;
      content: '';
      width: 100%;
      height: 2px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
  .img {
    height: 100%;
    width: 100%;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
