<template>
  <div class="yImg">
    <div @click="$emit('click')" class="img">
      <img v-if="userInfo?.icon" class="userImg" :src="userInfo?.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <div>
      <ImgBg v-bind="$attrs" :fired="fired" v-if="replyMsg?.msgId">
        <Fire :isBurn="isBurn" :fired="fired" :right="`-18px`" :top="`-15px`" />
        <Reply :replyMsg="replyMsg" :userInfo="replyUserInfo" />
        <div class="imgBg" @contextmenu="contextmenu">
          <div class="imgBox" ref="imgBox" :style="style">
            <div
              v-if="!isPlay"
              style="width: 100%; height: 100%; text-align: center"
            >
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
      </ImgBg>
      <div class="imgBg" @contextmenu="contextmenu" v-else>
        <div v-if="isGroup" class="title">
          {{ userInfo?.nickname }}
        </div>
        <div class="imgBox" ref="imgBox" :style="style">
          <Fire
            :isBurn="isBurn"
            :fired="fired"
            :right="`-18px`"
            :top="`-15px`"
          />
          <div
            v-if="!isPlay"
            style="width: 100%; height: 100%; text-align: center"
          >
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
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { IUserInfo } from '@/types/user';
import { key } from '@/store';
import { useStore } from 'vuex';
import { IVideoMsgInfo } from '@/types/msg';
import { IMsgInfo } from '@/types/msg';
import Fire from '../Fire/index.vue';
import Reply from '../Reply/index.vue';
import ImgBg from '../ImgBg/index.vue';
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
  msgId: {
    type: Number,
  },
  playMsgId: {
    type: Number,
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

const style = ref({});
if (Number(props.videoMsgInfo?.weight) > 400) {
  style.value = {
    width: '400px',
    height: `${
      (Number(props.videoMsgInfo?.height) /
        Number(props.videoMsgInfo?.weight)) *
      400
    }px`,
  };
}
if (
  (Number(props.videoMsgInfo?.height) / Number(props.videoMsgInfo?.weight)) *
    400 >
  400
) {
  style.value = {
    height: '400px',
    width: `${
      (Number(props.videoMsgInfo?.weight) /
        Number(props.videoMsgInfo?.height)) *
      400
    }px`,
  };
}

const { t } = useI18n();
const store = useStore(key);
const isGroup = computed(() => store.state.activeIsGroup);
const imgBox = ref(null);
let video: HTMLVideoElement | null = null;
const isPlay = ref(false);

const emit = defineEmits(['menuClick', 'click', 'onPlay']);

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
    video.setAttribute('style', 'width: 100%;height: 100%');
    imgBox.value.append(video);
    await nextTick();
    video.play();

    video.addEventListener('play', function () {
      emit('onPlay', props.msgId);
    });
  } else {
    video.play();
  }
  emit('onPlay', props.msgId);
};

const playMsgId = computed(() => props.playMsgId);

watch(playMsgId, (val) => {
  if (val !== props.msgId) {
    video && video.pause();
  }
});
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
    max-height: 400px;
    max-width: 400px;
    img {
      max-height: 100%;
      max-width: 100%;
    }
    &::before {
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
    width: 45px;
    height: 45px;
    margin-right: 10px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
