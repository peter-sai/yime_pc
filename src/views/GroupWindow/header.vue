<template>
  <div class="groupChatHeader">
    <div class="addGroup">
      <div class="left"></div>
      <div class="middle">{{ t('加入群通话') }}</div>
      <div class="right">
        <span>{{ t('加入') }}</span>
      </div>
    </div>
    <div class="header">
      <div class="headerLeft">
        <div class="userImg">
          <img v-if="icon" :src="icon" alt="" />
          <span v-else>{{
            title ? title.substr(0, 1).toLocaleUpperCase() : ''
          }}</span>
        </div>
        <div class="userInfo">
          <div class="name">{{ title }}</div>
          <div class="subTitle">{{ subTitle }}</div>
        </div>
      </div>
      <div class="headerRight">
        <Iconfont @click="rightClick" name="icondiandian" size="20" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineEmits, defineProps } from 'vue';
export default defineComponent({
  name: 'groupChatHeader',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { Etag } from '../Layout/index.vue';
import { useI18n } from 'vue-i18n';
const emit = defineEmits(['toggleBox', 'changeTag']);
const rightClick = () => {
  emit('toggleBox');
  emit('changeTag', Etag.GroupInfo);
};
defineProps({
  title: {
    type: String,
  },
  subTitle: {
    type: String || Number,
  },
  icon: {
    type: String,
  },
});
const { t } = useI18n();
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.groupChatHeader {
  .addGroup {
    height: 50px;
    background: #0085ff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    div {
      flex: 1;
    }
    .middle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
    }
    .right {
      text-align: right;
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        width: 50px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid #ffffff;
        text-align: center;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
      }
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    height: 64px;
    align-items: center;
    padding: 0 21px;
    border-bottom: 1px solid #eaebea;
    background: #fff;
    .headerLeft {
      display: flex;
      .userImg {
        img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: #0085ff;
          font-size: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
        }
      }
      .userInfo {
        padding-bottom: 5px;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        justify-content: space-between;
        .name {
          height: 14px;
          font-size: 14px;
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 500;
          color: #0a0a0a;
          line-height: 21px;
        }
        .subTitle {
          height: 10px;
          font-size: 10px;
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: left;
          color: #999999;
          line-height: 15px;
        }
      }
    }
    .headerRight {
      .iconfont {
        cursor: pointer;
      }
    }
  }
}
</style>
