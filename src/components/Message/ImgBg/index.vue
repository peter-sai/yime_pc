<template>
  <div class="imBg" @contextmenu="contextmenu">
    <div
      class="imgBgBox"
      :class="{ fireInfo: isFireInfo, me: isMe, sys: isSys }"
      v-if="isFireInfo"
    >
      <Iconfont v-if="isMe" name="iconyuehoujifenbeifen1" size="20" />
      <Iconfont v-else name="iconyuehoujifen2" size="20" />
    </div>
    <div
      class="imgBgBox"
      :class="{ fireInfo: isBurn, me: isMe, sys: isSys }"
      v-else-if="isBurn"
    >
      <Iconfont v-if="isMe" color="#fff" name="iconposuiban" size="20" />
      <Iconfont v-else color="#0085FF" name="iconposuiban" size="20" />
    </div>
    <div v-else class="imgBgBox" :class="{ me: isMe, sys: isSys }">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, defineEmits } from "vue";
import Iconfont from "@/iconfont/index.vue";
export default defineComponent({
  name: "ImgBg",
});
</script>
<script setup lang="ts">
defineProps({
  isMe: {
    type: Boolean,
  },
  isSys: {
    type: Boolean,
  },
  isFireInfo: {
    type: Boolean,
  },
  isBurn: {
    type: Boolean,
  },
});

const emit = defineEmits(["menuClick"]);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit("menuClick", e);
};
</script>
<style lang="scss" scoped>
@import "@/style/base.scss";
.imBg {
  display: flex;
  &.isMe {
    justify-content: flex-end;
  }
  .imgBgBox {
    padding: 10px;
    background: #f3f3f6;
    display: inline-block;
    font-size: 16px;
    color: #333333;
    border-radius: 0px 14px 14px 14px;
    word-break: break-all;
    // display: inline-flex;
    align-items: center;
    &.me {
      border-radius: 14px 0px 14px 14px;
      color: #fff;
      background: #0085ff;
    }
    &.sys {
      background: #0085ff;
    }
    &.fireInfo {
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
