<template>
  <div class="mmsg">
    <div class="wrapper">
      @contextmenu="contextmenu">
      <ImBg v-bind="$attrs" isMe v-if="replyMsg?.msgId">
        <Reply :replyMsg="replyMsg" :userInfo="replyUserInfo" isMe />
        <div class="fileBg" @click="$emit('clickCard')">
          <div class="left">
            <div class="title">{{ t(item.showContent) }}</div>
            <div class="content">
              <img v-if="item?.icon" class="userImg" :src="item?.icon" alt="" />
              <span v-else>{{
                item?.name.substr(0, 1).toLocaleUpperCase()
              }}</span>
              <div class="size">{{ item?.name }}</div>
            </div>
          </div>
        </div>
        <Fire :isBurn="isBurn" :fired="fired" :left="`-20px`" :top="`-100px`" />
      </ImBg>
      <div v-else class="fileBg" @click="$emit('clickCard')">
        <div class="left">
          <div class="title">{{ t(item.showContent) }}</div>
          <div class="content">
            <img v-if="item?.icon" class="userImg" :src="item?.icon" alt="" />
            <span v-else>{{
              item?.name.substr(0, 1).toLocaleUpperCase()
            }}</span>
            <div class="size">{{ item?.name }}</div>
          </div>
        </div>
      </div>
      <IsRead :isRead="isRead" />
    </div>
  </div>
</template>
<script lang="ts">
import IsRead from '@/components/IsRead/index.vue';
import { useI18n } from 'vue-i18n';
import { IVisitingCard } from '@/types/msg';
import { IMsgInfo } from '@/types/msg';
import { IUserInfo } from '@/types/user';
import ImBg from '../ImgBg/index.vue';
import Fire from '../Fire/index.vue';
import Reply from '../Reply/index.vue';
import { PropType, defineComponent, defineProps, defineEmits } from 'vue';
export default defineComponent({
  name: 'MVisitingCard',
});
</script>
<script lang="ts" setup>
defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as PropType<IVisitingCard>,
    required: true,
  },
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
  replyUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  replyMsg: {
    type: Object as PropType<IMsgInfo>,
  },
});
const { t } = useI18n();

const emit = defineEmits(['menuClick', 'clickCard']);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.mmsg {
  text-align: right;
  display: flex;
  .fileBg {
    text-align: left;
    background: #f4f6ff;
    display: flex;
    justify-content: space-between;
    width: 222px;
    height: 88px;
    margin: 0 0 0 auto;
    padding: 12px;
    box-sizing: border-box;
    align-items: center;
    border-radius: 14px 0px 14px 14px;
    .left {
      flex: 1;
      .title {
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        margin-bottom: 5px;
        color: #333;
        line-height: 22px;
      }
      .content {
        display: flex;
        align-items: center;
        span {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          background: #f0f0f0;
          color: #0085ff;
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .userImg {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .size {
          font-size: 14px;
          color: #666;
          line-height: 17px;
        }
      }
    }
  }
}
.wrapper {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>
