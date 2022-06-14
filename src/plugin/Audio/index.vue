<template>
  <div class="mideaBox">
    <div class="mideaMini" v-if="isMideaMini" @click="fullScroll">
      <div class="mideaContent">
        <img v-if="mediaType === 2" src="../../assets/img/video3.svg" alt="" />
        <img v-else src="../../assets/img/vioce3.svg" alt="" />
        <span>{{ info }}</span>
      </div>
    </div>
    <div v-else class="midea" id="mideaNode">
      <div id="videoBox">
        <div id="yVideo"></div>
      </div>
      <div class="miniSize">
        <Iconfont
          name="iconnarrow_icon"
          size="20"
          color="#fff"
          @click="fullScroll"
        />
      </div>
      <div class="call">
        <div class="img" v-if="!conversationIng || mediaType !== 2">
          <img
            v-if="yUserInfo?.icon"
            style="width: 75px; height: 75px; border-radius: 50%"
            :src="yUserInfo?.icon"
            alt=""
          />
          <Iconfont
            v-else
            style="display: inline-block"
            name="iconlianxiren"
            color="#A8B5BE"
            size="75"
          />
        </div>
        <div class="userName">{{ yUserInfo?.nickname }}</div>
        <div class="status">{{ info }}</div>
      </div>
      <div class="btn">
        <div
          class="item changeAudio"
          v-if="mediaType === 2 && conversationIng && !isAudio"
          @click="changeAudio"
        >
          <Iconfont name="iconbianzu" size="30" color="#fff" />
          <span>{{ t('切换到语音') }}</span>
        </div>
        <div
          class="item"
          v-if="mediaType === 2 && conversationIng && !isAudio"
          @click="toggleVideo"
        >
          <img
            v-if="isOpenVideo"
            src="../../assets/img/videoActive.svg"
            alt=""
          />
          <img v-else src="../../assets/img/video.svg" alt="" />
          <span>{{ t('摄像头') }}</span>
        </div>
        <div class="item" @click="toggleMute" v-if="conversationIng">
          <img v-if="isMute" src="../../assets/img/audioActive.svg" alt="" />
          <img v-else src="../../assets/img/audio.svg" alt="" />
          <span>{{ t('静音') }}</span>
        </div>
        <div class="item" @click="hungup(1)">
          <Iconfont name="iconvideo_icon1" size="44" />
          <span>{{ t('挂断') }}</span>
        </div>
        <div class="item" v-if="!isCall && !isAnswer" @click="accept">
          <Iconfont name="iconvideo_icon7" size="44" />
          <span>{{ t('接听') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const map = {
  1: '己方取消已发出的通话请求',
  2: '己方拒绝收到的通话请求',
  3: '己方挂断',
  4: '己方忙碌',
  5: '己方未接听',
  6: '己方不支持当前音视频引擎',
  7: '己方网络错误',
  8: '己方摄像头资源获取失败，可能是权限原因',
  9: '己方资源发布失败',
  10: '己方订阅资源失败',
  11: '对方取消发出的通话请求',
  12: '对方拒绝收到的通话请求',
  13: '通话过程中对方挂断',
  14: '对方忙碌',
  15: '对方未接听',
  16: '对方引擎不支持',
  17: '对方网络错误',
  18: '对方摄像头资源获取失败，可能是权限原因',
  19: '远端资源发布失败',
  20: '远端订阅资源失败',
  21: '己方其他端已加入新通话',
  22: '己方其他端已在通话中',
  23: '己方被禁止通话',
  24: '己端接听系统通话（移动端接听系统来电）',
  31: '远端其他端已加入新通话',
  32: '远端其他端已在通话中',
  33: '远端被禁止通话',
  34: '远端接听系统通话（移动端接听系统来电）',
  101: '其他端接听',
  102: '其他端挂断',
  103: '己方被对方加入黑名单',
  104: '音视频服务未开通',
};
import { initStore, key } from '@/store';
import { IUserInfo } from '@/types/user';
import {
  IMuteUser,
  ISenderInfo,
  RCCallEndReason,
  RCCallSession,
} from '@rongcloud/plugin-call';
import { RCTrack } from '@rongcloud/plugin-rtc';
import {
  defineProps,
  defineComponent,
  onMounted,
  ref,
  Ref,
  watch,
  nextTick,
  PropType,
  onUnmounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { Store, useStore } from 'vuex';
import Iconfont from '../../iconfont/index.vue';
import { Toast } from '../Toast';
import basicTones from '../../assets/audio/basic_tones.mp3';
export default defineComponent({
  name: 'Midea',
});

const init = async (
  store: Store<initStore>,
  mediaType: number,
  sessionRoot: Ref<RCCallSession>,
  info: Ref<string>,
  startTimeOut: () => void,
  conversationIng: Ref<boolean>,
  isAudio: Ref<boolean>,
  hungup: () => void,
  videoCallActionUploadReq: (num: number) => void,
  t: { (key: string | number): string },
  pause: () => void
) => {
  // 发送者
  const { session } = await (store.state.rongIm as any).call({
    targetId: (store.state.activeUid || 0).toString(),
    mediaType,
    listener: {
      /**
       * 当远端用户已开始响铃，表示对方已收到呼叫请求 （必填）
       * @param sender 已响铃的用户
       * @param session 当前的 session 对象
       */
      onRinging(sender: ISenderInfo, session: RCCallSession) {
        const { userId } = sender;
        // 对方响铃
        info.value = t('等待对方接听');
        console.log('发起者', 'onRinging');
        videoCallActionUploadReq(1);
      },

      /**
       * 当远端用户同意接听 （必填）
       * @param sender 远端用户
       * @param session 当前的 session 对象
       */
      onAccept(sender: ISenderInfo, session: RCCallSession) {
        const { userId } = sender;
        // 对方接听
        // 开始倒计时
        startTimeOut();
        pause();
        conversationIng.value = true;
        console.log('发起者', 'onAccept');
      },

      /**
       * 当有远端用户挂断 （必填）
       * @param sender 远端用户
       * @param reason 挂断的原因
       * @param session 当前的 session 对象
       */
      onHungup(
        sender: ISenderInfo,
        reason: RCCallEndReason,
        session: RCCallSession
      ) {
        const { userId } = sender;
        // 对方挂断
        console.log('发起者', 'onHungup', map[reason]);
        hungup();
        if (conversationIng.value) {
          videoCallActionUploadReq(8);
        } else {
          videoCallActionUploadReq(5);
        }
        if (reason === 14) return Toast(map[reason]);
      },

      onAudioMuteChange: (muteUser: IMuteUser, session: RCCallSession) => {
        // isMute.value = muteUser.muted;
      },

      /**
       * 本端资源或远端资源已获取，track为本地音频或音视频, track不可设置成 Vue 组件的响应式数据 （必填）
       * @param track 本端资源或远端资源
       * @param session 当前的 session 对象
       */
      onTrackReady(track: RCTrack) {
        // 远程的音频直接播放, 为了减少回音，可不播放本端音频
        if (track.isAudioTrack() && !track.isLocalTrack()) {
          track.play();
        }

        // 视频在对应的容器里播放
        if (track.isVideoTrack()) {
          const video = document.createElement('video');
          if (document.getElementById('yVideo1')) {
            const videoBox = document.getElementById(
              'videoBox'
            ) as HTMLVideoElement;
            video.setAttribute('id', 'videoBox1');
            videoBox.append(video);
          } else {
            const videoBox = document.getElementById(
              'yVideo'
            ) as HTMLVideoElement;
            video.setAttribute('id', 'yVideo1');
            videoBox.append(video);
          }
          track.play(video);
        }
      },
      onMediaModify: function (): void {
        isAudio.value = true;
      },
      onVideoMuteChange: function (muteUser: IMuteUser): void {
        if (muteUser.muted) {
          const videoBox = document.getElementById('videoBox');
          const videoBox1 = document.getElementById('videoBox1');
          videoBox?.removeChild(videoBox1!);
        }
      },
    },
  });
  sessionRoot.value = session;
};
</script>
<script lang="ts" setup>
const audio = new Audio();
audio.src = basicTones;
audio.loop = true;
audio.play();
const props = defineProps({
  destroy: {
    type: Function,
  },
  isCall: {
    type: Boolean,
    detalut: false,
  },
  mediaType: {
    type: Number,
    detalut: 1,
  },
  yUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  session: {
    type: Object as PropType<RCCallSession>,
  },
});

const { t } = useI18n();
const store = useStore(key);
//  是否通话中
const conversationIng = ref(false);
const sessionRoot = ref({}) as Ref<RCCallSession>;

const info = ref(!props.isCall ? t('邀请你通话') : t('连接中…'));
let time = 0;
const isAnswer = ref(false);
const isAudio = ref(false);
const isMideaMini = ref(false);
// 是否是静音
const isMute = ref(false);
// 是否关闭视频
const isOpenVideo = ref(false);

const startTimeOut = () => {
  time++;
  const m = time > 60 ? parseInt((time / 60).toString()) : 0;
  const s = time - m * 60;

  info.value =
    m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
  setTimeout(() => {
    startTimeOut();
  }, 1000);
};

onMounted(async () => {
  if (props.isCall) {
    // 呼叫方
    init(
      store,
      props.mediaType!,
      sessionRoot,
      info,
      startTimeOut,
      conversationIng,
      isAudio,
      hungup,
      videoCallActionUploadReq,
      t,
      pause
    );
  } else {
    // 接听方
    sessionRoot.value = props.session!;
    /**
     * **收到新的 session 后需要立即注册事件监听**
     * 呼叫者的操作会触发下边时间
     */
    sessionRoot.value.registerSessionListener({
      /**
       * 当远端用户已开始响铃，表示对方已收到呼叫请求
       * @param sender 已响铃的用户
       * @param session 当前的 session 对象
       */
      onRinging(sender: ISenderInfo) {
        const { userId } = sender;
        console.log('接听者', 'onRinging');
      },

      /**
       * 当远端用户同意接听
       * @param sender 远端用户
       * @param session 当前的 session 对象
       */
      onAccept(sender: ISenderInfo) {
        const { userId } = sender;
        startTimeOut();
        conversationIng.value = true;
        pause();
        console.log('接听者', 'onAccept');
      },

      /**
       * 当有远端用户挂断
       * @param sender 远端用户
       * @param reason 挂断的原因
       * @param session 当前的 session 对象
       */
      onHungup(sender: ISenderInfo, reason: RCCallEndReason) {
        console.log('接听者', 'onHungup', map[reason]);
        hungup(2);
      },

      /**
       * 本端资源或远端资源已获取，track为本地音频或音视频, track不可设置成 Vue 组件的响应式数据
       * @param track 本端资源或远端资源
       * @param session 当前的 session 对象
       */
      onTrackReady(track: RCTrack): void {
        // 远程的音频直接播放, 为了减少回音，可不播放本端音频
        if (track.isAudioTrack() && !track.isLocalTrack()) {
          track.play();
        }

        // 视频在对应的容器里播放
        if (track.isVideoTrack()) {
          const video = document.createElement('video');
          if (document.getElementById('yVideo1')) {
            const videoBox = document.getElementById(
              'videoBox'
            ) as HTMLVideoElement;
            video.setAttribute('id', 'videoBox1');
            videoBox.append(video);
          } else {
            const videoBox = document.getElementById(
              'yVideo'
            ) as HTMLVideoElement;
            video.setAttribute('id', 'yVideo1');
            videoBox.append(video);
          }
          track.play(video);
        }
      },
      onMemberModify: function (sender: any): void {
        console.log('onMemberModify', sender);
      },
      onMediaModify: function (sender: any): void {
        console.log('onMediaModify', sender);
        isAudio.value = true;
      },
      onAudioMuteChange: function (muteUser: IMuteUser): void {
        console.log('onAudioMuteChange', muteUser);
      },
      onVideoMuteChange: function (muteUser: IMuteUser): void {
        if (muteUser.muted) {
          const videoBox = document.getElementById('videoBox');
          const videoBox1 = document.getElementById('videoBox1');
          videoBox?.removeChild(videoBox1!);
        }
      },
    });
  }
  draggableFun();
});

watch(isMideaMini, (res) => {
  console.log(res);
  if (!res) {
    nextTick(() => {
      draggableFun();
    });
  }
});

// 切换静音
const toggleMute = () => {
  if (Object.keys(sessionRoot.value).length) {
    if (!isMute.value) {
      sessionRoot.value.disableAudioTrack();
    } else {
      sessionRoot.value.enableAudioTrack();
    }
    isMute.value = !isMute.value;
  }
};

// 切换是否显示视频
const toggleVideo = () => {
  if (Object.keys(sessionRoot.value).length) {
    if (!isOpenVideo.value) {
      sessionRoot.value.disableVideoTrack();
      const yVideo = document.getElementById('yVideo');
      const yVideo1 = document.getElementById('yVideo1');
      yVideo?.removeChild(yVideo1!);
    } else {
      sessionRoot.value.enableVideoTrack();
    }
    isOpenVideo.value = !isOpenVideo.value;
  }
};

//缩放
const fullScroll = () => {
  isMideaMini.value = !isMideaMini.value;
};

// 接听
const accept = () => {
  pause();
  sessionRoot.value.accept();
  isAnswer.value = true;
  conversationIng.value = true;
  startTimeOut();
  videoCallActionUploadReq(4);
};

// 挂断
const hungup = async (num?: number) => {
  close();
  pause();
  sessionRoot.value.hungup();
  if (props.isCall && !conversationIng.value && num === 1) {
    videoCallActionUploadReq(21);
  } else if (num === 2) {
    // 接听之后挂断
    videoCallActionUploadReq(8);
  }
};

const videoCallActionUploadReq = async (actionType: number) => {
  const query = {
    actionType: actionType,
    videoType: props.mediaType,
    talkUid: props.yUserInfo?.uid,
  };

  const data = await store.dispatch('postMsg', {
    query,
    cmd: 2009,
    encryption: 'Aoelailiao.Message.VideoCallActionUploadReq',
    auth: true,
  });
};
// 关闭弹框
const close = () => {
  props.destroy && props.destroy();
};

// 转为语音
const changeAudio = () => {
  sessionRoot.value.descendAbility();
  isAudio.value = true;
};

// 鼠标拖拽事件
const draggableFun = () => {
  let div = document.getElementById('mideaNode');
  let dragFlag = false;
  let x, y;

  div.onmousedown = function (e) {
    dragFlag = true;
    e = e || window.event;
    // 获取鼠标在元素上的位置（鼠标按下时在元素上得位置）
    x = e.clientX - div.offsetLeft;
    y = e.clientY - div.offsetTop;
  };

  div.onmousemove = function (e) {
    if (dragFlag) {
      e = e || window.event;
      div.style.left = e.clientX - x + 'px';
      div.style.top = e.clientY - y + 'px';
    }
  };
  // 鼠标抬起事件
  div.onmouseup = function (e) {
    dragFlag = false;
  };
};

onUnmounted(() => {
  pause();
});

const pause = () => {
  audio.pause();
};
</script>

<style>
#videoBox video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
<style lang="scss" scoped>
@import '@/style/base.scss';
.midea {
  width: 548px;
  height: 426px;
  background: linear-gradient(134deg, #98783e 0%, #996437 100%);
  box-shadow: 0px 0px 60px 0px rgba(0, 0, 0, 0.19);
  border-radius: 15px;
  margin: 0 auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  cursor: grab;
  #videoBox {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    #yVideo {
      width: 122px;
      height: 70px;
      position: absolute;
      right: 10px;
      bottom: 100px;
    }
  }
  .miniSize {
    position: absolute;
    left: 30px;
    top: 25px;
    z-index: 99;
  }
  .call {
    text-align: center;
    margin-top: 50px;
    position: relative;
    z-index: 99;
    .userName {
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 33px;
      margin: 10px 0 5px;
    }
    .status {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
    }
  }
  .btn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    // width: 200px;
    flex-wrap: wrap;
    z-index: 99;
    justify-content: center;
    .item {
      display: flex;
      width: 70px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 25px;
      cursor: pointer;
      img {
        width: 44px;
        height: 44px;
      }
      span {
        font-size: 12px;
        color: #e0d1c3;
        margin-top: 10px;
      }
      &.changeAudio {
        position: absolute;
        bottom: 100%;
        right: 0;
      }
    }
  }
}
.mideaMini {
  width: 81px;
  height: 82px;
  background: #f7f7f7;
  border-radius: 14px 0px 0px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: fixed;
  right: 8px;
  top: 35%;
  .mideaContent {
    width: 61px;
    height: 61px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      margin: 12px auto 6px auto;
    }
    span {
      font-size: 12px;
      font-family: Helvetica;
      color: #0085ff;
      line-height: 17px;
    }
  }
}
</style>
