<template>
  <router-view />
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, watch } from 'vue';
import { Store, useStore } from 'vuex';
import { getOssInfo } from './api';
import { getToken as getUserToken } from './utils/utils';
import { initStore, key } from './store';
import { getStorage, setMsgList } from './utils/utils';
import {
  getRoam,
  initRongConnect,
  useClientSendMsgAckToServer,
  mergeData,
} from './hooks/window';
import { IMsgInfo } from './types/msg';
import * as RongIMLib from '@rongcloud/imlib-next';
import {
  installer as rtcInstaller,
  RCRTCClient,
  RCTrack,
} from '@rongcloud/plugin-rtc';
import {
  installer as callInstaller,
  RCCallSession,
  IEndSummary,
  ISenderInfo,
  RCCallEndReason,
  IMuteUser,
} from '@rongcloud/plugin-call';
import messageAudio from './assets/audio/message.wav';
import { MediaAudio } from './plugin/Audio';
import { GroupMediaAudio, hideGroupMediaAudio } from './plugin/GroupAudio';
import { Toast } from './plugin/Toast';
export async function initRonyun(store: Store<initStore>) {
  // IM 客户端初始化
  const RongCallLib = RongIMLib.init({
    appkey: 'tdrvipkst22v5',
  });
  // 监听消息 用来处理是否显示加入音视频按钮
  console.log(RongCallLib);

  // RTC 客户端初始化
  const rtcClient: RCRTCClient = RongIMLib.installPlugin(
    rtcInstaller,
    {},
  ) as RCRTCClient;
  const rongIm = RongIMLib.installPlugin(callInstaller, {
    // rtcClient 实例 （必填）
    rtcClient,
    /**
     * 被动收到邀请 （收到一个远端发起的新会话）, 会产生一个新的 session 对象 （必填）
     */
    async onSession(session: RCCallSession) {
      const uid = session.getTargetId();
      const mediaNode = document.getElementById('media')!;
      if (mediaNode.hasChildNodes()) {
        // 当前正在通话中
        session.registerSessionListener({
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
            console.log('接听者', 'onAccept');
          },

          /**
           * 当有远端用户挂断
           * @param sender 远端用户
           * @param reason 挂断的原因
           * @param session 当前的 session 对象
           */
          onHungup(sender: ISenderInfo, reason: RCCallEndReason) {
            console.log('接听者挂断', 'onHungup', reason);
          },

          /**
           * 本端资源或远端资源已获取，track为本地音频或音视频, track不可设置成 Vue 组件的响应式数据
           * @param track 本端资源或远端资源
           * @param session 当前的 session 对象
           */
          onTrackReady(track: RCTrack): void {
            // 远程的音频直接播放, 为了减少回音，可不播放本端音频
            console.log(track);
          },
          onMemberModify: function (sender: any): void {
            console.log('onMemberModify', sender);
          },
          onMediaModify: function (sender: any): void {
            console.log('onMediaModify', sender);
          },
          onAudioMuteChange: function (muteUser: IMuteUser): void {
            console.log('onAudioMuteChange', muteUser);
          },
          onVideoMuteChange: function (muteUser: IMuteUser): void {
            console.log(muteUser);
          },
        });
        return;
      }
      if (session.getConversationType() === 1) {
        let userDetail = '';
        if (store.state.msgList[Number(uid)]) {
          userDetail = store.state.msgList[Number(uid)].userDetailInfo.userInfo;
        } else {
          const data = await await store.dispatch('postMsg', {
            query: {
              uid,
            },
            cmd: 1011,
            encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
            auth: true,
          });
          userDetail = data.body.userDetailInfo.userInfo;
        }

        // 单聊
        MediaAudio({
          yUserInfo: userDetail,
          mediaType: session.getMediaType(),
          session,
        });
      } else {
        let groupDetailInfo = '';
        if (store.state.msgList[Number(uid)]) {
          groupDetailInfo = store.state.msgList[Number(uid)].groupDetailInfo;
        } else {
          const data = await await store.dispatch('postMsg', {
            query: {
              groupId: uid,
            },
            cmd: 1029,
            encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
            auth: true,
          });
          groupDetailInfo = data.body.groupDetailInfo;
        }
        // 群聊
        GroupMediaAudio({
          groupDetailInfo: groupDetailInfo,
          mediaType: session.getMediaType(),
          session,
        });
      }
    },

    /**
     *  以下三条只要满足一条，就会触发onSessionClose
     *  1、本端用户自己主动挂断
     *  2、服务端把本端用户踢出 RTC 房间
     *  3、房间里小于2个人
     *
     *  @param {RCCallSession} session 被结束的 session 对象
     *  @param summaryInfo 结束一个 session 的后汇总信息
     */
    onSessionClose(session: RCCallSession, summaryInfo?: IEndSummary) {
      hideGroupMediaAudio();
    },
  });

  // store.commit('SET_RONGIM', rongIm);
  // 如果以登录状态 则 连接融云
  if (getUserToken()) {
    initRongConnect(store, rongIm);
  }
}

export default defineComponent({
  name: 'App',
});
</script>
<script lang="ts" setup>
const store = useStore(key);
store.dispatch('init');

// 获取浏览器弹框权限
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

const init = async () => {
  // const url = 'wss://ws-test.yime.app';
  // const url = 'ws://16.163.55.202:8002';
  const url = 'wss://ws.yime.app';
  let ws = new WebSocket(url);
  store.commit('SET_ISONLINE', '连接中...');
  store.commit('SET_WS', ws);
  ws.binaryType = 'arraybuffer';

  ws.onclose = function () {
    console.log('close');
    store.commit('SET_ISONLINE', '网络状态不佳');
    reconnect();
  };
  ws.onerror = function () {
    store.commit('SET_ISONLINE', '网络状态不佳');
    console.log('error');
    // reconnect();
  };
  function reconnect() {
    setTimeout(function () {
      //没连接上会一直重连，设置延迟避免请求过多
      let ws = new WebSocket(url);
      store.commit('SET_ISONLINE', '连接中...');
      ws.binaryType = 'arraybuffer';
      store.commit('SET_WS', ws);
      ws.onclose = function () {
        console.log('close');
        store.commit('SET_ISONLINE', '网络状态不佳');
        reconnect();
      };
      ws.onerror = function () {
        store.commit('SET_ISONLINE', '网络状态不佳');
        console.log('error');
      };
    }, 1000);
  }

  try {
    // 获取阿里存储信息
    const config: any = await getOssInfo();
    store.commit('SET_CREDENTIALS', config.Credentials);
  } catch (error) {
    console.log(error);
  }

  // 初始化融云服务
  initRonyun(store);
  setTimeout(async () => {
    // 获取漫游数据并且合并
    const roamList = await getRoam(store);

    // 合并数据
    await mergeData([], store, roamList);
  }, 2000);
};

init();

// 设置语言
const langId = Number(getStorage('lang') || -1);
store.commit('SET_LANG', langId);

// 设置
store.commit('SET_ISONLINE', navigator.onLine ? '消息' : '网络状态不佳');
window.addEventListener('offline', () => {
  store.commit('SET_ISONLINE', '网络状态不佳');
});

window.addEventListener('online', () => {
  store.commit('SET_ISONLINE', '消息');
});

// aks
const clientSendMsgAckToServer = (msgInfos: IMsgInfo<string>[]) => {
  const lastMsgInfo =
    msgInfos[0].length > 0 ? msgInfos[msgInfos[0].length - 1] : null;
  if (lastMsgInfo) {
    const { msgId, fromId, toId } = lastMsgInfo;
    const ackToServer = useClientSendMsgAckToServer(
      store,
      lastMsgInfo.isGroupMsg ? 1 : 0,
    );
    ackToServer(msgId, fromId, toId, 0);
  }
};

const stop = watch(
  computed(() => store.state.msgInfo),
  async (data: any) => {
    // 加入音视频通话申请
    if (data.cmd === 2162) {
      console.log(data);
    }
    // GroupCallNotifyToClient
    if (data.cmd === 2156) {
      console.log(data, 2156);
    }
    if (data.cmd === 2024) {
      try {
        const notifyContent = JSON.parse(data.body.notifyContent);
        if (notifyContent.Jt) {
          const res = {
            msgClassHaveNewMsg: 1,
            msgClassId: 1,
            msgClassRecentMsgContent: data.body.notifyContent,
            msgClassTitle: '系统消息',
            updateTime: data.body.updateTime,
          };
          store.commit('ADD_NOTIFY', { id: 1, res });
        } else {
          const res = {
            msgClassHaveNewMsg: 1,
            msgClassId: 2,
            msgClassRecentMsgContent: data.body.notifyContent,
            msgClassTitle: '用户反馈消息',
            updateTime: data.body.updateTime,
          };
          store.commit('ADD_NOTIFY', { id: 2, res });
        }
      } catch (error) {
        console.log(error);
      }
    }
    // 监听接受消息
    if (data.cmd === 2004) {
      const msgInfos = data.body.msgInfos;
      const msgList = store.state.msgList;
      // 处理撤回消息
      if (msgInfos[0].msgContent.msgContent === 'revokeInfo') {
        const { revokeMsgId } = msgInfos[0].msgContent.revokeInfo;
        const revokeKey = msgList[msgInfos[0].toId].readList.findIndex(
          (e: any) => Number(e.msgId) === Number(revokeMsgId),
        );
        msgList[msgInfos[0].toId].readList.splice(revokeKey, 1);
        store.commit('SET_MSGLIST', msgList);
      }

      // 处理双向清空消息
      if (msgInfos[0].msgContent.msgContent === 'cleanInfo') {
        const { maxMsgId } = msgInfos[0].msgContent.cleanInfo;
        const newList = msgList[store.state.activeUid!].readList.filter(
          (e: any) => Number(e.msgId) > Number(maxMsgId),
        );
        msgList[store.state.activeUid!].readList = newList;
        store.commit('SET_MSGLIST', msgList);
      }
      console.log('推送消息', data);
      // 发送ack
      clientSendMsgAckToServer(msgInfos);
      store.dispatch('addMsgList', { ...(msgInfos[0] || {}) });
      // 处理消息通知
      msgNotice(msgInfos[0]);
      // 发送已读msgId
      const userInfo = store.state.userInfo;

      // 如果是群聊并且是系统消息则更新本地缓存群详情
      if (
        msgInfos[0].isGroupMsg &&
        msgInfos[0].msgContent.msgContent === 'systemNotifyInfo'
      ) {
        const item = msgInfos[0];
        // 群聊获取群详情
        const data = await store.dispatch('postMsg', {
          query: { groupId: item.toId },
          cmd: 1029,
          encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
          auth: true,
        });
        const groupDetailInfo = data.body.groupDetailInfo;
        const res = store.state.msgList[item.toId];
        res.groupDetailInfo = groupDetailInfo;

        store.commit('SET_MSGLISTITEM', {
          res: res,
          uid: item.toId,
        });
      }
      // 如果发送者是自己 或者 已经开启了对方不显示已读消息开关 不需要发送msgId
      if (
        Number(userInfo.uid) === Number(msgInfos[0].fromId) ||
        store.state.switchSettingInfo.readMessageState
      )
        return;

      if (msgInfos[0].isGroupMsg) {
        // 发送ack
        const res = {
          msgHasReadedInfo: {
            isGroupMsg: 1,
            fromId: msgInfos[0].toId,
            toId: msgInfos[0].fromId,
            msgIdMax: msgInfos[0].msgId,
          },
          deviceBrand: 'web',
        };
        await store.dispatch('postMsg', {
          query: res,
          cmd: 2149,
          encryption:
            'Aoelailiao.Message.UserUpdateConversationHasReadedMsgInfoReq',
          auth: true,
        });
      } else {
        const res = {
          msgHasReadedInfo: {
            isGroupMsg: 0,
            toId: msgInfos[0].toId,
            fromId: msgInfos[0].fromId,
            msgIdMax: msgInfos[0].msgId,
          },
          deviceBrand: 'web',
        };

        await store.dispatch('postMsg', {
          query: res,
          cmd: 2149,
          encryption:
            'Aoelailiao.Message.UserUpdateConversationHasReadedMsgInfoReq',
          auth: true,
        });
      }
    }
  },
);

const audio = new Audio();
audio.src = messageAudio;
function msgNotice(item: any) {
  // 如果发送者不是自己 则需要通知 并且没有开通消息免打扰
  const id = item.isGroupMsg ? item.toId : item.fromId;
  const res = store.state.msgList[id];
  let isMsgMute = !res ? false : true;
  if (res) {
    isMsgMute = Boolean(res?.userDetailInfo?.userInfo?.userAttachInfo?.msgMute);
  }
  if (Number(item.fromId) !== Number(store.state.userDetailInfo.userInfo.uid)) {
    if (store.state.switchSettingInfo.pokeSound && !isMsgMute) {
      // 声音
      audio.play();
    }

    if (store.state.switchSettingInfo.newMessage && !isMsgMute) {
      // 浏览器弹框
      if (Notification.permission === 'granted') {
        const res = new Notification('YIME', {
          body: '您收到一条消息',
          data: {
            id: item.isGroupMsg ? item.toId : item.fromId,
            isGroupMsg: Boolean(item.isGroupMsg),
          },
        });
        res.onclick = function (e: any) {
          store.commit('SET_ACTIVEUID', e.target.data.id);
          store.commit('SET_ACTIVEISGROUP', e.target.data.isGroupMsg);
          res.close();
        };
      }
    }
  }
}

onBeforeUnmount(() => {
  stop();
});
window.onunload = () => {
  setMsgList(store.state.msgList);
  stop();
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
