<template>
  <div class="yImg">
    <div @click="$emit('click')" class="img">
      <img v-if="userInfo?.icon" class="userImg" :src="userInfo?.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <div>
      <!-- <img :width="width" :height="height" :src="src" alt="" /> -->
      <SayHello v-if="src === 'emoji_1'" />
      <div class="box" v-else-if="replyMsg?.msgId">
        <ImgBg v-bind="$attrs" :fired="fired">
          <Fire :isBurn="isBurn" :fired="fired" :left="`-15px`" :top="`-8px`" />
          <Reply :replyMsg="replyMsg" :userInfo="replyUserInfo" />
          <img
            @click="shogImg"
            style="max-width: 100%; max-height: 100%; cursor: pointer"
            :src="src"
            alt=""
          />
        </ImgBg>
      </div>
      <div v-else class="imgBg" @contextmenu="contextmenu">
        <div class="title" v-if="isGroup">{{ userInfo?.nickname }}</div>
        <Fire :isBurn="isBurn" :fired="fired" :right="`-15px`" :top="`-10px`" />
        <img
          @click="shogImg"
          style="max-width: 100%; max-height: 100%; cursor: pointer"
          :src="src"
          alt=""
        />
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
import Fire from '../Fire/index.vue';
import ImgBg from '../ImgBg/index.vue';
import Reply from '../Reply/index.vue';
import { useI18n } from 'vue-i18n';
import { IUserInfo } from '@/types/user';
import { IMsgInfo } from '@/types/msg';
import { key } from '@/store';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'Message',
});
</script>
<script lang="ts" setup>
const props = defineProps({
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
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
  replyUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  replyMsg: {
    type: Object as PropType<IMsgInfo>,
  },
});
const { t } = useI18n();
const store = useStore(key);
const isGroup = computed(() => store.state.activeIsGroup);

const emit = defineEmits(['menuClick', 'click', 'showBigImg']);

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
    width: 46px;
    height: 46px;
    margin-right: 10px;
    img {
      width: 46px;
      height: 46px;
    }
  }
}
.box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 70%;
}
</style>
