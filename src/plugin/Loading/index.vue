<template>
  <div class="loading">
    <div class="box">
      <div class="_loading"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Loading',
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
@keyframes donut-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.loading {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  .box {
    width: 90px;
    height: 90px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    ._loading {
      display: inline-block;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-left-color: #fff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: donut-spin 1.2s linear infinite;
    }
  }
}
</style>
