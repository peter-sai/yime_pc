<template>
  <div class="chatHeader">
    <div class="header">
      <div class="headerLeft">
        <div class="userImg">
          <Iconfont
            v-if="isBotUser"
            name="iconbianzu16"
            color="#A8B5BE"
            size="38"
          />
          <div v-else>
            <img v-if="icon" :src="icon" alt="" />
            <Iconfont v-else name="iconlianxiren" color="#A8B5BE" size="38" />
          </div>
        </div>
        <div class="userInfo">
          <div class="name">{{ title }}</div>
          <div class="subTitle">{{ subTitle }}</div>
        </div>
      </div>
      <div class="headerRight">
        <Iconfont @click="queryClick" name="iconsousuo" size="20" />
        <Iconfont @click="rightClick" name="icondiandian" size="20" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineEmits, defineProps } from 'vue';
export default defineComponent({
  name: 'chatHeader',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { Etag } from '../Layout/index.vue';
const emit = defineEmits(['toggleBox', 'changeTag', 'queryClick']);
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
  isBotUser: {
    type: Boolean,
    default: false,
  },
});
const rightClick = () => {
  emit('toggleBox');
  emit('changeTag', Etag.UserInfo);
};
const queryClick = () => {
  emit('queryClick');
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.chatHeader {
  .header {
    display: flex;
    justify-content: space-between;
    height: 64px;
    align-items: center;
    padding: 0 21px;
    border-bottom: 1px solid #eaebea;
    .headerLeft {
      display: flex;
      .userImg {
        img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
        }
      }
      .userInfo {
        padding-bottom: 5px;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        justify-content: space-between;
        .name {
          height: 20px;
          font-size: 14px;
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 500;
          color: #0a0a0a;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 250px;
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
      display: flex;
      align-items: center;
      .iconfont {
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
}
</style>
