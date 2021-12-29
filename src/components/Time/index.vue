<template>
  <div class="time">
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Time',
});
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.time {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin: 20px 0 13px;
}
</style>
