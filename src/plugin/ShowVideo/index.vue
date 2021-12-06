<template>
  <transition name="fade" @after-leave="close">
    <div id="video" v-if="isShow"></div>
  </transition>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
export default {
  name: 'Dialog',
  components: {},
  props: {
    title: {
      type: String,
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
    return { close, isShow, t };
  },
};
</script>

<style lang="scss">
@import '@/style/base.scss';
#video {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  video {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    object-fit: cover;
    height: 100%;
    width: 100%;
    &:nth-child(2) {
      height: 150px;
      width: 100px;
      right: 10px;
      top: 10px;
      left: auto;
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
