<template>
  <div class="mmsg">
    <div style="flex: 1">
      <div class="fileBg">
        <div class="left">
          <div class="title">{{ t(item.showContent) }}</div>
          <div class="content">
            <img class="userImg" :src="item?.icon" alt="" />
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
import { PropType, defineComponent, defineProps } from 'vue';
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
});
const { t } = useI18n();
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
</style>
