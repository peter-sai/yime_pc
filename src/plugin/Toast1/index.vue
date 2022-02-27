<template>
  <transition name="fade" @after-leave="close">
    <!-- <div class="_toast" v-if="isShow"> -->
    <div class="box" v-if="isShow">
      <Iconfont name="icongantanhao" size="15" color="#fff" />
      <div class="info">{{ title }}</div>
    </div>
    <!-- </div> -->
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Toast',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { ref, onMounted, defineProps } from 'vue';
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  destroy: {
    type: Function,
  },
  time: {
    type: Number,
  },
});

const isShow = ref(false);
const close = () => {
  props.destroy && props.destroy();
};
onMounted(() => {
  isShow.value = true;
});
setTimeout(() => {
  isShow.value = false;
}, props.time);
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
._toast {
  transition: all 0.3s;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background: transparent;
}
.box {
  position: fixed;
  left: 50%;
  bottom: 20%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  // height: 44px;
  padding: 10px 20px;
  .info {
    color: #fff;
    font-size: 12px;
    margin-left: 5px;
    white-space: nowrap;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
