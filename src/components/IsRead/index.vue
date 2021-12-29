<template>
  <div class="isRead">
    <img v-if="isRead" src="img/read.svg" alt="" />
    <img v-else src="img/unread.svg" alt="" />
  </div>
</template>

<script lang="ts">
import { key } from '@/store';
import { defineComponent, defineProps, ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'IsRead',
});
</script>
<script lang="ts" setup>
defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
});
const store = useStore(key);
const readMessageState = ref(
  Boolean(store.state.switchSettingInfo.readMessageState),
);
watch(
  computed(() => store.state.switchSettingInfo),
  (e) => {
    readMessageState.value = Boolean(
      store.state.switchSettingInfo.readMessageState,
    );
  },
);
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.isRead {
  font-size: 12px;
  color: #b3b3b3;
  img {
    width: 12px;
  }
}
</style>
