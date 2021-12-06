<template>
  <div class="nav">
    <div class="nav-label">
      <div class="left" @click="clickLeft">
        <Iconfont v-if="!hideLeft" name="iconleft" size="20" color="main" />
        <slot name="left" />
      </div>
      <div class="title">
        {{ title && t(title) }}
      </div>
      <div class="right">
        <span
          class="rightText"
          :class="{ rightTextDef: rightTextDef }"
          @click="$emit('rigthClick')"
          v-if="rightText"
          >{{ rightText }}</span
        >
        <div style="display: inline-block">
          <slot name="right" />
        </div>
        <Iconfont v-if="showRight" name="icondiandian" color="main" size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { useRouter } from 'vue-router';
import { useGoBack } from '@/hooks/index';
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  title: {
    type: String,
  },
  hideLeft: {
    type: Boolean,
  },
  showRight: {
    type: Boolean,
  },
  rightText: {
    type: String,
  },
  isGroup: {
    type: Boolean,
  },
  rightTextDef: {
    type: Boolean,
  },
  disableLeft: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['rigthClick', 'leftClick']);

const goBack = useGoBack(useRouter);
const { t } = useI18n();
// 点击左侧
const clickLeft = () => {
  emit('leftClick');
  if (!props.disableLeft) {
    goBack();
  }
};
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.nav {
  height: 50px;
  z-index: 999999;
  padding: 0 15px;
  background: #fff;
  box-sizing: border-box;
  .nav-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    .left {
      cursor: pointer;
    }
    & > div {
      flex: 1;
      &.title {
        font-size: 18px;
        flex: 4;
        text-align: center;
        font-weight: 500;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.right {
        text-align: right;
        position: relative;
        .rightText {
          font-size: 14px;
          cursor: pointer;
          color: #0085ff;
          &.rightTextDef {
            color: #b3b3b3;
          }
        }
        .toastBg {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          opacity: 0.05;
        }
        .toast {
          position: absolute;
          right: -5px;
          top: 35px;
          background: #f4f4f4;
          padding: 0 24px;
          border-radius: 4px;
          .item {
            display: flex;
            align-items: center;
            margin: 20px 0;
            span {
              font-size: 16px;
              color: #333333;
              white-space: nowrap;
              margin-left: 8px;
            }
          }
          &::after {
            position: absolute;
            right: 10px;
            top: -10px;
            content: '';
            display: block;
            border-top-color: transparent;
            border-left-color: transparent;
            border-right-color: transparent;
            border-style: solid;
            border-width: 5px;
            border-bottom-color: #f4f4f4;
          }
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
