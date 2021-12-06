<template>
  <div class="search">
    <Iconfont name="iconsousuo" size="20" color="#CCCCCC" />
    <input
      @keyup.enter="$emit('enter')"
      :value="modelValue"
      type="text"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, defineEmits } from 'vue';
export default defineComponent({
  name: 'search',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
const emit = defineEmits(['enter', 'update:modelValue']);
defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 140,
  },
  modelValue: {
    type: String,
  },
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.search {
  margin: 0 10px;
  padding: 0 12px;
  height: 30px;
  background: #f0f1f4;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  input {
    font-size: 14px;
    margin-left: 5px;
    flex: 1;
  }
}
</style>
