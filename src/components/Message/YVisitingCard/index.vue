<template>
  <div class="mmsg">
    <img v-if="userInfo?.icon" @click="$emit('click')" :src="userInfo?.icon" />
    <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    <div>
      <div style="flex: 1" @contextmenu="contextmenu">
        <ImBg v-bind="$attrs" v-if="replyMsg?.msgId">
          <Reply :replyMsg="replyMsg" :userInfo="replyUserInfo" />
          <div class="fileBg" @click="$emit('clickCard')">
            <div class="left">
              <div class="title">{{ t(item.showContent) }}</div>
              <div class="content">
                <img
                  v-if="item?.icon"
                  class="userImg"
                  :src="item?.icon"
                  alt=""
                />
                <span v-else>{{
                  item?.name.substr(0, 1).toLocaleUpperCase()
                }}</span>
                <div class="size">{{ item?.name }}</div>
              </div>
            </div>
          </div>
          <Fire
            :isBurn="isBurn"
            :fired="fired"
            :left="`-20px`"
            :top="`-100px`"
          />
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps, defineEmits } from 'vue';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { IUserInfo } from '@/types/user';
import { IMsgInfo } from '@/types/msg';
import Fire from '../Fire/index.vue';
import Reply from '../Reply/index.vue';
import ImBg from '../ImgBg/index.vue';
import Iconfont from '../../../iconfont/index.vue';
import { IVisitingCard } from '@/types/msg';
defineComponent({
  name: 'YVisitingCard',
});
</script>
<script lang="ts" setup>
defineProps({
  item: {
    type: Object as PropType<IVisitingCard>,
    required: true,
  },
  userInfo: {
    type: Object as PropType<IUserInfo>,
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

const emit = defineEmits(['menuClick', 'click', 'clickCard']);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.mmsg {
  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-right: 10px;
  }
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
      .title {
        width: 180px;
        font-size: 16px;
        margin-bottom: 5px;
        color: #333;
        line-height: 22px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .content {
        display: flex;
        align-items: center;
        .userImg,
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
        .size {
          font-size: 14px;
          color: #666;
          line-height: 17px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 150px;
        }
      }
    }
  }
  .isRead {
    font-size: 12px;
    color: #b3b3b3;
    margin-top: 5px;
    img {
      width: 12px;
    }
  }
}
</style>
