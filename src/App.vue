<template>
  <router-view />
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { getOssInfo } from './api';
import { key } from './store';
import { getStorage, setMsgList } from './utils/utils';
import { useClientSendMsgAckToServer } from './hooks/window';
import { IMsgInfo, ImsgItem } from './types/msg';
import messageAudio from './assets/audio/message.wav';
import logo from './assets/logo.svg';
const store = useStore(key);
store.dispatch('init');

// 获取浏览器弹框权限
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

const init = async () => {
  const url = 'ws://101.34.76.94:8002';
  // const url = 'wss://ws.yime.app';
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
        const revokeKey = msgList[msgInfos[0].fromId].readList.findIndex(
          (e: any) => Number(e.msgId) === Number(revokeMsgId),
        );
        msgList[msgInfos[0].fromId].readList.splice(revokeKey, 1);
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
        // 如果是群聊并且是系统消息则更新本地缓存群详情
        if (msgInfos[0].msgContent.msgContent === 'systemNotifyInfo') {
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
    if (store.state.switchSettingInfo.pokeSound) {
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
