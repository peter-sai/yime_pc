<template>
  <transition name="fade" @after-leave="close">
    <div class="diglog" v-if="isShow">
      <div class="box">
        <div class="title">{{ title }}</div>
        <div class="btn">
          <div class="left" @click="isShow = false">{{ t('取消') }}</div>
          <div class="right" @click="submit">{{ t('确定') }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { ref, onMounted, defineProps, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'Dialog',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
  },
  callBack: {
    type: Function,
  },
  destroy: {
    type: Function,
  },
});

const { t } = useI18n();
const isShow = ref(false);
const close = () => {
  props.destroy && props.destroy();
};
onMounted(() => {
  isShow.value = true;
});
const submit = async () => {
  if (props.callBack) {
    await props.callBack();
  }
  isShow.value = false;
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
    width: 310px;
    background: #f9f9f9;
    border-radius: 5px;
    .title {
      font-size: 16px;
      @include theme(color, main);
      padding: 40px 20px;
      text-align: center;
      line-height: 30px;
    }
    .btn {
      display: flex;
      align-items: center;
      border-top-width: 1px;
      border-top-style: solid;
      border-top-color: #ededed;
      div {
        font-size: 16px;
        cursor: pointer;
        flex: 1;
        text-align: center;
        padding: 10px 0;
        &.right {
          border-left-width: 1px;
          border-left-style: solid;
          border-left-color: #ededed;
          color: #0085ff;
        }
        &.left {
          color: #666666;
        }
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
