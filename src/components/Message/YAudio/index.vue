<template>
  <div class="mmsg">
    <div @click="$emit('click')" class="img">
      <img v-if="userInfo?.icon" :src="userInfo?.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <div>
      <div class="title" v-if="isGroup">{{ userInfo?.nickname }}</div>
      <ImBg v-bind="$attrs">
        <div class="imBgBox">
          <span class="time">{{ voiceMsg.voiceTime }} ''</span>
          <ShowAudio :time="time" type="you" v-if="isPlay" />
          <div class="audio" v-else></div>
          <div class="icon">
            <Iconfont
              v-if="!isPlay"
              @click="play"
              name="iconplay1"
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
        </div>
        <Fire :isBurn="isBurn" :fired="fired" :right="`-20px`" :top="`-40px`" />
      </ImBg>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, defineEmits } from 'vue';
import ImBg from '../ImgBg/index.vue';
import Fire from '../Fire/index.vue';
import Iconfont from '@/iconfont/index.vue';
import { watch, computed, onDeactivated } from '@vue/runtime-core';
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import BenzAMRRecorder from 'benz-amr-recorder';
import { useI18n } from 'vue-i18n';
import ShowAudio from '../ShowAudio/index.vue';
import { key } from '@/store';
export default defineComponent({
  name: 'YAudio',
});
</script>
<script lang="ts" setup>
defineEmits(['click', 'call']);
const props = defineProps({
  userInfo: {
    type: Object,
  },
  voiceMsg: {
    type: Object,
    required: true,
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
  msgId: {
    type: Number,
  },
});
const { t } = useI18n();
const isPlay = ref(false);
const store = useStore(key);
const time = ref(0);

const amr = new BenzAMRRecorder();
const amrCtx = amr.initWithUrl(props.voiceMsg.voiceUrl);
amr.onEnded(() => {
  isPlay.value = false;
  store.dispatch('postMsg', {
    query: { msgId: props.msgId },
    cmd: 2157,
    encryption: 'Aoelailiao.Message.FireReadFireMessageToServserReq',
    auth: true,
  });
});

const isGroup = computed(() => store.state.activeIsGroup);

const play = () => {
  amrCtx.then(() => {
    time.value = amr.getDuration();
    if (!amr.isPlaying()) {
      amr && amr.play();
    }
  });

  isPlay.value = true;
  //非常简单的就能拿到blob音频url
  store.commit('SET_PLAYAUDIO', props.voiceMsg.voiceUrl);
};

watch(
  computed(() => store.state.playAudio),
  (e) => {
    if (e !== props.voiceMsg.voiceUrl) {
      isPlay.value = false;
      amr && amr.stop();
    }
  }
);

onDeactivated(() => {
  amr && amr.stop();
});

const pause = () => {
  amrCtx.then(() => {
    if (amr.isPlaying()) {
      amr && amr.stop();
    }
  });
  isPlay.value = false;
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.audio {
  width: 20px;
}
.mmsg {
  display: flex;
  .imBgBox {
    display: flex;
    .time {
      font-size: 16px;
      margin-right: 5px;
    }
  }
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    margin-left: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img {
    margin-right: 10px;
  }
  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
  }
  .title {
    font-size: 12px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    margin-bottom: 5px;
  }
}
</style>
