<template>
  <div class="mmsg">
    <img @click="$emit('click')" :src="userInfo?.icon" />
    <div>
      <div style="flex: 1">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps, defineEmits } from 'vue';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { IUserInfo } from '@/types/user';
import { IVisitingCard } from '@/types/msg';
defineComponent({
  name: 'YVisitingCard',
});
</script>
<script lang="ts" setup>
defineEmits(['click', 'clickCard']);
defineProps({
  item: {
    type: Object as PropType<IVisitingCard>,
    required: true,
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
        width: 100px;
        font-size: 16px;
        margin-bottom: 5px;
        color: #333;
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
