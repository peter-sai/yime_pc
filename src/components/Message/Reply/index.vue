<template>
  <div class="reply" v-if="replyMsg?.msgId" @click.stop="goTo">
    <div
      class="reply-stringContent"
      v-if="
        replyMsg?.msgContent?.msgContentType === 1 ||
        replyMsg?.msgContent?.msgContentType === 7 ||
        replyMsg?.msgContent?.msgContentType === 25
      "
    >
      <div class="nickname" :class="{ nameColor: !isMe }">
        {{ userInfo?.nickname }}
      </div>
      {{ replyContent }}
    </div>
    <div class="reply-stringContent" v-else-if="replyMsg?.msgId === 1">
      <div class="nickname" :class="{ nameColor: !isMe }">
        {{ userInfo?.nickname }}
      </div>
      {{ t('原消息已被删除') }}
    </div>
    <div class="reply-content" v-else>
      <div class="left" :style="isMe ? 'color: #99ceff' : 'color:gray'">
        <span>{{ userInfo?.nickname }}</span>
        <span
          ><span class="quot">“</span> {{ replyContent }}
          <span class="quot">”</span></span
        >
      </div>
      <div class="right">
        <div class="icon" v-if="replyContentImg === 'voiceMsg'">
          <Iconfont name="iconplay1" size="10" color="#0085FF" />
        </div>
        <img
          class="image"
          v-else-if="
            replyMsg?.msgContent?.msgContentType === 2 ||
            replyMsg?.msgContent?.msgContentType === 23 ||
            replyMsg?.msgContent?.msgContentType === 25 ||
            replyMsg?.msgContent?.msgContentType === 15
          "
          :src="replyContentImg"
        />
        <Iconfont v-else :name="replyContentImg" size="32" />
        <!-- <img class="file" v-else :src="replyContentImg" /> -->
      </div>
    </div>
    <div
      class="line"
      :style="isMe ? 'background:#ffffff' : 'background:rgba(0, 0, 0,0.3);'"
    ></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, PropType, computed } from 'vue';
export default defineComponent({
  name: 'Reply',
});
</script>
<script lang="ts" setup>
import { IMsgInfo } from '@/types/msg';
import { IUserInfo } from '@/types/user';
import { useI18n } from 'vue-i18n';
import Iconfont from '@/iconfont/index.vue';
const props = defineProps({
  isMe: {
    type: Boolean,
  },
  userInfo: {
    type: Object as PropType<IUserInfo>,
  },
  replyMsg: {
    type: Object as PropType<IMsgInfo>,
  },
});
const { t } = useI18n();
const replyContent = computed(() => {
  let name: string;
  const msgContentType = props?.replyMsg?.msgContent?.msgContentType;
  if (msgContentType === 1) {
    name = props?.replyMsg?.msgContent?.stringContent;
  } else if (msgContentType === 7) {
    name = props?.replyMsg?.msgContent?.groupAtInfo?.stringContent;
  } else if (msgContentType === 25) {
    name = props?.replyMsg?.msgContent?.linkUrlInfo?.url;
  } else if (msgContentType === 2) {
    name = t('[图片]');
  } else if (msgContentType === 3) {
    name = t('[语音]');
  } else if (msgContentType === 15) {
    name = t('[名片]');
  } else if (msgContentType === 23) {
    name = t('[视频]');
  } else if (msgContentType === 27) {
    name = t('[表情]');
  } else {
    const res =
      props?.replyMsg?.msgContent?.fileInfo?.fileName?.split('.') || [];
    if (res.length > 1) {
      const suffix = res[1];
      name = `[ ${suffix.toLocaleLowerCase()} ]`;
    }
  }
  return name;
});
const replyContentImg = computed(() => {
  let imageUrl: string;
  const msgContentType = props?.replyMsg?.msgContent?.msgContentType;
  if (msgContentType === 2) {
    imageUrl = props?.replyMsg?.msgContent?.imageMsg?.imageUrl;
  } else if (msgContentType === 3) {
    imageUrl = 'voiceMsg';
  } else if (msgContentType === 15) {
    imageUrl = require(`../../../assets/img/card.svg`);
  } else if (msgContentType === 23) {
    imageUrl = props?.replyMsg?.msgContent?.videoMsgInfo?.imageUrl;
  } else {
    const res =
      props?.replyMsg?.msgContent?.fileInfo?.fileName?.split('.') || [];
    if (res.length > 1) {
      const suffix = res[1];
      if (suffix.toLocaleLowerCase().includes('doc')) {
        imageUrl = 'iconWORD';
      } else if (suffix.toLocaleLowerCase().includes('xls')) {
        imageUrl = 'iconexcel';
      } else if (suffix.toLocaleLowerCase().includes('pdf')) {
        imageUrl = 'iconpdf';
      } else {
        imageUrl = 'iconwenjian';
      }
      // imageUrl = require(`../../../assets/img/${suffix.toLocaleLowerCase()}.svg`);
    }
  }
  return imageUrl;
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
  &-content {
    font-size: 16px;
    display: flex;
    //justify-content: space-between;
    align-items: center;
    .left {
      margin-right: 11px;
      span {
        font-size: 12px;
        font-weight: 400;
        // color: #99ceff;
        line-height: 18px;
        display: block;
      }
      .quot {
        font-size: 18px;
        font-weight: bold;
        display: inline;
      }
    }
    .right {
      .image {
        width: 28px;
        height: 28px;
        border-radius: 4px;
      }
      .file {
        width: 26px;
        height: 28px;
      }
    }
  }
  &-stringContent {
    font-size: 16px;
    .nickname {
      font-size: 12px;
      font-weight: 400;
      color: #99ceff;
      line-height: 25px;
    }
    .nameColor {
      color: #999999 !important;
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background: #ffffff;
    opacity: 0.2;
    margin: 10px 0;
  }
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
