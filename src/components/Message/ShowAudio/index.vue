<template>
  <div class="box">
    <div class="one" :style="activeBg" />
    <div class="two" :style="active.two ? activeBg : null" />
    <div class="three" :style="active.three ? activeBg : null" />
    <div class="four" :style="active.four ? activeBg : null" />
    <div class="five" :style="active.five ? activeBg : null" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  defineProps,
  reactive,
  toRefs,
  onUnmounted,
} from 'vue';
export default defineComponent({
  name: 'ShowAudio',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  time: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: 'me',
  },
});
const active = reactive({
  one: true,
  two: false,
  three: false,
  four: false,
  five: false,
});
let time2: any, time3: any, time4: any, time5: any;
if (props.time) {
  time2 = setTimeout(() => {
    active.two = true;
  }, (props.time / 5) * 1000);
  time3 = setTimeout(() => {
    active.three = true;
  }, (props.time / 5) * 2000);
  time4 = setTimeout(() => {
    active.four = true;
  }, (props.time / 5) * 3000);
  time5 = setTimeout(() => {
    active.five = true;
  }, (props.time / 5) * 4000);
}
onUnmounted(() => {
  time2 && clearTimeout(time2);
  time3 && clearTimeout(time3);
  time4 && clearTimeout(time4);
  time5 && clearTimeout(time5);
});

const activeBg = {
  background: props.type === 'me' ? '#fff' : '#333',
};
</script>

<style scoped>
.box {
  display: flex;
  align-items: center;
}
.box div {
  margin: 0 1px;
  width: 2px;
  background: #aaa;
}
.one {
  height: 20%;
}
.two {
  height: 80%;
}
.three {
  height: 50%;
}
.four {
  height: 20%;
}
.five {
  height: 70%;
}
</style>
