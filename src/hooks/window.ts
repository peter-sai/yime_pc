import { showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { initStore } from '@/store';
import { getMsgList, setMsgList } from '@/utils/utils';
import { Ref } from 'vue';
import { Store } from 'vuex';

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
          upDateStore(
            'msgMute',
            switchState,
            store,
            'groupMsgMute',
            res.switchState,
          );
        } else if (settingItemId === 1004) {
          // 置顶
          upDateStore('msgTop', switchState, store, 'groupTop');
        } else {
          // 设置进群权限
          upDateStore(
            'groupInviteState',
            switchState,
            store,
            'groupInviteState',
          );
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
  res: string,
  e: number,
  store: Store<initStore>,
  group: string,
  switchState?: number,
) {
  const msgList = getMsgList();
  if (msgList && msgList[store.state.activeUid!]) {
    const newMsgList = msgList[store.state.activeUid!];
    newMsgList.groupDetailInfo.groupAttachInfo[group] = e;
    if (group === 'groupMsgMute') {
      newMsgList.groupDetailInfo.groupAttachInfo[group] = switchState;
    }
    if (!newMsgList.userInfo.userAttachInfo) {
      newMsgList.userInfo.userAttachInfo = {};
    }
    newMsgList.userInfo.userAttachInfo[res] = e;
    if (group === 'groupMsgMute') {
      newMsgList.userInfo.userAttachInfo[res] = switchState;
    }
    if (newMsgList.userDetailInfo && newMsgList.userDetailInfo.userInfo) {
      newMsgList.userDetailInfo.userInfo = newMsgList.userInfo;
    }
    msgList[store.state.activeUid!] = newMsgList;
    setMsgList(msgList);
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

export {
  useUserOperateGroupInfo,
  useBeforeSwitch,
  groupInviteState,
  upDateStore,
};
