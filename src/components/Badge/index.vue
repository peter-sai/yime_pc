<template>
  <div
    v-if="num"
    class="badge"
    :class="{
      double: length === 2,
      isMute: props.isMute,
      isHome: props.isHome,
      hover: props.hover,
    }"
  >
    {{ num }}
  </div>
  <div
    v-else
    class="badge unRead"
    :class="{
      double: length === 2,
      isMute: props.isMute,
      isHome: props.isHome,
      hover: props.hover,
    }"
  />
</template>

<script lang="ts">
import { ref, defineProps } from 'vue';
export default {
  name: 'Badge',
};
</script>
<script lang="ts" setup>
const props = defineProps({
  num: {
    type: Number,
    default: 0,
  },
  isMute: {
    type: Boolean,
    default: false,
  },
  isHome: {
    type: Boolean,
    default: false,
  },
  hover: {
    type: Boolean,
    default: false,
  },
});
const length = ref(1);
length.value = props.num.toString().length;
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.badge {
  font-size: 12px;
  display: inline-block;
  color: #fff;
  border-radius: 10px;
  height: 20px;
  min-width: 20px;
  text-align: center;
  line-height: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0085ff;
  &.unRead {
    height: 10px;
    width: 10px;
    min-width: auto;
  }
  &.double {
    padding: 0 8px;
  }
  &.isMute {
    background: #b6b7ba;
  }
  &.isHome {
    background: #ff3432;
  }
  &.hover {
    background: #ffffff;
    color: #0085ff;
  }
}
</style>
