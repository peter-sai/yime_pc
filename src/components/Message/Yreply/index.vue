<template>
  <div class="reply" v-if="replyMsg?.msgId" @click.stop="goTo">
    <div class="reply-stringContent">
      <div class="nickname">{{ userInfo?.nickname }}</div>
      {{ replyMsg?.msgContent?.stringContent }}
    </div>
    <div class="line"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, PropType } from 'vue';
export default defineComponent({
  name: 'Reply',
});
</script>
<script lang="ts" setup>
import { IMsgInfo } from '@/types/msg';
import { IUserInfo } from '@/types/user';
const props = defineProps({
  userInfo: {
    type: Object as PropType<IUserInfo>,
  },
  replyMsg: {
    type: Object as PropType<IMsgInfo>,
  },
});
const goTo = () => {
  const dom = document.getElementById(props.replyMsg.msgId);
  dom?.scrollIntoView({
    behavior: 'smooth', //顺滑的滚动
    block: 'center', //容器上下的中间
    inline: 'start', //容器左右的左边
  });
};
</script>
<style lang="scss" scoped>
.reply {
  &-stringContent {
    font-size: 16px;
    .nickname {
      font-size: 12px;
      font-weight: 400;
      color: #99ceff;
      margin-bottom: 2px;
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background: #ffffff;
    opacity: 0.2;
    margin: 5px 0;
  }
}
</style>
