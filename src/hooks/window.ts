import { hideLoading, showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { initStore } from '@/store';
import * as RongIMLib from '@rongcloud/imlib-next';
import {
  IFireInfo,
  IGroupAtInfo,
  IMsgInfo,
  ImsgItem,
  IRevokeInfo,
  ISystemNotifyInfo,
  IVideoCallMsgInfo,
  TMsgContent,
} from '@/types/msg';
import {
  IGroupInfo,
  IUserDetailInfo,
  IUserInfo,
  IContacts,
} from '@/types/user';
import { IGroupListItem } from '@/types/group';
import { getToken as getUserToken, getTag } from '@/utils/utils';
import { getOssInfo, getToken, upload } from '../api';
import { number } from '@intlify/core-base';
import moment from 'moment';
import { ComputedRef, Ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { stringifyQuery } from 'vue-router';
import { Store } from 'vuex';
import { RCCallClient } from '@rongcloud/plugin-call';
import { setMsgList } from '@/utils/utils';

// 获取阿里存储信息
export async function initOss(store: Store<initStore>) {
  try {
    // const config: any = await getOssInfo();
    store.commit('SET_CREDENTIALS', '');
  } catch (error) {
    console.log(error);
  }
}
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
  groupAttachInfo?: any
) {
  return async (e: boolean | number, uid?: number) => {
    const switchState = typeof e === 'number' ? e : e ? 1 : 0;
    const res = {
      objectType: 2,
      objectId: uid || store.state.activeUid,
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
          upDateStore(store, 'groupTop', switchState, uid);
        } else if (settingItemId === 2108) {
          //
          upDateStore(store, 'groupMsgAtNotify', switchState);
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
  uid?: number,
  isUser?: boolean
) {
  const msgList = store.state.msgList;
  let activeUid: number = store.state.activeUid!;
  if (uid) {
    activeUid = uid;
  }
  if (msgList && msgList[activeUid!]) {
    const newMsgList = msgList[activeUid!];
    if (isUser) {
      if (!newMsgList.userDetailInfo.userInfo.userAttachInfo) {
        newMsgList.userDetailInfo.userInfo.userAttachInfo = {};
      }
      newMsgList.userDetailInfo.userInfo.userAttachInfo[group] = switchState;
    } else {
      newMsgList.groupDetailInfo.groupAttachInfo[group] = switchState;
    }
    store.commit('SET_MSGLISTITEM', { res: newMsgList, uid: activeUid });
  }
}

function groupInviteState(
  val: number | undefined,
  t: { (key: string | number): string }
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
  t: { (key: string | number): string },
  callBack?: (uid: number, body: any) => void
) => {
  const urlP =
    // eslint-disable-next-line no-useless-escape
    // /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    /(http|https):\/\/\S*/;
  const userInfo = store.state.userInfo;
  return async (groupList: IUserInfo[] = [], copyImgList?: File[]) => {
    for (const e of copyImgList || []) {
      const info: any = e;
      if (
        info?.file?.type?.includes('image') ||
        info?.file?.type?.includes('video')
      ) {
        await sendImgInfo(
          info.file,
          store,
          { value: 'image/*,video/*' } as Ref<string>,
          t,
          isGroupMsg
        );
      } else {
        await sendImgInfo(
          info.file,
          store,
          { value: '.xls,.doc,.docx,.txt,.pdf,video/*' } as Ref<string>,
          t,
          isGroupMsg
        );
      }
    }

    if (!search.value) return;

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
          msgSource: '',
        },
      },
    };

    const msgSource: any = store.state.msgSource;

    if (!store.state.activeIsGroup && msgSource) {
      const userMsgInfo = store.state?.msgList[store.state?.activeUid || -1];
      if (
        !userMsgInfo?.readList?.length &&
        msgSource.sourceId === store.state?.activeUid
      ) {
        res.msgInfo.attachInfo.msgSource = JSON.stringify(msgSource) || '';
      }
    }
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
    const atList = search.value.split('@');
    if (atList.length > 1 && groupList.length) {
      const list = groupList.filter((e) =>
        search.value.includes(`@${e.nickname}`)
      );
      const ats = list.map((v) => {
        const item = v.nickname;
        if (item === 'All') {
          return {
            type: 1,
            uid: null,
            name: t('所有人'),
          };
        } else {
          const info: any = groupList.find((e: any) => e.nickname === item);
          return {
            uid: info.uid,
            name: info.nickname,
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
    if (store.state.replyMsg?.msgId) {
      res.msgInfo.replyMsgId = store.state.replyMsg?.msgId;
    }

    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 2001,
      encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
      auth: true,
    });

    callBack && callBack(Number(store.state.activeUid), data.body);
    if (data.body.resultCode === 0) {
      search.value = '';
      reset(store);
    } else if (data.body.resultCode != 1535) {
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
  nextTick?: any
) => {
  return async (type: string) => {
    changUserImg?.value?.setAttribute('type', 'file');
    if (type === 'sayHello') {
      const res = {
        msgInfo: {
          isGroupMsg,
          fromId: store.state.userInfo.uid,
          toId: store.state.activeUid,
          msgShowType: 1,
          isEncrypt: 0,
          replyMsgId: null,
          msgContent: {
            msgContentType: 2,
            msgContent: 'imageMsg',
            imageMsg: {
              imageUrl: 'emoji_1',
              imageWidth: 168,
              imageHeight: 168,
            },
          },
          attachInfo: {
            msgSource: '',
          },
        },
      };

      const msgSource: any = store.state.msgSource;
      if (!store.state.activeIsGroup && msgSource) {
        const userInfo = store.state?.msgList[store.state?.activeUid || -1];
        if (
          !userInfo?.readList?.length &&
          msgSource.sourceId === store.state?.activeUid
        ) {
          res.msgInfo.attachInfo.msgSource = JSON.stringify(msgSource) || '';
        }
      }
      if (store.state.replyMsg?.msgId) {
        res.msgInfo.replyMsgId = store.state.replyMsg?.msgId;
      }
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 2001,
        encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
        auth: true,
      });
      if (data.body.resultCode === 0) {
        reset(store);
      }
      if (data.body.resultCode !== 0 || data.body.resultCode !== 1535) {
        Toast(t(data.body.resultString));
      }
    } else if (type === 'img') {
      accept!.value = 'image/*,video/*';
      await nextTick();
      changUserImg.value.click();
    } else if (type === 'file') {
      accept!.value = '.xls,.doc,.docx,.txt,.pdf,video/*';
      await nextTick();
      changUserImg.value.click();
    }
  };
};

function fileToBuf(file: File) {
  return new Promise((resovle) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener(
      'loadend',
      (e: any) => {
        resovle(e.target.result);
      },
      false
    );
  });
}

export async function upLoadFile(
  file: File,
  store: Store<initStore>,
  t: { (key: string | number): string }
) {
  // const filebuf: any = await fileToBuf(file);
  // const buffer = new Uint8Array(filebuf);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('auth_token', '9ijn0okm');
  formData.append('path', store.state.userInfo.uid.toString());
  formData.append('output', 'json');

  try {
    const data: any = await upload(store.state.config.h5_address, formData);
    if (!data.path) {
      Toast(data.message || t('操作失败'));
      return null;
    } else {
      return store.state.config.h5_address + data.path;
    }
  } catch (error) {
    Toast(error.message || t('操作失败'));
    return null;
  }
}

// 获取首屏图片
function getFristImg(
  url: string,
  store: Store<initStore>,
  t: { (key: string | number): string },
  videoSize: any
) {
  return new Promise((resovle, reject) => {
    const canvas: any = document.createElement('canvas');
    const video = document.createElement('video');
    video.src = url;
    video.setAttribute('crossOrigin', 'anonymous');
    video.currentTime = 1;
    canvas.width = videoSize.videoWidth;
    canvas.height = videoSize.videoHeight;
    video.onloadeddata = () => {
      canvas
        .getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        async function (blob: any) {
          const files = new window.File(
            [blob],
            `${parseInt((Math.random() * 5000).toString())}.jpeg`,
            {
              type: 'image/jpeg',
            }
          );
          // const url = await upLoadFile(files, store, t);
          const info: any = await store.state.client.put(files.name, files);
          resovle(info.url || '');
        },
        'image/jpeg',
        0.8
      );
    };
    video.onerror = (e) => {
      reject(e);
    };
  });
}

function getVideoSize(url: string) {
  return new Promise((resolve, reject) => {
    // 该file中可以获取到文件名，大小等信息
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

// 选择图片之后的回调函数
const useCbImg = (
  store: Store<initStore>,
  accept: Ref<string>,
  t: { (key: string | number): string },
  isGroupMsg = 0,
  callBack?: (uid: number, body: any) => void
) => {
  return async (e: any, uid?: number) => {
    if (!e.target.files || !e.target.files.length) return;

    if (!store.state.client.userAgent) {
      await initOss(store);
    }

    try {
      const files = e.target.files;
      files.forEach(async (v: File) => {
        await sendImgInfo(v, store, accept, t, isGroupMsg, uid, callBack);
      });
    } catch (error) {
      console.log(error);
    }
  };
};

async function sendImgInfo(
  file: File,
  store: Store<initStore>,
  accept: Ref<string>,
  t: { (key: string | number): string },
  isGroupMsg: number,
  uid?: number,
  callBack?: (uid: number, body: any) => void
) {
  try {
    ////  开始上传图片 ///
    // const url = await upLoadFile(file, store, t);
    // if (!url) return;

    const info = (await store.state.client.put(file.name, file)) as {
      url: string;
    } | null;
    if (!info) return;

    ////  上传图片结束 ///

    // 参数
    let res = {};

    if (accept.value === 'image/*,video/*') {
      if (file.type.includes('video')) {
        let image_url: any, videoSize: any;
        try {
          ////  获取视频首帧 ////
          videoSize = await getVideoSize(info.url);
          image_url = await getFristImg(info.url, store, t, videoSize);
          ////  结束 ////
        } catch (error) {
          console.log(error);
        }
        // 视频
        res = {
          msgInfo: {
            isGroupMsg,
            replyMsgId: store.state.replyMsg?.msgId ?? null,
            fromId: store.state.userInfo.uid,
            toId: uid || store.state.activeUid,
            msgShowType: 1,
            isEncrypt: 0,
            msgContent: {
              msgContentType: 23,
              msgContent: 'videoMsgInfo',
              videoMsgInfo: {
                url: info.url,
                name: file.name,
                size: file.size,
                imageUrl: image_url,
                weight: videoSize.videoWidth,
                height: videoSize.videoHeight,
              },
            },
          },
        };
      } else {
        // 图片
        const size = (await getSize(file)) as {
          width: number;
          height: number;
        };
        res = {
          msgInfo: {
            isGroupMsg,
            replyMsgId: store.state.replyMsg?.msgId ?? null,
            fromId: store.state.userInfo.uid,
            toId: uid || store.state.activeUid,
            msgShowType: 1,
            isEncrypt: 0,
            msgContent: {
              msgContentType: 2,
              msgContent: 'imageMsg',
              imageMsg: {
                imageUrl: info.url,
                imageWidth: size.width,
                imageHeight: size.height,
              },
            },
          },
        };
      }
    } else {
      // 文件
      res = {
        msgInfo: {
          isGroupMsg,
          replyMsgId: store.state.replyMsg?.msgId ?? null,
          fromId: store.state.userInfo.uid,
          toId: uid || store.state.activeUid,
          msgShowType: 1,
          isEncrypt: 0,
          msgContent: {
            msgContentType: 19,
            msgContent: 'fileInfo',
            fileInfo: {
              fileName: file.name,
              fileSize: file.size,
              fileUrl: info.url,
            },
          },
        },
      };
    }

    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 2001,
      encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
      auth: true,
    });
    callBack && callBack(Number(uid || store.state.activeUid), data.body);
    if (data.body.resultCode != 1535) {
      if (data.body.resultCode !== 0) {
        Toast(t(data.body.resultString));
      } else {
        reset(store);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

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
  t: { (key: string | number): string }
) => {
  return (item: IMsgInfo<ISystemNotifyInfo>) => {
    const { systemNotifyInfo } = item.msgContent;

    const frestMsg = systemNotifyInfo?.appointUserSystemNotifyInfos?.length
      ? systemNotifyInfo?.appointUserSystemNotifyInfos[0]
      : {};

    if ((frestMsg.userIds || []).includes(store.state.userInfo.uid)) {
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
          if (res.includes(spileText) && replaceMsgItems.length) {
            str = res.replace(spileText, replaceMsgItems[0].showContent);
          } else {
            str = res;
          }
        }
      } else {
        const replaceMsgItems =
          systemNotifyInfo?.otherUserNotifyInfo?.replaceMsgItems;
        const spileText = systemNotifyInfo?.otherUserNotifyInfo?.spileText;
        const msgText = t(systemNotifyInfo?.otherUserNotifyInfo?.msgText || '');
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
export const formatMsg = (
  msgText: string,
  t: { (key: string | number): string }
) => {
  try {
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
  } catch (error) {
    return '';
  }
};

const switchMsg: (
  item: IMsgInfo<TMsgContent>,
  t: { (key: string | number): string },
  store: Store<initStore>,
  yUserInfo?: IUserInfo,
  groupUserInfos?: IUserInfo[],
  msgItem?: ImsgItem | undefined,
  lock?: boolean
) => string = (
  item: IMsgInfo<TMsgContent>,
  t: { (key: string | number): string },
  store: Store<initStore>,
  yUserInfo?: IUserInfo,
  groupUserInfos?: IUserInfo[],
  msgItem?: ImsgItem | undefined,
  lock?: boolean
) => {
  // // 格式化 systemNotifyInfo
  // const systemNotifyInfo = useSystemNotifyInfo(store, t);
  // const userName = '';
  // let fireInfo, infoList;
  // 阅后即焚
  if (Number(item.msgShowType) === 3 && item.type === 'stringContent') {
    return t('[阅后即焚]');
  }

  // 处理@信息 和 回复消息
  if (msgItem) {
    const readList = msgItem.readList;
    const unReadNum = msgItem.unReadNum;
    const length = readList.length;
    const newList = readList
      .slice(length - unReadNum, length)
      .sort((a, b) => b.msgId - a.msgId);
    const hasAtAndReplyList = newList.filter((e) => {
      if (e.type === 'groupAtInfo') {
        // 处理@消息
        if (!e.replyMsgId) {
          const atUsers = e.msgContent?.groupAtInfo?.atUsers;
          if (!atUsers || !atUsers.length) return false;
          if (atUsers[0].type === 1) {
            return true;
          }
          if (Number(atUsers[0].uid) === Number(store.state.userInfo.uid)) {
            return true;
          }
        } else {
          // 处理回复消息
          if (Number(e.replyToId) === Number(store.state.userInfo.uid)) {
            return true;
          }
        }
      } else {
        if (e.replyMsgId) {
          // 处理回复消息
          if (Number(e.replyToId) === Number(store.state.userInfo.uid)) {
            return true;
          }
        }
      }
      return false;
    });

    if (hasAtAndReplyList.length) {
      // 判断第一条数据
      // 只有回复消息才有 replyMsgId 字段
      const fristMsg = hasAtAndReplyList[0];

      if (fristMsg.replyMsgId && !lock) {
        return t('有回复你的消息');
      }
      if (fristMsg.replyMsgId && lock) {
        return matchType(fristMsg, t, store);
      }
      if (!fristMsg.replyMsgId) {
        return t('有提到你的信息');
      }
    }
  }

  return matchType(item, t, store);
};

// 匹配类型
function matchType(
  item: IMsgInfo<TMsgContent>,
  t: { (key: string | number): string },
  store: Store<initStore>
) {
  // 格式化 systemNotifyInfo
  const systemNotifyInfo = useSystemNotifyInfo(store, t);
  const userName = '';
  switch (item.type || (item.msgContent && item.msgContent.msgContent)) {
    case 'stringContent':
      return item.msgContent.stringContent as string;
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
      return formatMsg(
        (item.msgContent.revokeInfo as IRevokeInfo).stringContent,
        t
      );
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
    case 'videoMsgInfo':
      return t('[视频]');
    case 'emojiInfo':
      return t('[表情]');
    default:
      return '';
  }
}

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

// 离线数据合并本地数据
const mergeData = async (
  offlineMsgInfos: IMsgInfo<TMsgContent>[],
  store: Store<initStore>,
  roamList: IMsgInfo<TMsgContent>[]
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
  isGroupMsg = 0
) => {
  return async (
    msgId: number,
    fromId: number,
    toId: number,
    isOffLine: number
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
  t: { (key: string | number): string }
) => {
  return async (msg: any) => {
    // 时间多于两分钟的不可以撤回
    if (Date.now() - msg.msgTime * 1000 > 120000) {
      return Toast('只能撤回两分钟内的消息');
    }
    const res = {
      msgId: msg.msgId,
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 2007,
      encryption: 'Aoelailiao.Message.ClientRevokeMsgReq',
      auth: true,
    });
    Toast(t(data.body.resultString));
  };
};

// 删除消息
const useDelMsg = (
  store: Store<initStore>,
  t: { (key: string | number): string }
) => {
  return async (msg: any) => {
    const res = {
      msgIds: [msg.msgId],
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 2167,
      encryption: 'Aoelailiao.Message.DeleteMsgReq',
      auth: true,
    });

    Toast(t(data.body.resultString));
    if (data.body.resultCode === 0) {
      const msgList = store.state.msgList;
      // 处理删除消息
      const msgInfo = msgList[msg.toId] || msgList[msg.fromId];

      const readList = msgInfo?.readList || [];
      const delKey = readList.findIndex(
        (e: any) => Number(e.msgId) === Number(msg.msgId)
      );

      readList.splice(delKey, 1);
      // 如果删除的是最后一条 则更新lastmsg
      if (delKey === readList.length) {
        msgInfo.lastMsg = readList[readList.length - 1];
      }
      store.commit('SET_MSGLIST', msgList);
      store.commit('set_Key', Math.random());
    }
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

// 添加好友和删除好友
function useToggleFriend(
  store: Store<initStore>,
  t: { (key: string | number): string },
  yUserInfo: IUserInfo,
  isDel?: boolean
) {
  return async (e: boolean) => {
    const res = {
      operateType: e ? 1 : 2,
      userInfo: {
        uid: yUserInfo.uid,
      },
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1025,
      encryption: 'Aoelailiao.Login.UserOperateFriendShipReq',
      auth: true,
    });

    return new Promise((resovle, reject) => {
      if (data.body.resultCode === 0) {
        resovle(true);
        if (isDel) {
          useDelUser(store, { id: yUserInfo.uid, isGroup: 0 });
          store.commit('DEL_MSGITEM', yUserInfo.uid);
        }
        upDateContact(store, e);
      } else {
        reject();
      }
      Toast(t(data.body.resultString));
    });
  };
}

const initRongConnect = async (
  store: Store<initStore>,
  rongIm: RCCallClient | null
) => {
  try {
    const userInfo = store.state.userInfo;
    const res: any = await getToken({
      uid: userInfo.uid,
      name: userInfo.nickname,
      portrait: userInfo.icon,
    });
    const data: any = await RongIMLib.connect(res.token);
    if (data.code === 0) {
      console.log('链接成功, 链接用户 id 为: ', data.data.userId);
      store.commit('SET_RONGIM', rongIm);
    } else {
      console.warn('链接失败, code:', data.code);
      throw new Error('链接失败, code:' + data.code);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 漫游数据
async function getRoam(store: Store<initStore>) {
  if (getUserToken()) {
    const res = await store.dispatch('postMsg', {
      query: {
        type: 0,
        uid: store.state.userInfo.uid,
      },
      cmd: 5001,
      encryption: 'Aoelailiao.Message.AtInfo',
      auth: true,
    });
    return res.body.msgInfos || [];
  }
  return [];
}

//下载文件
function saveAs(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function getBlob(url: string) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };

    xhr.send();
  });
}

function reset(store: Store<initStore>) {
  const replyData: any = computed(() => store.state.replyData);
  const activeUid: any = computed(() => store.state.activeUid);
  if (replyData.value && activeUid.value) {
    replyData.value[activeUid.value] = {
      showReplyBox: false,
      replyMsg: {},
      replyUser: '',
    };
    store.commit('SET_REPLYDATA', replyData);
    store.commit('SET_REPLYMSG', {});
  }
}

async function downloadFile(file: { url: string; name: string }) {
  const blob: any = await getBlob(file.url);
  saveAs(blob, file.name);
}

// 删除/添加好友后更新联系人列表
async function upDateContact(store: Store<initStore>, val: boolean) {
  const userInfo = store.state.userInfo;
  const item = store.state.msgList[store.state.activeUid!];
  // const item = store.state.msgList[store.state.userUid!];

  if (item) {
    item.userDetailInfo.isFriend = val ? 1 : 0;
    store.commit('SET_MSGLISTITEM', { res: item, uid: store.state.activeUid });
  }
  let list: IContacts[] = [];
  const data = await store.dispatch('postMsg', {
    query: {},
    cmd: 1009,
    encryption: 'Aoelailiao.Login.UserGetFriendsAndGroupsListReq',
    auth: true,
  });

  data.body.groupInfos.forEach((e: IGroupListItem) => {
    if (e.groupMemberLists.rootUid === Number(userInfo.uid)) {
      e.root = true;
    }
    if (e.groupMemberLists.adminUidList.includes(Number(userInfo.uid))) {
      e.admin = true;
    }
  });

  store.commit('SET_GROUPINFOS', data.body.groupInfos);
  list = data.body.friendInfos;
  list.forEach((e) => {
    e.name = (e.userAttachInfo && e.userAttachInfo.remarkName) || e.nickname;
    e.tag = getTag(e);
  });
  list.sort((a: any, b: any) => a.tag.charCodeAt() - b.tag.charCodeAt());
  store.commit('SET_CONTACT', list);
}

function useDelUser(
  store: Store<initStore>,
  item: { id: number; isGroup: number }
) {
  if (store.state.msgList[item.id]) {
    /*
      1、所有未读消息设为已读
      2、关闭消息通知
      3、取消置顶
      4、当前列表删除会话入口
      5、关闭提示弹窗
      6、删除当前操作时间点以前的所有聊天记录，并且不再同步到客户端
    */
    const selectItem = store.state.msgList[item.id];
    // delete store.state.msgList[item.id];
    selectItem.lastMsg = {};
    selectItem.readList = [];
    selectItem.unReadNum = 0;
    selectItem.isDel = true;
    selectItem.unRead = false;
    if (selectItem.isGroup) {
      selectItem.groupDetailInfo.groupAttachInfo.groupTop = 0;
      selectItem.groupDetailInfo.groupAttachInfo.groupMsgMute = 1;
    } else {
      if (selectItem?.userDetailInfo?.userInfo?.userAttachInfo) {
        selectItem.userDetailInfo.userInfo.userAttachInfo.msgTop = 0;
        selectItem.userDetailInfo.userInfo.userAttachInfo.msgMute = 1;
      } else {
        selectItem.userDetailInfo.userInfo.userAttachInfo = {};
        selectItem.userDetailInfo.userInfo.userAttachInfo.msgTop = 0;
        selectItem.userDetailInfo.userInfo.userAttachInfo.msgMute = 1;
      }
    }
    store.commit('SET_ACTIVEUID', null);
    store.dispatch('postMsg', {
      query: {
        isGroupMsg: item.isGroup,
        objectId: item.id,
        opt: 1,
      },
      cmd: 2163,
      encryption: 'Aoelailiao.Message.HideConversationReq',
      auth: true,
    });
  }
}

const useGetGroupHistoryMsg = async (store: Store<initStore>, item: ImsgItem, isPage?:boolean) => {
  if(
    !item.groupDetailInfo.groupAttachInfo.allowMemberGetHisotyMsg || 
    item?.isReadInitHisotyMsg  &&
    !!isPage
  ) return;

  const msgList = store.state.msgList
  
  const data = await store.dispatch('postMsg', {
    query: { isGroupMsg: 1, objectId:item.id, msgIdMin:item.readList[0]['msgId'], msgNum:30 },
    cmd: 2057,
    encryption: 'Aoelailiao.Message.UserGetMoreMsgInfoReq',
    auth: true,
  });
  let hisMsgList = JSON.parse(JSON.stringify(data.body.msgInfos));
  hisMsgList = hisMsgList.map((item:any, index:number) => {
    item.type = data.body.msgInfos[index].msgContent.msgContent
    return item
  })
  hisMsgList.reverse();
  item.readList = [...hisMsgList, ...item.readList];
  item.isReadInitHisotyMsg = true;
  msgList[item.id] = item
  setMsgList(msgList)
  return data.body.msgInfos.length
}


async function getUserStatus(store: Store<initStore>) {
  return await store.dispatch('postMsg', {
    query: {
      uid: store.state.activeUid,
    },
    cmd: 2191,
    encryption: 'Aoelailiao.Message.GetUserStatusReq',
    auth: true,
  });
}

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
  useDelMsg,
  useFormateTime,
  initRongConnect,
  getRoam,
  downloadFile,
  useToggleFriend,
  useDelUser,
  useGetGroupHistoryMsg,
  getUserStatus
};
