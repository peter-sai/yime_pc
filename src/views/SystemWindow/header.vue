<template>
  <div class="SystemWindowHeader">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineEmits, defineProps } from 'vue';
export default defineComponent({
  name: 'SystemWindowHeader',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { Etag } from '../Layout/index.vue';
const emit = defineEmits(['toggleBox', 'changeTag']);
defineProps({
  title: {
    type: String,
  },
  icon: {
    type: String,
  },
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.SystemWindowHeader {
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
        justify-content: center;
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
