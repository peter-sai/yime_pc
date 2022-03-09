<template>
  <div class="mImg">
    <div>
      <div style="display: flex; justify-content: flex-end">
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
      </div>
      <IsRead :isRead="isRead" />
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineProps,
  defineEmits,
  PropType,
  ref,
  nextTick,
  watch,
  computed,
} from 'vue';
import Iconfont from '../../../iconfont/index.vue';
import IsRead from '@/components/IsRead/index.vue';
import { IVideoMsgInfo } from '@/types/msg';
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
  videoMsgInfo: {
    type: Object as PropType<IVideoMsgInfo>,
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  msgId: {
    type: Number,
  },
  playMsgId: {
    type: Number,
    required: true,
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

const emit = defineEmits(['menuClick', 'onPlay']);
const imgBox = ref(null);
let video: HTMLVideoElement | null = null;
const isPlay = ref(false);

const play = async () => {
  isPlay.value = true;
  if (!video) {
    video = document.createElement('video');
    video.setAttribute('src', props.videoMsgInfo!.url);
    video.setAttribute('controls', true);
    video.setAttribute('type', 'video/mov');
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

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.imgBg {
  // max-width: 40%;
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
.mImg {
  justify-content: flex-end;
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
  .isRead {
    text-align: right;
  }
}
</style>
