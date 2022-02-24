import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import {
  clearStorage,
  getMsgList,
  getStorage,
  getToken,
  setStorage,
} from '@/utils/utils';
import { useGetOfflineMsg } from '@/api/app';
import { IMsgInfo, ImsgItem, TMsgContent } from '@/types/msg';
import { IUserDetailInfo } from '@/types/user';
import { useClientSendMsgAckToServer, mergeData } from '@/hooks/window';
import { hideLoading } from '@/plugin/Loading';

const OSS = require('ali-oss');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const protoRoot = require('@/protoBuild/proto');

export const key: InjectionKey<Store<initStore>> = Symbol();

let ws: any = null;
let num = 0;

const cb: any = {};
let defCb: any = null;

let time = 0;

const initState = {
  rongIm: null,
  forwardMsgId: 0,
  lang: -1, // 设置语言
  token: '',
  isOnLine: '消息',
  ws: null,
  activeUid: undefined,
  activeIsGroup: false,
  appAboutUsInfo: {
    Jt: '',
    Ft: '',
    En: '',
  },
  groupChatWelcomeTips: {
    Jt: '',
    Ft: '',
    En: '',
  },
  userChatWelcomeTips: {
    Jt: '',
    Ft: '',
    En: '',
  },
  switchSettingInfo: {
    pushSound: 1, ///离线消息push声音 0--打开,1--关闭
    pushShake: 1, ///离线消息push震动 0--打开,1--关闭
    newMessage: 1, //新消息离线通知 0--打开,1--关闭
    videoCall: 1, //语音和视频通话离线提醒 0--打开,1--关闭
    pokeSound: 1, //戳一戳声音提醒 0--打开,1--关闭
    pokeShake: 1, //戳一戳震动提醒 0--打开,1--关闭
    findMePhone: 1, ///通过手机号查找我 0--打开,1--关闭
    findMeImAccount: 1, ///通过IM号查找我 0--打开,1--关闭
    findMeNickname: 1, ///通过昵称查找我 0--打开,1--关闭
    findMeGroup: 1, ///通过群聊 0--打开,1--关闭
    findMeRecommend: 1, ///通过推荐 0--打开,1--关闭
    recommendContactsUser: 1, ///向我推荐通讯录朋友 0--打开,1--关闭
    readMessageState: 1, ///已读未读消息设置,打开该开关后对方看不到我的已读状态 0--打开,1--关闭
    findMeShareLink: 1, ///通过分享链接找到我 0-打开 1--关闭,默认为0表示允许
    whoCanInviteMeGroup: 0, ///谁能拉我进群 0-所有人 1-仅好友 2-没有人,默认为0表示所有人可以拉我进去
    refuseStrangerMessage: 0, ///拒绝陌生人消息 0-关闭 1--打开 默认为0表示默认接收陌生人消息
  },
  userUid: 0, // 用来判断显示哪个用户详情
  userDetailInfo: {
    userInfo: {
      uid: 0,
      nickname: '',
      icon: '',
      onlineState: 0,
      imAccount: '',
      lastOnlineTime: 0,
      isBotUser: 0,
      userAttachInfo: {
        remarkName: '', //备注名称
        destoryReaded: 0, //阅后即焚开关,0--关闭(默认),1--开
        msgTop: 0, //消息置顶开关,0--关闭(默认),1--开
        msgMute: 0, //消息免打扰开关,0--关闭(默认),1--开
        msgScreenShotNotify: 0,
      },
    },
    isFriend: 0, //是否为好友关系，0--不是(默认)，1--是
    friend_query_type: 1, //加好友的方式，1--搜索，2--扫描二维码， 3--个人名片
    phone: '', //手机号
    qrCode: '', //用户二维码url
    isRealnameAuth: 0, //是否实名认证，0--未实名认证(默认)，1--已实名认证
    isInMyBlacklist: 0, //是否在我的黑名单中，0--不是(默认)，1--是
    isSetPassword: 0, //是否设置过密码，0--未设置(默认,不需要设置密码)，1--已设置(进入修改密码页)，2--强制退出时需要设置登录密码(进入设置密码页)
    userSex: 1, //1--男，2--女
    cityCode: '', //设置的位置信息
    userSign: '', //用户签名
    findMeGroup: 0, //通过群聊向我发起聊天 0--打开,1--关闭
    source: '', //来源
    sourceId: 0, //来源id;用户id 群id
    source_type: 0, //0--群聊1-好友推荐2-分享链接3-手机号搜索4-YIME号搜索5-昵称搜索
    labelLists: [], // 好友标签信息
  },
  userInfo: {
    uid: 0,
    nickname: '',
    icon: '',
    onlineState: 0,
    imAccount: '',
    lastOnlineTime: 0,
    isBotUser: 0,
    userAttachInfo: {
      remarkName: '', //备注名称
      destoryReaded: 0, //阅后即焚开关,0--关闭(默认),1--开
      msgTop: 0, //消息置顶开关,0--关闭(默认),1--开
      msgMute: 0, //消息免打扰开关,0--关闭(默认),1--开
      msgScreenShotNotify: 0,
    },
  },
  groupInfos: [],
  contact: [],
  msgInfo: {},
  client: {
    put: (fileName: any, file: any) => null,
  },
  msgList: {} as { [key: number]: ImsgItem },
  playAudio: '', // 当前正在播放的音频
  conversationIng: false, // 是否在通话中
};

export type initStore = typeof initState;

const sotreRoot = createStore({
  state: initState,
  mutations: {
    SET_RONGIM: (state, res) => {
      state.rongIm = res;
    },
    SET_CONVERSATIONING: (state, res) => {
      state.conversationIng = res;
    },
    SET_FORWARDMSGID: (state, res) => {
      state.forwardMsgId = res;
    },
    SET_LANG: (state, res) => {
      state.lang = res;
      setStorage('lang', res);
    },
    SET_PLAYAUDIO: (state, res) => {
      state.playAudio = res;
    },
    SET_USERUID: (state, res) => {
      state.userUid = res;
    },
    SET_MSGLIST: (state, res) => {
      state.msgList = res;
    },
    SET_MSGLISTITEM: (state, { res, uid }) => {
      state.msgList[uid || state.activeUid] = res;
    },
    DEL_MSGITEM: (state, uid) => {
      delete state.msgList[uid];
    },
    ADD_MSGLIST: (state, { res, id, groupDetailInfo, userDetailInfo }) => {
      if (state.msgList[id]) {
        // push 消息
        if (!res.isRoamMsg) {
          state.msgList[id].readList.push(res);
          if (
            Number(res.fromId) !== Number(state.userInfo.uid) &&
            (res.isGroupMsg
              ? Number(res.toId) !== Number(state.activeUid)
              : Number(res.fromId) !== Number(state.activeUid))
          ) {
            state.msgList[id].unReadNum++;
          }
          state.msgList[id].lastMsg = res;
        } else {
          // 漫游消息

          const list = state.msgList[id].readList;
          const item = state.msgList[id];
          list.push(res);
          list.sort((a, b) => a.msgId - b.msgId);
          item.readList = list;
          state.msgList[id] = item;
          state.msgList[id].lastMsg = list[list.length - 1];
        }
      } else {
        state.msgList[id] = res;
        if (groupDetailInfo) {
          state.msgList[id].groupDetailInfo = groupDetailInfo;
        }
        if (userDetailInfo) {
          state.msgList[id].userDetailInfo = userDetailInfo;
        }
        state.msgList[id].lastMsg = res.readList[0];
      }
    },
    ADD_NOTIFY: (state, { res, id }) => {
      state.msgList[id] = res;
    },
    SET_APPABOUTUSINFO: (state, val) => {
      state.appAboutUsInfo = val;
    },
    SET_ACTIVEUID: (state, val) => {
      state.activeUid = val;
    },
    SET_ACTIVEISGROUP: (state, val) => {
      state.activeIsGroup = val;
    },
    SET_GROUPCHATWELCOMETIPS: (state, val) => {
      state.groupChatWelcomeTips = val;
    },
    SET_USERCHATWELCOMETIPS: (state, val) => {
      state.userChatWelcomeTips = val;
    },
    SET_SWITCHSETTINGINFO: (state, val) => {
      state.switchSettingInfo = val;
    },
    SET_USERDETAILINFO: (state, val) => {
      state.userDetailInfo = val;
    },
    SET_USERINFO: (state, val) => {
      state.userInfo = val;
    },
    SET_TOKEN: (state, val) => {
      state.token = val;
    },
    SET_ISONLINE: (state, val) => {
      state.isOnLine = val;
    },
    SET_WS: (state, val) => {
      state.ws = val;
      ws = val;
      onMessage();
      if (!ws.onopen) {
        ws.onopen = async () => {
          console.log('open');
          num = 0;
          setTimeout(() => {
            heartbeat(sotreRoot.dispatch, ws);
          }, 10000);
          const userList = getStorage('userList');
          if (!userList) return;

          if (getToken()) {
            const { offlineMsgInfos } = await useGetOfflineMsg(sotreRoot);
            // 发送ack
            clientSendMsgAckToServer(offlineMsgInfos);
            // 合并数据
            await mergeData(offlineMsgInfos, sotreRoot, []);
          }
        };
      }
    },
    SET_GROUPINFOS: (state, val) => {
      state.groupInfos = val;
    },
    SET_CONTACT: (state, val) => {
      state.contact = val;
    },
    SET_CREDENTIALS: (state, val) => {
      state.client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
        region: 'oss-accelerate',
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: val.AccessKeyId,
        accessKeySecret: val.AccessKeySecret,
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: val.SecurityToken,
        // 填写Bucket名称。
        bucket: '123message',
      });
    },
  },
  actions: {
    init({ commit }) {
      const switchSettingInfo = getStorage('switchSettingInfo');
      const userDetailInfo = getStorage('userDetailInfo');
      const userInfo = getStorage('userInfo');
      const userLoginToken = getStorage('userLoginToken');
      const appAboutUsInfo = getStorage('appAboutUsInfo');
      const groupChatWelcomeTips = getStorage('groupChatWelcomeTips');
      const userChatWelcomeTips = getStorage('userChatWelcomeTips');
      const msgList = getMsgList() || {};
      commit('SET_MSGLIST', msgList);
      appAboutUsInfo &&
        commit('SET_APPABOUTUSINFO', JSON.parse(appAboutUsInfo));
      groupChatWelcomeTips &&
        commit('SET_GROUPCHATWELCOMETIPS', JSON.parse(groupChatWelcomeTips));
      userChatWelcomeTips &&
        commit('SET_USERCHATWELCOMETIPS', JSON.parse(userChatWelcomeTips));
      switchSettingInfo &&
        commit('SET_SWITCHSETTINGINFO', JSON.parse(switchSettingInfo));
      userDetailInfo &&
        commit('SET_USERDETAILINFO', JSON.parse(userDetailInfo));
      userInfo && commit('SET_USERINFO', JSON.parse(userInfo));

      const tokenObj = JSON.parse(userLoginToken);
      if (tokenObj && tokenObj.buffer) {
        const bufferList = tokenObj.buffer.split(',');
        const buffer = new ArrayBuffer(bufferList.length);
        const bufferUint = new Uint8Array(buffer);

        bufferList.forEach((e: number, k: number) => {
          bufferUint[k] = e;
        });
        const token = new Uint8Array(
          buffer,
          tokenObj.byteOffset,
          tokenObj.byteLength,
        );
        tokenObj.uint8Array.split(',').forEach((e: number, k: number) => {
          token[k] = e;
        });
        commit('SET_TOKEN', token);
      }
    },
    logout({ commit }) {
      commit('SET_SWITCHSETTINGINFO', null);
      commit('SET_USERDETAILINFO', null);
      commit('SET_USERINFO', null);
      commit('SET_TOKEN', null);
      clearStorage();
    },
    postMsg(
      { state, dispatch },
      { query, cmd, encryption, auth = false, userToken = null },
    ) {
      let data: any = null;
      if (encryption) {
        const loginInfo = protoRoot.lookup(encryption);
        const res = loginInfo.encode(query).finish();
        data = getProtocolHeader(res, cmd, auth, userToken);
      } else {
        data = getProtocolHeader([], cmd, auth, userToken);
      }

      const ws = state.ws as any;
      if (ws.readyState !== 1) {
        ws.onopen = async function () {
          setTimeout(() => {
            heartbeat(dispatch, ws);
          }, 10000);
          console.log('open');

          ws.send(data);
        };
      } else {
        ws.send(data);
      }
      return getMessage(cmd, encryption, state);
    },
    // push消息
    async addMsgList({ state, commit, dispatch }, res) {
      res.type = res.msgContent.msgContent;
      let id: number;
      // 单聊
      if (res.isGroupMsg === 0) {
        id =
          Number(state.userInfo.uid) === Number(res.fromId)
            ? res.toId
            : res.fromId;
      } else {
        // 群聊
        id = res.toId;
      }

      if (state.msgList[id]) {
        if (
          !state.msgList[id].readList.find(
            (e: IMsgInfo<TMsgContent>) => Number(e.msgId) === Number(res.msgId),
          )
        ) {
          // push消息
          commit('ADD_MSGLIST', { res, id });
        }
      } else {
        const item = {
          readList: [{ ...res }],
          isGroup: res.isGroupMsg,
          id: res.isGroupMsg ? res.toId : id,
          unReadNum:
            Number(res.fromId) !== Number(state.userInfo.uid) && !res.isRoamMsg
              ? 1
              : 0,
          isBotUser: false,
          userDetailInfo: {} as IUserDetailInfo,
          lastMsg: {},
          groupDetailInfo: {},
        };
        if (res.isGroupMsg === 0) {
          // 单聊获取用户详情
          const data = await dispatch('postMsg', {
            query: {
              uid: id,
            },
            cmd: 1011,
            encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
            auth: true,
          });
          const userDetailInfo = data.body.userDetailInfo;
          // push 消息
          commit('ADD_MSGLIST', { res: item, id, userDetailInfo });
        } else {
          // 群聊获取群详情
          const data = await dispatch('postMsg', {
            query: { groupId: id },
            cmd: 1029,
            encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
            auth: true,
          });
          const groupDetailInfo = data.body.groupDetailInfo;
          commit('ADD_MSGLIST', { res: item, id, groupDetailInfo });
        }
      }
    },
  },
  modules: {},
});

function getProtocolHeader(
  bodybuffer: any,
  cmd: any,
  auth: boolean,
  userToken: any,
) {
  // 2 版本

  const v2List = [2043, 2045];
  const { token: stateToken, userInfo }: any = sotreRoot.state;
  const token = userToken || stateToken;

  const baseLength = 26;
  const tokenLength = !auth || !token ? 0 : token.length;
  const length = baseLength + bodybuffer.length + tokenLength;

  const ab = new ArrayBuffer(length);
  const dv = new DataView(ab);
  dv.setUint32(0, length); // length
  dv.setUint8(4, 1); // serviceId
  dv.setUint16(5, cmd); // cmd
  dv.setUint8(7, 1); // version
  dv.setUint32(8, userInfo ? userInfo.uid : 0); // uid
  dv.setUint8(12, 0); // encryptType
  dv.setUint8(13, 7); // clientType
  dv.setUint16(14, v2List.includes(cmd) ? 2000 : 10); // clientVersion
  dv.setUint16(16, 10); // reserved
  dv.setUint32(18, tokenLength); // tokenLength
  for (let i = 0; i < tokenLength; i++) {
    const key = 22 + i;
    dv.setUint8(key, token[i]);
  }

  dv.setUint32(22 + tokenLength, bodybuffer.length); // bodyLength
  for (let i = 0; i < bodybuffer.length; i++) {
    // body
    dv.setUint8(baseLength + tokenLength + i, bodybuffer[i]);
  }
  return ab;
}

function getMessage(cmd: any, encryption: any, state: any) {
  return new Promise((resolve, reject) => {
    cb[cmd] = (evt: any) => {
      try {
        const decrypt = encryption
          ? encryption.substr(0, encryption.length - 3) + 'Ans'
          : null;
        const dataview = new DataView(evt.data);
        const bodyBuf = new Uint8Array(evt.data.slice(26));
        let LogOutAns = decrypt ? protoRoot.lookup(decrypt) : null;

        const ansCmd = dataview.getUint16(5);

        // 获取后台自动推送的上线和离线消息
        if (ansCmd === 2129) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.UserOnlineStateNotifyToClient',
          );
        }
        if (ansCmd === 2004) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.ServerSendMsgToClientNotify',
          );
        }
        if (ansCmd === 5002) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.ServerSendMsgToClientNotify',
          );
        }
        if (ansCmd === 2148) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.ServerSendMsgHasReadedInfoToClientNotify',
          );
        }
        if (ansCmd === 2054) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.ClientGetSectionOfflineMsgAns',
          );
        }

        if (ansCmd === 2125) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.WriteStateNotifyToClient',
          );
        }

        if (ansCmd === 2024) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.ServerSendSystemNotifyMsg',
          );
        }

        if (ansCmd === 2156) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.GroupCallNotifyToClient',
          );
        }

        if (ansCmd === 2162) {
          LogOutAns = protoRoot.lookup(
            'Aoelailiao.Message.GroupCallApplyJoinToClient',
          );
        }

        const query = {
          length: dataview.getUint32(0),
          serviceId: dataview.getUint8(4),
          cmd: dataview.getUint16(5),
          version: dataview.getUint8(7),
          uid: dataview.getUint32(8),
          encryptType: dataview.getUint8(12),
          clientType: dataview.getUint8(13),
          clientVersion: dataview.getUint16(14),
          reserved: dataview.getUint16(16),
          tokenLength: dataview.getUint32(18),
          bodyLength: dataview.getUint32(22),
          body: LogOutAns ? LogOutAns.decode(bodyBuf) : bodyBuf,
        };

        // 自动保存到本地
        const body = query.body;

        if (body.resultCode === 1101) {
          // 登录凭证失效
          sotreRoot.dispatch('logout');

          location.reload();
          return;
        }
        if (body.switchSettingInfo) {
          setStorage(
            'switchSettingInfo',
            JSON.stringify(body.switchSettingInfo),
          );
          sotreRoot.commit('SET_SWITCHSETTINGINFO', body.switchSettingInfo);
        }
        if (body.appAboutUsInfo) {
          setStorage('appAboutUsInfo', JSON.stringify(body.appAboutUsInfo));
          sotreRoot.commit('SET_APPABOUTUSINFO', body.appAboutUsInfo);
        }
        if (body.groupChatWelcomeTips) {
          setStorage(
            'groupChatWelcomeTips',
            JSON.stringify(body.groupChatWelcomeTips),
          );
          sotreRoot.commit(
            'SET_GROUPCHATWELCOMETIPS',
            body.groupChatWelcomeTips,
          );
        }
        if (body.userChatWelcomeTips) {
          setStorage(
            'userChatWelcomeTips',
            JSON.stringify(body.userChatWelcomeTips),
          );
          sotreRoot.commit('SET_USERCHATWELCOMETIPS', body.userChatWelcomeTips);
        }

        state.msgInfo = query;
        if (query.cmd !== 2) {
          // console.log(query);
        }

        if (query.cmd - cmd === 1) {
          resolve(query);
        } else {
          hideLoading();
        }
      } catch (error) {
        console.log(error);
        hideLoading();
        reject(error);
      }
    };
    if (!defCb) {
      defCb = cb[cmd];
    }
  });
}

function onMessage() {
  const cmdList = [2129, 2004, 2125, 2148, 2024, 2156, 2162];
  ws.onmessage = (evt: any) => {
    if (sotreRoot.state.isOnLine !== '消息') {
      sotreRoot.commit('SET_ISONLINE', '消息');
    }
    const dataview = new DataView(evt.data);
    const ansCmd = dataview.getUint16(5);
    if (cmdList.includes(ansCmd)) {
      defCb(evt);
    } else {
      if (ansCmd === 2) {
        time = Date.now();
      }
      try {
        cb[ansCmd - 1](evt);
      } catch (error) {
        console.log(error, ansCmd);
      }
    }
  };
}

// 心跳包
async function heartbeat(dispatch: any, ws: any) {
  const strarTime: number = Date.now();
  try {
    if (num <= 2) {
      setTimeout(() => {
        heartbeat(dispatch, ws);
      }, 10000);
    } else {
      console.log('close');
      // 重新连接
      ws.close();
    }
    setTimeout(() => {
      if (!time || time - strarTime > 3000 || time - strarTime < 0) {
        num++;
      }
    }, 3000);
    await dispatch('postMsg', {
      query: null,
      cmd: 1,
    });
  } catch (error) {
    num++;
  }
}

// 发送ack
const clientSendMsgAckToServer = (msgInfos: IMsgInfo<TMsgContent>[]) => {
  const lastMsgInfo =
    msgInfos.length > 0 ? msgInfos[msgInfos.length - 1] : null;
  if (lastMsgInfo) {
    const { msgId, fromId, toId } = lastMsgInfo;
    const ackToServer = useClientSendMsgAckToServer(sotreRoot);
    ackToServer(msgId, fromId, toId, 1);
  }
};

export default sotreRoot;
