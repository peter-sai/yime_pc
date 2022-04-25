<template>
  <div class="mmsg">
    <div class="img" @click="$emit('click')">
      <Iconfont v-if="userInfo?.isBotUser" name="iconbianzu16" size="44" />
      <img v-else-if="userInfo?.icon" :src="userInfo.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <div>
      <div class="title" v-if="isGroup">{{ userInfo?.nickname }}</div>
      <ImBg v-bind="$attrs">
        <Fire :isBurn="isBurn" :fired="fired" :right="`-20px`" :top="`-15px`" />
        <Reply :replyMsg="replyMsg" :userInfo="replyUserInfo" />
        <p v-for="item in list" :key="item" class="text">
          {{ item.replace(/\u0000/g, '') }}
        </p>
      </ImBg>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineProps,
  useSlots,
  PropType,
  computed,
  defineEmits,
} from 'vue';
import ImBg from '../ImgBg/index.vue';
import Fire from '../Fire/index.vue';
import Reply from '../Reply/index.vue';
import Iconfont from '@/iconfont/index.vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { IUserInfo } from '@/types/user';
import { IMsgInfo } from '@/types/msg';
import { key } from '@/store';
export default defineComponent({
  name: 'Ymsg',
});
</script>
<script lang="ts" setup>
defineEmits(['click']);
defineProps({
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
  userInfo: {
    type: Object as PropType<IUserInfo>,
  },
  replyUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  replyMsg: {
    type: Object as PropType<IMsgInfo>,
  },
});
const store = useStore(key);
const isGroup = computed(() => store.state.activeIsGroup);
const slots: any = useSlots();

const list = slots.default()[0].children
  ? slots.default()[0].children.split('\n\n')
  : [];
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.mmsg {
  display: flex;
  max-width: 80%;
  .line {
    width: 100%;
    height: 1px;
    background: #000000;
    opacity: 0.2;
    margin: 5px 0;
  }
  .title {
    font-size: 12px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    margin-bottom: 5px;
  }
  .text {
    font-size: 16px;
    color: #333;
    padding: 0;
  }
  .img {
    img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
    }
    margin-right: 10px;
  }
  .pointer {
    cursor: pointer;
  }
}
</style>
