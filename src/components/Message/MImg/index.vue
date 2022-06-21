<template>
  <div class="mImg">
    <div style="flex: 1">
      <div
        style="
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;
        "
      >
        <!-- <img :width="width" :height="height" :src="src" alt="" /> -->
        <SayHello v-if="src === 'emoji_1'" />
        <div class="box" v-else-if="replyMsg?.msgId" @contextmenu="contextmenu">
          <ImgBg v-bind="$attrs" isMe :fired="fired">
            <Fire
              :isBurn="isBurn"
              :fired="fired"
              :left="`-15px`"
              :top="`-8px`"
            />
            <Reply :replyMsg="replyMsg" :userInfo="replyUserInfo" isMe />
            <img
              @click="shogImg"
              :src="src"
              :style="
                isEmoji
                  ? { maxWidth: '100px', maxHeight: '100px' }
                  : { maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }
              "
              alt=""
            />
          </ImgBg>
        </div>
        <div class="imgBg" v-else @contextmenu="contextmenu">
          <Fire :isBurn="isBurn" :fired="fired" :left="`-15px`" :top="`-8px`" />
          <img
            @click="shogImg"
            @load="emit('delImgLoadEvent')"
            @error="emit('delImgLoadEvent')"
            :src="src"
            :style="
              isEmoji
                ? { maxWidth: '100px', maxHeight: '100px' }
                : { maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }
            "
            alt=""
          />
        </div>
      </div>
      <IsRead :isRead="isRead" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, defineEmits, PropType } from 'vue';
import SayHello from '../SayHello/index.vue';
import Fire from '../Fire/index.vue';
import IsRead from '@/components/IsRead/index.vue';
import Reply from '../Reply/index.vue';
import { IMsgInfo } from '@/types/msg';
import { IUserInfo } from '@/types/user';
import ImgBg from '../ImgBg/index.vue';
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
  isEmoji: {
    type: Boolean,
  },
});

const emit = defineEmits([
  'menuClick',
  'showBigImg',
  'addImgLoadEvent',
  'delImgLoadEvent',
]);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};

const shogImg = () => {
  emit('showBigImg');
};

emit('addImgLoadEvent');
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.imgBg {
  max-width: 70%;
  margin: auto 0 auto auto;
  display: flex;
  justify-content: flex-end;
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
.box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 70%;
}
</style>
