import { setStorage } from '@/utils/utils';

// 离线数据
const useGetOfflineMsg = async (store: any) => {
  const res = {};
  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 2053,
    encryption: 'Aoelailiao.Message.ClientGetSectionOfflineMsgReq',
    auth: true,
  });

  const offlineMsg = data.body.offlineMsgInfos.filter(
    (e: any) => e.msgContent.msgContent !== 'videoCallInfo'
  );

  const offlineMsgInfos = offlineMsg.sort(
    (a: any, b: any) => a.msgId - b.msgId
  );
  const lastOfflineMsgInfo =
    offlineMsgInfos.length > 0
      ? offlineMsgInfos[offlineMsgInfos.length - 1]
      : null;
  return {
    offlineMsgInfos,
    lastOfflineMsgInfo,
  };
};

// 登录后的保存数据
const saveData = (data: any, store: any) => {
  const userLoginToken = data.body.userLoginToken;
  const obj = {
    byteLength: userLoginToken.byteLength,
    byteOffset: userLoginToken.byteOffset,
    uint8Array: userLoginToken.toString(),
    buffer: new Uint8Array(userLoginToken.buffer).toString(),
  };
  setStorage('userLoginToken', JSON.stringify(obj));
  setStorage('userDetailInfo', JSON.stringify(data.body.userDetailInfo));
  setStorage('userInfo', JSON.stringify(data.body.userInfo));
  store.commit('SET_SWITCHSETTINGINFO', data.body.switchSettingInfo);
  store.commit('SET_USERDETAILINFO', data.body.userDetailInfo);
  store.commit('SET_USERINFO', data.body.userInfo);
  store.commit('SET_TOKEN', userLoginToken);
};

export { useGetOfflineMsg, saveData };
