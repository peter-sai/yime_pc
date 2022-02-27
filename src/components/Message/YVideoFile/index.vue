<template>
  <div class="yImg">
    <div @click="$emit('click')">
      <img class="userImg" :src="userInfo?.icon" />
    </div>
    <div>
      <div class="imgBg" @contextmenu="contextmenu">
        <div v-if="isGroup" class="title">
          {{ userInfo?.nickname }}
        </div>
        <div class="imgBox" ref="imgBox">
          <div v-if="!isPlay">
            <img
              style="max-width: 100%; max-height: 100%"
              :src="videoMsgInfo?.imageUrl"
              alt=""
            />
            <div class="icon" @click="play">
              <Iconfont name="iconplay1" size="20" color="#fff" />
            </div>
          </div>
        </div>
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
  ref,
  nextTick,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { IUserInfo } from '@/types/user';
import { key } from '@/store';
import { useStore } from 'vuex';
import { IVideoMsgInfo } from '@/types/msg';
export default defineComponent({
  name: 'Message',
});
</script>
<script lang="ts" setup>
import Iconfont from '../../../iconfont/index.vue';
const props = defineProps({
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
  videoMsgInfo: {
    type: Object as PropType<IVideoMsgInfo>,
  },
});
const { t } = useI18n();
const store = useStore(key);
const isGroup = computed(() => store.state.activeIsGroup);
const imgBox = ref(null);
let video: HTMLVideoElement | null = null;
const isPlay = ref(false);

const emit = defineEmits(['menuClick', 'click']);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};

const play = async () => {
  isPlay.value = true;
  if (!video) {
    video = document.createElement('video');
    video.setAttribute('src', props.videoMsgInfo!.url);
    video.setAttribute('controls', true);
    video.setAttribute(
      'style',
      'width: 100%;height: 100%;position:relative;z-index:99',
    );
    imgBox.value.append(video);
    await nextTick();
    video.play();
  } else {
    video.play();
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.imgBg {
  max-width: 40%;
  .title {
    font-size: 10px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    margin-bottom: 5px;
  }
  .imgBox {
    position: relative;
    width: 200px;
    height: 400px;
    display: block;
    img {
      max-height: 100%;
      max-width: 100%;
    }
    &::after {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba($color: #000000, $alpha: 0.2);
      content: '';
    }
    .icon {
      position: absolute;
      z-index: 999;
      left: 50%;
      top: 50%;
      width: 50px;
      cursor: pointer;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba($color: #000000, $alpha: 0.6);
      transform: translate(-50%, -50%);
    }
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
