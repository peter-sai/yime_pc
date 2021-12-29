<template>
  <div class="mmsg">
    <img :src="userInfo?.icon" />
    <div>
      <div style="flex: 1">
        <div class="fileBg">
          <div class="left">
            <div class="title">{{ t(item?.showContent) }}</div>
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
import { defineComponent, defineProps } from 'vue';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { IUserInfo } from '@/types/user';
import { IVisitingCard } from '@/types/msg';
defineComponent({
  name: 'YVisitingCard',
});
</script>
<script lang="ts" setup>
defineProps({
  item: {
    type: Object as PropType<IVisitingCard>,
  },
  userInfo: {
    type: Object as PropType<IUserInfo>,
  },
});
const { t } = useI18n();
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
    @include theme('background', encryption);
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
        width: 100px;
        font-size: 16px;
        margin-bottom: 5px;
        @include theme('color', main);
        line-height: 22px;
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
          @include theme('background', divider);
          @include theme('color', prominent);
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .size {
          font-size: 14px;
          @include theme('color', sub);
          line-height: 17px;
        }
      }
    }
  }
  .isRead {
    font-size: 12px;
    @include theme('color', input);
    margin-top: 5px;
    img {
      width: 12px;
    }
  }
}
</style>
