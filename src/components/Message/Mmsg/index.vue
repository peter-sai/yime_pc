<template>
  <div class="mmsg">
    <div
      style="
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
      "
    >
      <div class="box">
        <Sending v-if="sending" />
        <ImgBg v-bind="$attrs" isMe :fired="fired">
          <Fire
            :isBurn="isBurn"
            :fired="fired"
            :left="`-20px`"
            :top="`-15px`"
          />
          {{ replyMsg?.msgContent?.stringContent }}
          <div class="line" v-if="replyMsg?.msgContent?.stringContent"></div>
          <slot />
        </ImgBg>
      </div>
      <IsRead :isRead="isRead" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, PropType } from 'vue'
import ImgBg from '../ImgBg/index.vue'
import Fire from '../Fire/index.vue'
import Sending from '@/components/Sending/index.vue'
import IsRead from '@/components/IsRead/index.vue'
import { IMsgInfo } from '@/types/msg'
export default defineComponent({
  name: 'Mmsg',
})
</script>
<script lang="ts" setup>
defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  sending: {
    type: Boolean,
    default: false,
  },
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
  replyMsg: {
    type: Object as PropType<IMsgInfo>,
  },
})
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.mmsg {
  text-align: right;
  .line {
    width: 100%;
    height: 1px;
    background: #ffffff;
    opacity: 0.2;
    margin: 5px 0;
  }
  .box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    max-width: 70%;

    .sending {
      margin-right: 10px;
    }
  }
  .userImg {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    margin-left: 10px;
  }
  .imBg {
    text-align: left;
  }
}
</style>
