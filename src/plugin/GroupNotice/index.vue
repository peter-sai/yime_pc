<template>
  <transition name="fade" @after-leave="close">
    <div class="diglog" v-if="isShow">
      <div class="box">
        <div class="head">
          <div class="logo">
            <Iconfont name="iconbianzu8" color="main" size="50" />
            <span>{{ t('群公告') }}</span>
          </div>
          <div class="time">
            {{ moment(time * 1000).format('YYYY-MM-DD HH:mm') }}
          </div>
        </div>
        <div class="title">{{ title }}</div>
        <div class="btn">
          <div class="right" @click="submit">{{ t('我知道了') }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, onMounted } from 'vue';
import Iconfont from '@/iconfont/index.vue';
import moment from 'moment';
import { useI18n } from 'vue-i18n';
export default {
  name: 'GroupNotice',
  components: {
    Iconfont,
  },
  props: {
    title: {
      type: String,
    },
    time: {
      type: Number,
    },
    callBack: {
      type: Function,
    },
    destroy: {
      type: Function,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const isShow = ref(false);
    const close = () => {
      props.destroy();
    };
    onMounted(() => {
      isShow.value = true;
    });
    const submit = () => {
      props.callBack && props.callBack();
      isShow.value = false;
    };
    return { close, isShow, submit, moment, t };
  },
};
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.diglog {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  .box {
    width: 80%;
    @include theme(background, dialog);
    border-radius: 5px;
    .head {
      padding: 20px 0;
      border-bottom-style: solid;
      border-bottom-width: 1px;
      @include theme(border-bottom-color, inputborder);
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          font-size: 18px;
          @include theme(color, main);
        }
      }
      .time {
        font-size: 16px;
        @include theme(color, sub);
        text-align: center;
      }
    }
    .title {
      font-size: 16px;
      @include theme(color, main);
      padding: 10px 20px;
      line-height: 30px;
      max-height: 200px;
      overflow: auto;
    }
    .btn {
      display: flex;
      align-items: center;
      border-top-width: 1px;
      border-top-style: solid;
      @include theme(border-top-color, inputborder);
      div {
        font-size: 16px;
        flex: 1;
        text-align: center;
        padding: 10px 0;
        @include theme('color', prominent);
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
