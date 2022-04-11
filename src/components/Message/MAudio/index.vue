<template>
  <div class="mmsg">
    <ImBg v-bind="$attrs" isMe>
      <div class="imBgBox">
        <div class="icon">
          <Iconfont
            @click="play"
            name="iconplay1"
            v-if="!isPlay"
            size="10"
            color="#0085FF"
          />
          <Iconfont
            @click="pause"
            v-else
            name="iconsuspend"
            size="10"
            color="#0085FF"
          />
        </div>
        <ShowAudio type="me" :time="time" v-if="isPlay" />
        <div class="audio" v-else></div>
        <span class="time">{{ voiceMsg.voiceTime }} ''</span>
      </div>
      <Fire :isBurn="isBurn" :fired="fired" :left="`-20px`" :top="`-40px`" />
    </ImBg>
    <IsRead :isRead="isRead" />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps } from 'vue';
import ImBg from '../ImgBg/index.vue';
import Fire from '../Fire/index.vue';
import Iconfont from '@/iconfont/index.vue';
import IsRead from '@/components/IsRead/index.vue';
import { ref, onDeactivated } from 'vue';
import { useStore } from 'vuex';
import { watch, computed } from '@vue/runtime-core';
import BenzAMRRecorder from 'benz-amr-recorder';
import ShowAudio from '../ShowAudio/index.vue';
import { key } from '@/store';
export default defineComponent({
  name: 'MAudio',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  voiceMsg: {
    type: Object,
    required: true,
  },
  audio: {
    type: Object,
  },
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
});
const isPlay = ref(false);
const store = useStore(key);
// let audio = null;
const time = ref(0);

const amr = new BenzAMRRecorder();
const amrCtx = amr.initWithUrl(props.voiceMsg.voiceUrl);
amr.onEnded(() => {
  isPlay.value = false;
});

const play = () => {
  amrCtx.then(() => {
    time.value = amr.getDuration();
    if (!amr.isPlaying()) {
      amr && amr.play();
    }
  });
  isPlay.value = true;
  store.commit('SET_PLAYAUDIO', props.voiceMsg.voiceUrl);
};

const pause = () => {
  amrCtx.then(() => {
    if (amr.isPlaying()) {
      amr && amr.stop();
    }
  });
  isPlay.value = false;
};

watch(
  computed(() => store.state.playAudio),
  (e) => {
    if (e !== props.voiceMsg.voiceUrl) {
      isPlay.value = false;
      amr && amr.stop();
    }
  },
);

onDeactivated(() => {
  amr && amr.stop();
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.audio {
  width: 20px;
}
.mmsg {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .imBgBox {
    display: flex;
    width: 100%;
    .time {
      font-size: 16px;
      margin-left: 5px;
    }
  }
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    margin-left: 10px;
  }
  .imBg {
    text-align: left;
  }
}
</style>
