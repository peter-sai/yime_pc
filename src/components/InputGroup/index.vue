<template>
  <div class="inputGroup" :class="{ active: active }">
    <div v-if="icon" class="icon">
      <Iconfont :name="icon" size="20" color="main" />
    </div>
    <div v-if="phone" class="phone"><slot name="phone"></slot></div>
    <input
      class="input"
      @blur="inputBlur"
      @focus="inputFocus"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target?.value)"
    />
    <div class="btn" @click="$emit('onGetCode')"><slot name="getCode" /></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, defineEmits } from 'vue';
export default defineComponent({
  name: 'inputGroup',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { ref, useSlots } from 'vue';
const slot = useSlots();

const phone = slot.phone;

const active = ref(false);
defineEmits(['update:modelValue', 'onGetCode']);
defineProps({
  icon: {
    type: String,
  },
  placeholder: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
  },
  type: {
    type: String,
    default: 'text',
  },
});
const inputBlur = () => {
  active.value = false;
};
const inputFocus = () => {
  active.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.inputGroup {
  display: flex;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 16px 0;
  margin-bottom: 15px;
  border-bottom-color: #eaeaea;
  transition: all 0.3s;
  width: 350px;
  &.active {
    border-bottom-color: #0085ff;
  }
  .input {
    flex: 1;
    font-size: 16px;
    border: none;
    @include theme('color', main);
  }
  .phone {
    margin-right: 20px;
  }
  .icon {
    margin-right: 10px;
  }
  .btn {
    font-size: 16px;
    color: #0085ff;
    cursor: pointer;
  }
}
</style>
