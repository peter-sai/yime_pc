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

const store = useStore(key);
store.dispatch('init');

const init = async () => {
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
    }, 2000);
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
    msgInfos.length > 0 ? msgInfos[msgInfos.length - 1] : null;
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
        console.log(msgList, revokeKey);

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
      clientSendMsgAckToServer(msgInfos);
      store.dispatch('addMsgList', { ...(msgInfos[0] || {}) });
    }
  },
);

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
