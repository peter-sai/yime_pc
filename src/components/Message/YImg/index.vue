<template>
  <div class="yImg">
    <div @click="$emit('click')">
      <img v-if="userInfo?.icon" class="userImg" :src="userInfo?.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <div>
      <!-- <img :width="width" :height="height" :src="src" alt="" /> -->
      <SayHello v-if="src === 'emoji_1'" />
      <div v-else class="imgBg" @contextmenu="contextmenu">
        <div class="title" v-if="isGroup">{{ userInfo?.nickname }}</div>
        <img style="max-width: 100%; max-height: 100%" :src="src" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  defineProps,
  PropType,
  defineEmits,
} from 'vue';
import Iconfont from '@/iconfont/index.vue';
import SayHello from '../SayHello/index.vue';
import { useI18n } from 'vue-i18n';
import { IUserInfo } from '@/types/user';
import { key } from '@/store';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'Message',
});
</script>
<script lang="ts" setup>
defineProps({
  src: {
    type: String,
    default: '',
  },
  userInfo: {
    type: Object as PropType<IUserInfo>,
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  groupDetailInfo: {
    type: Object,
  },
  groupMemberSplit: {
    type: Boolean,
  },
});
const { t } = useI18n();
const store = useStore(key);
const isGroup = computed(() => store.state.activeIsGroup);

const emit = defineEmits(['menuClick', 'click']);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.imgBg {
  max-width: 60%;
  .title {
    font-size: 10px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    margin-bottom: 5px;
  }
}
.yImg {
  display: flex;
  .userImg {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .img {
    width: 160px;
    height: 90px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
