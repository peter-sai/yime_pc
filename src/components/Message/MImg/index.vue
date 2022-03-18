<template>
  <div class="mImg">
    <div style="flex: 1">
      <div>
        <!-- <img :width="width" :height="height" :src="src" alt="" /> -->
        <SayHello v-if="src === 'emoji_1'" />
        <div class="imgBg" v-else @contextmenu="contextmenu">
          <img
            @click="shogImg"
            style="max-width: 100%; max-height: 100%; cursor: pointer"
            :src="src"
            alt=""
          />
        </div>
      </div>
      <IsRead :isRead="isRead" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, defineEmits } from 'vue';
import SayHello from '../SayHello/index.vue';
import IsRead from '@/components/IsRead/index.vue';
export default defineComponent({
  name: 'MImg',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  src: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['menuClick', 'showBigImg']);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};

const shogImg = () => {
  emit('showBigImg');
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.imgBg {
  max-width: 70%;
  margin: auto 0 auto auto;
}
.mImg {
  text-align: right;
  display: flex;
  .userImg {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    margin-left: 10px;
  }
  .img {
    width: 160px;
    height: 90px;
    margin: 0 0 0 auto;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
