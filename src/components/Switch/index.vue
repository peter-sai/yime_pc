<template>
  <div @click="toggle" class="switch" :class="{ active: active }">
    <span class="on-off" :class="{ active: active }"></span>
  </div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
export default {
  name: 'Switch',
};
</script>
<script setup lang="ts">
const props = defineProps({
  switch: {
    type: Boolean,
    default: false,
  },
  beforeChange: {
    type: Function,
  },
});
const emit = defineEmits(['toggle']);
// const active = computed(() => props.switch);
const active = ref(props.switch);
const toggle = async () => {
  emit('toggle', !active.value);
  if (props.beforeChange) {
    await props.beforeChange(!active.value);
  }
  active.value = !active.value;
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.switch {
  width: 28px;
  height: 18px;
  border-radius: 13px;
  background: #ccc;
  position: relative;
  transition: all 0.1s linear;
  cursor: pointer;
  &.active {
    background: #0085ff;
  }
  .on-off {
    display: inline-flex;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.1s linear;
    &.active {
      transition: all 0.1s linear;
      left: 12px;
    }
  }
}
</style>
