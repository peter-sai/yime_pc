<template>
  <div>
    <router-view />
    <Teleport to="body" v-if="authInfo.isShow">
      <div class="verificationBox">
        <div class="verification">
          <i @click="authInfo.isShow = !authInfo.isShow" class="close"></i>
          <div class="title">{{t('安全验证')}}</div>
          <div class="content">
            <div class="time">{{ moment(authInfo.time).format('YYYY-MM-DD HH:mm') }}</div>
            <div class="info">
              {{t('您的账号在<spile>上发起登录申请，是否确认登录？'.replace('<spile>',authInfo.deviceBrand))}}
            </div>
            <div class="subInfo">{{t('如非本人操作，请尽快更改密码')}}</div>
          </div>
          <div class="btn">
            <div @click="auth(0)">{{t('确认登录')}}</div>
            <div @click="auth(1)">{{t('撤销操作')}}</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  reactive,
  watch,
} from 'vue';
import { Store, useStore } from 'vuex';
import { getToken as getUserToken, isMacOs } from './utils/utils';
import { initStore, key } from './store';
import { getStorage, setMsgList } from './utils/utils';
import {
  getRoam,
  initRongConnect,
  useClientSendMsgAckToServer,
  mergeData,
  upDateStore,
} from './hooks/window';
import { IMsgInfo, ImsgItem, INotifyClassMsgListInfo } from './types/msg';
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
import { initOss } from './hooks/window';
import { useI18n } from 'vue-i18n';
import { hideLoading } from './plugin/Loading';
import { yimechat } from './api';
import config from './config';
import returnCitySN from 'returnCitySN';
import { Toast } from './plugin/Toast';

export async function initRonyun(store: Store<initStore>) {
  // IM 客户端初始化
  const RongCallLib = RongIMLib.init({
    appkey: 'tdrvipkst22v5',
  });
  // 监听消息 用来处理是否显示加入音视频按钮

  // RTC 客户端初始化
  const rtcClient: RCRTCClient = RongIMLib.installPlugin(
    rtcInstaller,
    {}
  ) as RCRTCClient;
  // 正在通话中的uid
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

      store.commit('SET_CALLUID', session.getTargetId());

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
      if (store.state.callUid === session.getTargetId()) {
        hideGroupMediaAudio();
        // 设置当前不在通话中 用于是否显示加入按钮
        store.commit('SET_CONVERSATIONING', false);
      }
    },
  });
  // 如果以登录状态 则 连接融云
  if (getUserToken()) {
    try {
      await initRongConnect(store, rongIm);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default defineComponent({
  name: 'App',
});

export function reconnect(store: Store<initStore>) {
  if (store.state.ws) return;
  setTimeout(function () {
    //没连接上会一直重连，设置延迟避免请求过多
    let ws = new WebSocket(config.VUE_APP_BASEURL!);
    // store.commit('SET_ISONLINE', '连接中...');
    ws.binaryType = 'arraybuffer';
    store.commit('SET_WS', ws);
    ws.onclose = function (e) {
      store.commit('SET_WS', null);
      console.log('onclose', e);
      // store.commit('SET_ISONLINE', '网络状态不佳');
      hideLoading();
      reconnect(store);
    };
    ws.onerror = function () {
      store.commit('SET_WS', null);
      // store.commit('SET_ISONLINE', '网络状态不佳');
      console.log('onerror');
    };
  }, 1000);
}
</script>
<script lang="ts" setup>
import Electron from 'Electron';
import moment from 'moment'
const store = useStore(key);
store.dispatch('init');
Electron.ipcRenderer.on('sendUuid', (event, params) => {
  window.uuid = params.uuid
})
Electron.ipcRenderer.send('getUUid');
Electron.ipcRenderer.on('awaken', (event, params) => {
  if (params.awakenArgs.indexOf('gid') !== -1) {
    const url = params.awakenArgs.split('=');
    if (url[1]) {
      store.commit('SET_ACTIVEUID', url[1]);
      store.commit('SET_ACTIVEISGROUP', true);
    }
  }
  if (params.awakenArgs.indexOf('uid') !== -1) {
    const url = params.awakenArgs.split('=');
    if (url[1]) {
      store.commit('SET_ACTIVEUID', url[1]);
      store.commit('SET_ACTIVEISGROUP', false);
    }
  }
});
const { t } = useI18n();
window.deviceBrand = navigator.userAgent.toLocaleLowerCase().includes('mac') ? 'mac' : 'window'

store.commit('set_T', t);

// 获取浏览器弹框权限
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

const init = async () => {
  let ws = new WebSocket(config.VUE_APP_BASEURL!);
  // store.commit('SET_ISONLINE', '连接中...');
  store.commit('SET_WS', ws);
  ws.binaryType = 'arraybuffer';

  ws.onclose = function (e) {
    store.commit('SET_WS', null);
    console.log('onclose', e);
    store.commit('SET_ISONLINE', '网络状态不佳');
    hideLoading();
    reconnect(store);
  };
  ws.onerror = function () {
    store.commit('SET_WS', null);
    store.commit('SET_ISONLINE', '网络状态不佳');
    console.log('onerror');
  };

  // 获取config
  const data = await yimechat();
  store.commit('SET_CONFIG', data);

  // 获取阿里存储信息
  initOss(store);

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

// 设置
if (!navigator.onLine) {
  window.document.title = '⚠️' + t('当前网络不可用，请检查网络设置');
}
store.commit('SET_ISONLINE', navigator.onLine ? false : '网络状态不佳');
window.addEventListener('offline', () => {
  store.commit('SET_ISONLINE', '网络状态不佳');
  window.document.title = '⚠️' + t('当前网络不可用，请检查网络设置');
});

window.addEventListener('online', () => {
  window.document.title = 'YIME';
  store.commit('SET_ISONLINE', false);
});

// aks
const clientSendMsgAckToServer = (msgInfos: IMsgInfo<string>[]) => {
  const lastMsgInfo =
    msgInfos[0].length > 0 ? msgInfos[msgInfos[0].length - 1] : null;
  if (lastMsgInfo) {
    const { msgId, fromId, toId } = lastMsgInfo;
    const ackToServer = useClientSendMsgAckToServer(
      store,
      lastMsgInfo.isGroupMsg ? 1 : 0
    );
    ackToServer(msgId, fromId, toId, 0);
  }
};

const authInfo = reactive({
  deviceBrand: '',
  isShow: false,
  time: 0,
});

// 验证登录 (是否允许其他端登录)
const auth = async (state: 0 | 1) => {
  const res = await store.dispatch('postMsg', {
    query: {
      state,
      equipmentInformation: {
        deviceBrand: window.deviceBrand,
        releaseVersion: '2.0.0',
        devicePublicIp: returnCitySN.cip || '',
        deviceUuid: window.uuid,
      }
    },
    cmd: 2185,
    encryption: 'Aoelailiao.Login.FeedbackLoginApproveReq',
    auth: true,
  });
  authInfo.isShow = false
  if (res.body.resultCode === 0 && state ===1) {
    return Toast(t('登录已撤销，为了账号安全，请尽快修改密码'));
  } 
  return Toast(t(res.body.resultString));
};
const stop = watch(
  computed(() => store.state.msgInfo),
  async (data: any) => {
    if (data.cmd === 2184) {
      // 验证其他端登录
      if (data.body.canceled) {
        authInfo.isShow = false
      } else {
        authInfo.deviceBrand = data.body.equipmentInformation.deviceBrand;
        authInfo.isShow = true;
        authInfo.time = data.body.askTime
      }
    }
    if (data.cmd == 2170) {
      if (!data.body.isGroupMsg && data.body.objectId) {
        const res = {
          uid: data.body.objectId,
        };
        const data1 = await store.dispatch('postMsg', {
          query: res,
          cmd: 1011,
          encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
          auth: true,
        });
        // 更新焚毁时间
        upDateStore(
          store,
          'destoryReaded',
          Number(
            data1?.body?.userDetailInfo?.userInfo?.userAttachInfo?.destoryReaded
          ),
          data.body.objectId,
          true
        );
      }
    }
    if (data.cmd === 2024) {
      try {
        // const notifyContent = JSON.parse(data.body.notifyContent);
        // if (notifyContent.Jt) {
        if (data.body.notifyContent) {
          const unReadNum = store.state.msgList[1]?.unReadNum || 0;
          const res = {
            msgClassHaveNewMsg: 1,
            msgClassId: 1,
            msgClassRecentMsgContent: data.body.notifyContent,
            msgClassTitle: '系统消息',
            updateTime: data.body.updateTime,
            unReadNum: (unReadNum as number) + 1,
          };
          store.commit('ADD_NOTIFY', { id: 1, res });
        } else {
          const unReadNum = store.state.msgList[2]?.unReadNum || 0;
          const res = {
            msgClassHaveNewMsg: 1,
            msgClassId: 2,
            msgClassRecentMsgContent: data.body.notifyContent,
            msgClassTitle: '用户反馈消息',
            updateTime: data.body.updateTime,
            unReadNum: (unReadNum as number) + 1,
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
        let readList =
          msgList[msgInfos[0].toId]?.readList ||
          msgList[msgInfos[0].fromId]?.readList ||
          [];
        const revokeKey = readList.findIndex(
          (e: any) => Number(e.msgId) === Number(revokeMsgId)
        );
        readList.splice(revokeKey, 1);
        store.commit('SET_MSGLIST', msgList);
      }

      // 处理焚毁消息
      if (msgInfos[0].msgContent.msgContent === 'fireInfo') {
        const { fireMsgId } = msgInfos[0].msgContent.fireInfo;
        let readList =
          msgList[msgInfos[0].toId]?.readList ||
          msgList[msgInfos[0].fromId]?.readList ||
          [];
        const fireKey = readList.findIndex(
          (e: any) => Number(e.msgId) === Number(fireMsgId)
        );
        if (readList[fireKey]) {
          readList[fireKey].fired = true;
        }
        store.commit('SET_MSGLIST', msgList);
      }

      // 处理双向清空消息
      if (msgInfos[0].msgContent.msgContent === 'cleanInfo') {
        const { maxMsgId } = msgInfos[0].msgContent.cleanInfo;
        const { toId, fromId } = msgInfos[0];
        let uid = toId;
        if (toId === store.state.userInfo.uid) {
          uid = fromId;
        }

        const newList = (msgList[uid!]?.readList || []).filter(
          (e: any) => Number(e.msgId) > Number(maxMsgId)
        );

        msgList[uid!].readList = newList;
        store.commit('SET_MSGLIST', msgList);
        setMsgList(msgList);
      }
      console.log('推送消息', data);
      // 发送ack
      clientSendMsgAckToServer(msgInfos);
      store.dispatch('addMsgList', { ...(msgInfos[0] || {}) });
      // 处理消息通知
      msgNotice(msgInfos[0]);

      // 如果是群聊并且是系统消息则更新本地缓存群详情
      if (
        msgInfos[0].isGroupMsg &&
        msgInfos[0].msgContent.msgContent === 'systemNotifyInfo'
      ) {
        const item = msgInfos[0];
        const res = store.state.msgList[item.toId];
        if (!res) return;
        // 群聊获取群详情
        const data = await store.dispatch('postMsg', {
          query: { groupId: item.toId },
          cmd: 1029,
          encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
          auth: true,
        });
        const groupDetailInfo = data.body.groupDetailInfo;
        res.groupDetailInfo = groupDetailInfo;
        if (store.state.groupInfos && store.state.groupInfos.length) {
          const groupItemIndex = (store.state.groupInfos || []).findIndex(
            (e) => e.groupId === groupDetailInfo.groupId
          );
          if (groupItemIndex === -1) {
            store.state.groupInfos[store.state.groupInfos.length] =
              data.body.groupDetailInfo;
          } else {
            store.state.groupInfos[groupItemIndex] = data.body.groupDetailInfo;
          }
        }

        store.commit('SET_MSGLISTITEM', {
          res: res,
          uid: item.toId,
        });
      }

      // 发送已读msgId
      const userInfo = store.state.userInfo;
      // 如果发送者是自己 或者 已经开启了对方不显示已读消息开关 不需要发送msgId
      if (
        Number(userInfo.uid) === Number(msgInfos[0].fromId) ||
        store.state.switchSettingInfo.readMessageState
      )
        return;

      if (msgInfos[0].isGroupMsg) {
        if (msgInfos[0].toId !== store.state.activeUid) return;
        // 上传已读最大消息msgid
        const res = {
          msgHasReadedInfo: {
            isGroupMsg: 1,
            fromId: msgInfos[0].toId,
            toId: msgInfos[0].fromId,
            msgIdMax: msgInfos[0].msgId,
          },
          deviceBrand: window.deviceBrand,
        };
        await store.dispatch('postMsg', {
          query: res,
          cmd: 2149,
          encryption:
            'Aoelailiao.Message.UserUpdateConversationHasReadedMsgInfoReq',
          auth: true,
        });
      } else {
        if (msgInfos[0].fromId !== store.state.activeUid) return;
        const res = {
          msgHasReadedInfo: {
            isGroupMsg: 0,
            toId: msgInfos[0].toId,
            fromId: msgInfos[0].fromId,
            msgIdMax: msgInfos[0].msgId,
          },
          deviceBrand: window.deviceBrand,
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
  }
);

const audio = new Audio();
audio.src = messageAudio;
function msgNotice(item: any) {
  const info = store.state.msgList[item.isGroupMsg ? item.toId : item.fromId];

  let name = '';
  if (info?.isGroup) {
    //
    name = info?.groupDetailInfo?.groupName;
  } else {
    name = info?.userDetailInfo?.userInfo?.nickname;
  }

  // 如果发送者不是自己 则需要通知 并且没有开通消息免打扰
  const id = item.isGroupMsg ? item.toId : item.fromId;
  const res = store.state.msgList[id];
  let isMsgMute = !res ? false : true;
  let groupMsgAtNotify = false;
  if (res) {
    if (item.isGroupMsg) {
      const groupAttachInfo = res?.groupDetailInfo?.groupAttachInfo || {};
      // 群聊
      isMsgMute = Boolean(groupAttachInfo?.groupMsgMute);
      // 是否是at自己的消息 如果是 并且 开启at提醒通知的开关 则 通知
      if (item.msgContent.msgContent === 'groupAtInfo') {
        const groupAtInfo = item?.msgContent?.groupAtInfo?.atUsers?.find(
          (e: any) =>
            Number(e.uid) === Number(store.state.userInfo.uid) || e.type === 1
        );
        if (Boolean(groupAttachInfo?.groupMsgAtNotify) && groupAtInfo) {
          //
          groupMsgAtNotify = true;
        }
      }
    } else {
      // 单聊
      isMsgMute = Boolean(
        res?.userDetailInfo?.userInfo?.userAttachInfo?.msgMute
      );
    }
  }

  if (Number(item.fromId) !== Number(store.state.userDetailInfo.userInfo.uid)) {
    if (
      (store.state.switchSettingInfo.pokeSound && !isMsgMute) ||
      groupMsgAtNotify
    ) {
      // 声音
      audio.play();
    }

    if (
      (store.state.switchSettingInfo.newMessage && !isMsgMute) ||
      groupMsgAtNotify
    ) {
      // 浏览器弹框
      if (Notification.permission === 'granted') {
        const res = new Notification(name || 'YIME', {
          body: t('您收到一条消息'),
          data: {
            id: item.isGroupMsg ? item.toId : item.fromId,
            isGroupMsg: Boolean(item.isGroupMsg),
          },
        });
        res.onclick = function (e: any) {
          try {
            store.commit('SET_ACTIVEUID', e.target.data.id);
            store.commit('SET_ACTIVEISGROUP', e.target.data.isGroupMsg);
            const item = store.state.msgList[e.target.data.id];
            if (item) {
              item.unReadNum = 0;
              item.unRead = false;
              store.commit('SET_MSGLISTITEM', { res: item });
            }
            Electron.ipcRenderer.send('appActive', true);
            res.close();
          } catch (error) {
            console.log(error);
          }
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

// 更新未读消息到应用图标
type TMsgItem = INotifyClassMsgListInfo & ImsgItem;
const unReadNum = computed(() => {
  const msgList: TMsgItem[] = Object.values(store.state.msgList) as TMsgItem[];
  const groupMsgList = msgList.filter((e) => e.unReadNum && e.isGroup);
  const userMsgList = msgList.filter((e) => e.unReadNum && !e.isGroup);
  const num = groupMsgList
    .concat(userMsgList)
    .reduce(function (preValue: any, curValue: any) {
      return preValue + curValue.unReadNum;
    }, 0);
  if (isMacOs()) {
    Electron.ipcRenderer.send('sendMessage', !num ? '' : num?.toString());
  } else {
    Electron.ipcRenderer.sendSync(
      'update-badge',
      (num && num.toString()) || null
    );
  }

  return num;
});

watch(unReadNum, (e) => {
  //
});

Electron.ipcRenderer.on('close', () => {
  setMsgList(store.state.msgList);
  console.log(11);
});
</script>
<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.verificationBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background: #000000;
  opacity: 0.76;
  .verification {
    width: 310px;
    height: 256px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    right: 50%;
    top: 50%;
    bottom: 50%;
    transform: translate(-50%, -50%);
    .close {
      position: absolute;
      cursor: pointer;
      right: 20px;
      top: 20px;
      width: 10px;
      height: 10px;
      &::after {
        display: block;
        position: absolute;
        content: '';
        width: 100%;
        height: 2px;
        left: 50%;
        top: 50%;
        background: #000000;
        transform: translate(-50%, -50%) rotate(45deg);
      }
      &::before {
        display: block;
        position: absolute;
        content: '';
        width: 100%;
        height: 2px;
        left: 50%;
        top: 50%;
        background: #000000;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
    .title {
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      text-align: center;
      margin-top: 32px;
    }
    .content {
      margin: 15px 0 20px;
      padding: 0 16px;
      .time {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
      }
      .info {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        margin: 5px 0 10px;
      }
      .subInfo {
        font-size: 12px;
        font-weight: 400;
        color: #fa5151;
        line-height: 22px;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      div {
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
        width: 96px;
        height: 32px;
        background: #0085ff;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
        &:last-child {
          background: transparent;
          color: #666666;
          border: 1px solid #dddddd;
        }
      }
    }
  }
}
</style>
