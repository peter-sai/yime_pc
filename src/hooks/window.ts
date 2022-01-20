import { showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { initStore } from '@/store';
import * as RongIMLib from '@rongcloud/imlib-next';
import {
  IFireInfo,
  IGroupAtInfo,
  IMsgInfo,
  ImsgItem,
  ISystemNotifyInfo,
  IVideoCallMsgInfo,
  TMsgContent,
} from '@/types/msg';
import { IGroupInfo, IUserDetailInfo, IUserInfo } from '@/types/user';
import { getMsgList, setMsgList } from '@/utils/utils';
import { getToken } from '../api';
import { number } from '@intlify/core-base';
import moment from 'moment';
import { ComputedRef, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { stringifyQuery } from 'vue-router';
import { Store } from 'vuex';
import { RCCallClient } from '@rongcloud/plugin-call';

// 群操作
const useUserOperateGroupInfo = (store: Store<initStore>) => {
  return async (type: number, groupInfo: any) => {
    const query = {
      operateType: type,
      groupInfo,
    };

    const data = await store.dispatch('postMsg', {
      query,
      cmd: 1027,
      encryption: 'Aoelailiao.Login.UserOperateGroupInfoReq',
      auth: true,
    });
    return data;
  };
};

// 用户操作设置项的开关
function useBeforeSwitch(
  store: Store<initStore>,
  settingItemId: number,
  t: { (key: string | number): string },
  isBack?: boolean,
  inGroupType?: Ref<string>,
  groupAttachInfo?: any,
) {
  return async (e: boolean | number) => {
    const switchState = typeof e === 'number' ? e : e ? 1 : 0;
    const res = {
      objectType: 2,
      objectId: store.state.activeUid,
      settingItemId,
      switchState,
    };
    if (isBack) {
      res.switchState = e ? 0 : 1;
    }
    showLoading();
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1041,
      encryption: 'Aoelailiao.Login.UserOperateSettingItemSwitchReq',
      auth: true,
    });
    return new Promise((resovle, reject) => {
      if (data.body.resultCode === 0) {
        // 更新缓存
        if (settingItemId === 1005) {
          // 消息通知
          upDateStore(store, 'groupMsgMute', res.switchState);
        } else if (settingItemId === 1004) {
          // 置顶
          upDateStore(store, 'groupTop', switchState);
        } else {
          // 设置进群权限
          upDateStore(store, 'groupInviteState', switchState);
          if (inGroupType) {
            inGroupType.value = groupInviteState(switchState, t);
          }
          if (groupAttachInfo) {
            groupAttachInfo.value.groupInviteState = switchState;
          }
        }
        resovle(true);
      } else {
        reject();
      }
      Toast(t(data.body.resultString));
    });
  };
}

// 更新缓存
function upDateStore(
  store: Store<initStore>,
  group: string,
  switchState?: number,
) {
  const msgList = store.state.msgList;
  if (msgList && msgList[store.state.activeUid!]) {
    const newMsgList = msgList[store.state.activeUid!];
    newMsgList.groupDetailInfo.groupAttachInfo[group] = switchState;
    store.commit('SET_MSGLISTITEM', { res: newMsgList });
  }
}

function groupInviteState(
  val: number | undefined,
  t: { (key: string | number): string },
) {
  switch (val) {
    case 0:
      return t('允许任何人加群');
    case 1:
      return t('仅限邀请入群');
    case 2:
      return t('不允许任何人加群');
    default:
      return t('允许任何人加群');
  }
}

// 发送消息
const useEnter = (
  store: Store<initStore>,
  search: Ref<string>,
  isGroupMsg = 0,
  msgSource: any,
  t: { (key: string | number): string },
) => {
  const urlP =
    // eslint-disable-next-line no-useless-escape
    /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  const userInfo = store.state.userInfo;
  return async (groupList = []) => {
    const isUrl = urlP.test(search.value);
    const res: any = {
      msgInfo: {
        isGroupMsg,
        fromId: userInfo.uid,
        toId: Number(store.state.activeUid),
        msgShowType: 1,
        isEncrypt: 0,
        msgContent: {
          msgContentType: 1,
          msgContent: 'stringContent',
          stringContent: search.value,
        },
        type: 'stringContent',
        attachInfo: {
          msgSource: msgSource,
        },
      },
    };
    if (isUrl) {
      res.msgInfo.type = 'linkUrlInfo';
      res.msgInfo.msgContent = {
        msgContentType: 25,
        msgContent: 'linkUrlInfo',
        linkUrlInfo: {
          url: search.value,
          needParse: 1,
        },
      };
    }

    // 处理@消息
    const atList = search.value.match(/@(\S*) /g) || [];
    if (atList.length && groupList.length) {
      const ats = atList.map((e) => {
        const item = e.replace('@', '').replace(' ', '');
        if (item === t('所有人')) {
          return {
            type: 1,
            uid: null,
            name: t('所有人'),
          };
        } else {
          const info: any = groupList.find((e: any) => e.name === item);
          return {
            uid: info.uid,
            name: info.name,
            type: 0,
          };
        }
      });

      res.msgInfo.type = 'groupAtInfo';
      res.msgInfo.msgContent = {
        msgContentType: 7,
        msgContent: 'groupAtInfo',
        groupAtInfo: {
          stringContent: search.value,
          atUsers: ats.map((e) => {
            return {
              type: e.type,
              uid: e.uid,
            };
          }),
        },
      };
    }
    console.log(res);

    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 2001,
      encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
      auth: true,
    });

    if (data.body.resultCode === 0) {
      search.value = '';
    } else {
      Toast(t(data.body.resultString));
    }
  };
};

// 发送图片
const useSendImg = (
  store: Store<initStore>,
  isGroupMsg = 0,
  t: { (key: string | number): string },
  changUserImg?: any,
  accept?: Ref<string>,
  nextTick?: any,
) => {
  return async (type: string) => {
    console.log(type);

    if (type === 'sayHello') {
      const res = {
        msgInfo: {
          isGroupMsg,
          fromId: store.state.userInfo.uid,
          toId: store.state.activeUid,
          msgShowType: 1,
          isEncrypt: 0,
          msgContent: {
            msgContentType: 2,
            msgContent: 'imageMsg',
            imageMsg: {
              imageUrl: 'emoji_1',
              imageWidth: 168,
              imageHeight: 168,
            },
          },
        },
      };
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 2001,
        encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
        auth: true,
      });
      if (data.body.resultCode !== 0) {
        Toast(t(data.body.resultString));
      }
    } else if (type === 'img') {
      accept!.value = 'image/*';
      await nextTick();
      changUserImg.value.click();
    } else if (type === 'file') {
      accept!.value = '.xls,.doc,.docx,.txt,.pdf';
      await nextTick();
      changUserImg.value.click();
    }
  };
};

// 选择图片之后的回调函数
const useCbImg = (
  store: Store<initStore>,
  accept: Ref<string>,
  t: { (key: string | number): string },
) => {
  return async (e: any) => {
    const file = e.target.files[0];
    const info = (await store.state.client.put(file.name, file)) as {
      url: string;
    } | null;
    let res = {};
    if (accept.value === 'image/*') {
      // 图片
      const size = (await getSize(file)) as { width: number; height: number };
      res = {
        msgInfo: {
          isGroupMsg: 0,
          fromId: store.state.userInfo.uid,
          toId: store.state.activeUid,
          msgShowType: 1,
          isEncrypt: 0,
          msgContent: {
            msgContentType: 2,
            msgContent: 'imageMsg',
            imageMsg: {
              imageUrl: info?.url,
              imageWidth: size.width,
              imageHeight: size.height,
            },
          },
        },
      };
    } else {
      // 文件
      res = {
        msgInfo: {
          isGroupMsg: 0,
          fromId: store.state.userInfo.uid,
          toId: store.state.activeUid,
          msgShowType: 1,
          isEncrypt: 0,
          msgContent: {
            msgContentType: 19,
            msgContent: 'fileInfo',
            fileInfo: {
              fileName: file.name,
              fileSize: file.size,
              fileUrl: info?.url,
            },
          },
        },
      };
    }
    try {
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 2001,
        encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
        auth: true,
      });
      if (data.body.resultCode !== 0) {
        Toast(t(data.body.resultString));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

// 获取图片宽高
const getSize = (file: File) => {
  return new Promise((resovle, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); //这里把一个文件用base64编码,具体什么是base64编码,我将稍后在不久的文章中介绍
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result; //获取编码后的值,也可以用this.result获取
      img.onload = (v: any) => {
        const obj = {
          height: 0,
          width: 0,
        };
        if (v.target) {
          obj.height = v.target.height;
          obj.width = v.target.width;
        }
        if (v.path) {
          obj.height = v.path[0].height;
          obj.width = v.path[0].width;
        }
        resovle({
          height: obj.height,
          width: obj.width,
        });
      };
      img.onerror = (e) => {
        reject(e);
      };
    };
  });
};

// 格式化 systemNotifyInfo
const useSystemNotifyInfo = (
  store: Store<initStore>,
  t: { (key: string | number): string },
) => {
  return (item: IMsgInfo<ISystemNotifyInfo>) => {
    const { systemNotifyInfo } = item.msgContent;

    const frestMsg = systemNotifyInfo.appointUserSystemNotifyInfos[0];
    if (frestMsg.userIds.includes(store.state.userInfo.uid)) {
      const msg = frestMsg.appointUserNotifyInfo.msgText || '';
      // 格式化消息
      return formatMsg(msg, t);
    } else {
      let str = '';
      if (item.isGroupMsg === 0) {
        const lastMsg = systemNotifyInfo.appointUserSystemNotifyInfos[1];
        if (lastMsg) {
          const msgText = lastMsg.appointUserNotifyInfo.msgText || '';
          const spileText = lastMsg.appointUserNotifyInfo.spileText || '';
          const replaceMsgItems =
            lastMsg.appointUserNotifyInfo.replaceMsgItems || [];
          // 格式化消息
          const res = formatMsg(msgText, t);
          if (res.includes(spileText)) {
            str = res.replace(spileText, replaceMsgItems[0].showContent);
          }
        }
      } else {
        const replaceMsgItems =
          systemNotifyInfo.otherUserNotifyInfo.replaceMsgItems;
        const spileText = systemNotifyInfo.otherUserNotifyInfo.spileText;
        const msgText = t(systemNotifyInfo.otherUserNotifyInfo.msgText);
        if (replaceMsgItems && replaceMsgItems.length) {
          return msgText.replace(spileText, replaceMsgItems[0].showContent);
        } else {
          // 格式化消息
          str = formatMsg(msgText, t);
        }
      }
      return str;
    }
  };
};

// 格式化消息并替换
const formatMsg = (msgText: string, t: { (key: string | number): string }) => {
  const [fristMsg, ...msgs] = msgText.split('#');
  const msg = t(fristMsg);
  if (msgs.length) {
    let newMsg = '';
    msgs.forEach((e, k) => {
      if (k === 0) {
        newMsg = msg.replace('<spile>', e);
      } else {
        newMsg = newMsg.replace(`<spile${k}>`, e);
      }
    });
    return newMsg;
  } else {
    return t(msgText);
  }
};

const switchMsg = (
  item: IMsgInfo<TMsgContent>,
  t: { (key: string | number): string },
  store: Store<initStore>,
  yUserInfo?: IUserInfo,
  groupUserInfos?: IUserInfo[],
  msgItem?: ImsgItem,
) => {
  // 格式化 systemNotifyInfo
  const systemNotifyInfo = useSystemNotifyInfo(store, t);
  let userName = '';
  // let fireInfo, infoList;
  // 阅后即焚
  if (Number(item.msgShowType) === 3 && item.type === 'stringContent') {
    return t('[阅后即焚]');
  }

  // 处理@信息
  if (msgItem) {
    const readList = msgItem.readList;
    const unReadNum = msgItem.unReadNum;
    const length = readList.length;
    const newList = readList.slice(length - unReadNum, length);
    const isAt = newList.find((e) => {
      if (e.type === 'groupAtInfo') {
        const atUsers = e.msgContent.groupAtInfo.atUsers[0];
        if (atUsers.type === 1) {
          return true;
        }
        if (Number(atUsers.uid) === Number(store.state.userInfo.uid)) {
          return true;
        }
      }
      return false;
    });

    if (isAt) {
      return t('有提到你的信息');
    }
  }

  switch (item.type || (item.msgContent && item.msgContent.msgContent)) {
    case 'stringContent':
      return item.msgContent.stringContent;
    case 'imageMsg':
      return t('[图片]');
    case 'fileInfo':
      return t('[文件]');
    case 'fireInfo':
      return (item.msgContent.fireInfo as IFireInfo).stringContent;
    //   fireInfo = item.msgContent.fireInfo.stringContent;
    //   infoList = fireInfo.substr(7, fireInfo.length).split('#');
    //   return infoList[1] + infoList[0];
    case 'revokeInfo':
      // 处理群
      if (item.isGroupMsg) {
        const res = groupUserInfos!.find(
          (e: any) => Number(e.uid) === Number(item.fromId),
        );
        if (res) {
          return res.nickname + t('撤回了一条消息');
        }
        return t('撤回了一条消息');
        // 个人消息
      } else {
        if (item.fromId !== store.state.userInfo.uid) {
          userName =
            yUserInfo?.userAttachInfo?.remarkName || yUserInfo!.nickname;
        } else {
          const userInfo = store.state.userInfo;
          userName = userInfo?.userAttachInfo?.remarkName || userInfo.nickname;
        }
        return userName + t('撤回了一条消息');
      }
    case 'systemNotifyInfo':
      return systemNotifyInfo(item as IMsgInfo<ISystemNotifyInfo>);
    case 'visitingCard':
      return t('[名片]');
    case 'linkUrlInfo':
      return t('[链接]');
    case 'voiceMsg':
      return t('[语音]');
    case 'cleanInfo':
      return t('[清理消息]');
    case 'videoCallInfo':
      if (
        (item.msgContent.videoCallInfo as IVideoCallMsgInfo).videoType === 1
      ) {
        return t('[语音通话]');
      } else {
        return t('[视频通话]');
      }
    case 'gpsMsgInfo':
      return t('[位置]');
    case 'groupAtInfo':
      return (item.msgContent.groupAtInfo as IGroupAtInfo).stringContent;
    default:
      return '';
  }
};

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
    (e: any) => e.msgContent.msgContent !== 'videoCallInfo',
  );

  const offlineMsgInfos = offlineMsg.sort(
    (a: any, b: any) => a.msgId - b.msgId,
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

// 离线数据合并本地数据
const mergeData = async (
  offlineMsgInfos: IMsgInfo<TMsgContent>[],
  store: Store<initStore>,
  roamList: IMsgInfo<TMsgContent>[],
) => {
  const list = roamList.concat(offlineMsgInfos);
  for (const v of list) {
    const e = { ...v };
    e.type = e.msgContent.msgContent;
    e.isRoamMsg = roamList.length ? true : false;

    await store.dispatch('addMsgList', e);
  }
};

// 获取到在线消息和离线消息后发送ack
const useClientSendMsgAckToServer = (
  store: Store<initStore>,
  isGroupMsg = 0,
) => {
  return async (
    msgId: number,
    fromId: number,
    toId: number,
    isOffLine: number,
  ) => {
    const res = {
      msgId, //当前收到的消息的最大msgid
      isEncrypt: 0, //是否私密聊,0--否（默认）,1--是
      isGroupMsg: isGroupMsg, //是否群消息
      fromId, //单聊A的uid,群聊时填0
      toId, //单聊B的uid，群聊时填群ID
      isOffLine, //是否为离线消息：0--在线消息，1--离线消息
    };
    await store.dispatch('postMsg', {
      query: res,
      cmd: 2005,
      encryption: 'Aoelailiao.Message.ClientSendMsgAckToServerReq',
      auth: true,
    });
  };
};

// 获取最大msgId
const useUserGetConversationHasReadedMsgInfo = (store: Store<initStore>) => {
  return async (fromId: number, toId: number, isGroupMsg = 0) => {
    const res = {
      msgHasReadedInfos: [
        {
          isGroupMsg: isGroupMsg,
          fromId: fromId,
          toId: toId,
        },
      ],
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 2145,
      encryption: 'Aoelailiao.Message.UserGetConversationHasReadedMsgInfoReq',
      auth: true,
    });
    return data.body.msgHasReadedInfos;
  };
};

// 撤回消息
const useRevoke = (
  store: Store<initStore>,
  t: { (key: string | number): string },
  isGroupMsg = 0,
) => {
  return async (msg: any) => {
    // 时间多于两分钟的不可以撤回
    if (Date.now() - msg.msgTime * 1000 > 120000) {
      return Toast('只能撤回两分钟内的消息');
    }
    const userInfo = store.state.userInfo;
    const res = {
      msgInfo: {
        isGroupMsg: isGroupMsg,
        fromId: userInfo.uid,
        toId: Number(store.state.activeUid),
        msgShowType: 1,
        isEncrypt: 0,
        msgContent: {
          msgContentType: 8,
          msgContent: 'revokeInfo',
          revokeInfo: {
            revokeMsgId: msg.msgId,
          },
        },
      },
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 2001,
      encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
      auth: true,
    });
    Toast(t(data.body.resultString));
  };
};

// 计算时间显示
const useFormateTime = () => {
  return (msgTime: number) => {
    const { t } = useI18n();
    if (!msgTime) {
      return '';
    }
    const time = msgTime * 1000;
    const minute = moment().diff(moment(time), 'minute');
    const day = moment().diff(moment(time), 'day');
    if (minute < 10) {
      return t('刚刚');
    } else if (minute < 3600) {
      if (moment(time).format('DD') === moment().format('DD')) {
        // 今天
        return moment(time).format('HH:mm');
      } else {
        // 昨天
        return t('昨天') + ' ' + moment(time).format('HH:mm');
      }
    } else if (day < 30) {
      return moment(time).format('MM/DD');
    }
    return moment(time).format('YYYY/MM/DD');
  };
};

const initRongConnect = async (
  store: Store<initStore>,
  rongIm: RCCallClient | null,
) => {
  const userInfo = store.state.userInfo;
  const res: any = await getToken({
    uid: userInfo.uid,
    name: userInfo.nickname,
    portrait: userInfo.icon,
  });

  RongIMLib.connect(res.token).then((res: any) => {
    if (res.code === 0) {
      console.log('链接成功, 链接用户 id 为: ', res.data.userId);
      store.commit('SET_RONGIM', rongIm);
    } else {
      console.warn('链接失败, code:', res.code);
    }
  });
};

export {
  useUserOperateGroupInfo,
  useBeforeSwitch,
  groupInviteState,
  upDateStore,
  useEnter,
  useSendImg,
  useCbImg,
  getSize,
  switchMsg,
  useGetOfflineMsg,
  mergeData,
  useClientSendMsgAckToServer,
  useSystemNotifyInfo,
  useUserGetConversationHasReadedMsgInfo,
  useRevoke,
  useFormateTime,
  initRongConnect,
};
