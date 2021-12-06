<template>
  <div class="fireInfo" :class="{ isMe: isMe }" @click="onDestroy">
    <div>
      <ImBg :isMe="isMe">{{ content }}</ImBg>
      <div class="item">
        <Iconfont name="iconyuehoujifen2" size="20" />
        <span>{{ t('松手即焚毁') }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import Iconfont from '@/iconfont';
import ImBg from '@/components/ImBg/index.vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { Toast } from '../Toast';

export default {
  name: 'FireInfo',
  components: {
    Iconfont,
    ImBg,
  },
  props: {
    content: {
      type: String,
      default: '',
    },
    isMe: {
      type: Boolean,
      default: false,
    },
    destroy: {
      type: Function,
    },
    msgId: {
      type: Number || String,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const store = useStore();
    const onDestroy = async () => {
      props.destroy();
      if (props.msgId) {
        const data = await store.dispatch('postMsg', {
          query: { msgId: props.msgId },
          cmd: 2157,
          encryption: 'Aoelailiao.Message.FireReadFireMessageToServserReq',
          auth: true,
        });
        if (data.body.resultCode !== 0) {
          Toast(t(data.body.resultString));
        }
      }
    };

    return { onDestroy, t };
  },
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.fireInfo {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  &.isMe {
    justify-content: flex-end;
  }
  .imBg {
    margin-bottom: 10px;
  }
  .item {
    display: flex;
    align-items: center;
    span {
      font-size: 12px;
      color: #eee;
      margin-left: 5px;
    }
  }
}
</style>
