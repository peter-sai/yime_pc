<template>
  <div class="tableDouble" :class="{ hover }">
    <div class="left">
      <slot name="userImg"></slot>
    </div>
    <div class="middle">
      <div class="title">{{ title }}<slot name="title" /></div>
      <div
        v-if="html"
        :style="{ width: subAuto }"
        class="subTitle"
        v-html="subTitle"
      ></div>
      <div v-else class="subTitle" :style="{ width: subAuto }">
        {{ subTitle }}<slot name="subTitle" />
      </div>
    </div>
    <div class="right" :class="{ showMore: slots.right }">
      <div v-if="slots.right">
        <slot name="right" />
      </div>
      <div v-if="slots.time" class="time">
        <slot name="time"></slot>
      </div>
      <div v-if="slots.num" class="num">
        <slot name="num"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TableDouble',
};
</script>

<script setup lang="ts">
import { defineProps, useSlots } from 'vue';
defineProps({
  title: {
    type: String,
    requierd: true,
  },
  subTitle: {
    type: String,
    default: '',
  },
  subAuto: {
    type: String,
    default: '12.3rem',
  },
  html: {
    type: Boolean,
    default: false,
  },
  hover: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
</script>

<style lang="scss">
.subTitle > * {
  font-size: 14px;
}
</style>
<style lang="scss" scoped>
@import '@/style/base.scss';
.tableDouble {
  display: flex;
  justify-content: space-between;
  .left {
    margin-right: 10px;
  }
  .middle {
    flex: 1;
    padding: 3px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    .title {
      font-size: 16px;
      color: #333;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .subTitle {
      font-size: 14px;
      color: #999;
      // margin-top: 10px;
      line-height: 18px;
      height: 18px;
      width: 200px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    &.showMore {
      justify-content: center;
    }
    .time {
      font-size: 12px;
      @include theme('color', input);
    }
    .num {
      font-size: 12px;
      @include theme('color', sub);
    }
  }
}
.hover {
  background: #0085ff;
  .middle {
    .title {
      color: #fff;
    }
    .subTitle {
      color: #fff;
    }
  }
}
</style>
