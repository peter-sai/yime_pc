<template>
  <div class="lottie" ref="lottie"></div>
</template>

<script lang="ts">
import lottieWeb from 'lottie-web';
import { ref, onMounted, defineComponent, Ref } from 'vue';
import data from './data.json';
export default defineComponent({
  name: 'SayHello',
});
</script>
<script lang="ts" setup>
const lottie: Ref<Element | null> = ref(null);
onMounted(() => {
  lottieWeb.loadAnimation({
    container: lottie.value as Element,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    // path: '/sayHi/data.json',
    animationData: data,
  });
});
</script>

<style lang="scss" scoped>
.lottie {
  width: 160px;
  height: 160px;
  display: inline-block;
}
</style>
