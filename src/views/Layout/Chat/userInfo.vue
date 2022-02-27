<template>
  <div class="userInfo">
    <NavigationBar hide-left title="">
      <template v-slot:left>
        <div class="title">{{ t('用户资料') }}</div>
      </template>
      <template v-slot:right>
        <Iconfont @click="$emit('toggleBox')" name="iconfork" size="20" />
      </template>
    </NavigationBar>
    <div style="flex: 1; padding: 0 20px; height: 90%; overflow: auto">
      <div class="header">
        <div class="left">
          <Iconfont v-if="yUserInfo?.isBotUser" name="iconbianzu16" size="60" />
          <img v-else-if="yUserInfo?.icon" :src="yUserInfo?.icon" alt="" />
          <Iconfont v-else name="iconlianxiren" size="60" color="#A8B5BE" />
        </div>
        <div class="right">
          <div class="userName">{{ yUserInfo?.nickname }}</div>
          <div class="phone">
            <Iconfont name="iconshoujihaoma" size="10" color="#929292" />
            {{ t(userDetailInfo?.phone || '') }}
          </div>
          <div class="uid">
            <div class="icon">ID</div>
            {{ yUserInfo?.imAccount }}
          </div>
          <!-- 按钮 -->
          <div class="btn" @click="send">{{ t('发消息') }}</div>
        </div>
      </div>
      <div class="main">
        <Table
          v-if="!yUserInfo?.isBotUser"
          :title="onLineStatus.onlineState ? '在线' : '离线'"
          hide-more
        >
          <template v-slot:left>
            <div
              class="point"
              :class="{
                onLine: onLineStatus.onlineState,
              }"
            />
          </template>
        </Table>
        <Table title="保存联系人" hide-more>
          <template v-slot:left>
            <Iconfont name="iconlianxiren1" size="15" />
          </template>
          <template v-slot:right>
            <Switch
              :beforeChange="toggleFriend"
              :switch="Boolean(userDetailInfo?.isFriend)"
            />
          </template>
        </Table>
        <Table title="消息通知" hide-more>
          <template v-slot:left>
            <Iconfont name="icontongzhi" size="15" />
          </template>
          <template v-slot:right>
            <Switch
              :beforeChange="beforeMsgNotdisturb"
              :switch="!Boolean(yUserInfo?.userAttachInfo?.msgMute)"
            />
          </template>
        </Table>
        <Table v-if="!yUserInfo?.isBotUser" title="截屏通知" hide-more>
          <template v-slot:left>
            <Iconfont name="iconjieping" size="15" />
          </template>
          <template v-slot:right>
            <Switch
              :beforeChange="beforeCaptureNotifica"
              :switch="Boolean(yUserInfo?.userAttachInfo?.msgScreenShotNotify)"
            />
          </template>
        </Table>
        <Table title="置顶" hide-more>
          <template v-slot:left>
            <Iconfont name="iconzhiding" size="15" />
          </template>
          <template v-slot:right>
            <Switch
              :beforeChange="beforeTop"
              :switch="Boolean(yUserInfo?.userAttachInfo?.msgTop)"
            />
          </template>
        </Table>
        <div v-if="!yUserInfo?.isBotUser">
          <p class="info">{{ t('群聊') }}</p>
          <Table title="共同群聊" @click="$emit('changeTag', Etag.CommonGroup)">
            <template v-slot:left>
              <Iconfont name="iconqunliao" size="15" />
            </template>
          </Table>
          <Table
            title="与好友新建群聊"
            @click="$emit('changeTag', Etag.CreateGroupChat)"
          >
            <template v-slot:left>
              <Iconfont name="iconyaoqinghaoyou" size="15" />
            </template>
          </Table>
          <Table title="云文件" @click="$emit('changeTag', Etag.CloudFile)">
            <template v-slot:left>
              <Iconfont name="iconyunwenjian" size="15" />
            </template>
          </Table>
          <Table title="双向清除聊天记录" @click="clientCleanMsg">
            <template v-slot:left>
              <Iconfont name="iconshuangxiangsudicopy" size="15" />
            </template>
          </Table>
          <Table title="加入黑名单" hide-more>
            <template v-slot:left>
              <Iconfont name="iconheimingdan" size="15" />
            </template>
            <template v-slot:right>
              <Switch
                :beforeChange="beforeBlacklist"
                :switch="Boolean(userDetailInfo?.isInMyBlacklist)"
              />
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  defineEmits,
  defineProps,
  PropType,
  Ref,
  ref,
} from 'vue';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';
import { Toast } from '@/plugin/Toast';
import NavigationBar from '@/components/NavigationBar/index.vue';
import Iconfont from '@/iconfont/index.vue';
import { IContacts, IUserDetailInfo, IUserInfo } from '@/types/user';
import Table from '@/components/Table/index.vue';
import Switch from '@/components/Switch/index.vue';
import { Etag } from '../index.vue';
import { useI18n } from 'vue-i18n';
import { getMsgList, getTag, setMsgList } from '@/utils/utils';
import { hideLoading, showLoading } from '@/plugin/Loading';
import { Dialog } from '@/plugin/Dialog';
import { IGroupListItem } from '@/types/group';

export default defineComponent({
  name: 'userInfo',
});

// 添加好友和删除好友
function useToggleFriend(
  store: Store<initStore>,
  t: { (key: string | number): string },
  yUserInfo: IUserInfo,
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
        upDateContact(store, e);
        resovle(true);
      } else {
        reject();
      }
      Toast(t(data.body.resultString));
    });
  };
}

// 用户操作设置项的开关
function useBeforeSwitch(
  store: Store<initStore>,
  settingItemId: number,
  t: { (key: string | number): string },
  yUserInfo: IUserInfo,
  isBack?: boolean,
) {
  return async (e: boolean) => {
    const res = {
      objectType: 1,
      objectId: yUserInfo.uid,
      settingItemId,
      switchState: e ? 1 : 0,
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

    hideLoading();
    return new Promise((resovle, reject) => {
      if (data.body.resultCode === 0) {
        // 更新缓存
        if (settingItemId === 1005) {
          // 消息免打扰
          upDateStore('msgMute', Number(e), store, isBack);
        } else if (settingItemId === 1004) {
          // 置顶
          upDateStore('msgTop', Number(e), store, isBack);
        } else if (settingItemId === 1003) {
          // 截屏通知
          upDateStore('msgScreenShotNotify', Number(e), store, isBack);
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
async function upDateStore(
  res: string,
  e: number,
  store: Store<initStore>,
  isBack: boolean | undefined,
) {
  const msgList = store.state.msgList;

  if (msgList && msgList[store.state.activeUid!]) {
    const newMsgList = msgList[store.state.activeUid!];
    if (!newMsgList.userDetailInfo.userInfo.userAttachInfo) {
      newMsgList.userDetailInfo.userInfo.userAttachInfo = {};
    }
    newMsgList.userDetailInfo.userInfo.userAttachInfo[res] = e ? 1 : 0;
    if (isBack) {
      newMsgList.userDetailInfo.userInfo.userAttachInfo[res] = e ? 0 : 1;
    }

    store.commit('SET_MSGLISTITEM', { res: newMsgList });
  }
}

// 删除/添加好友后更新联系人列表
async function upDateContact(store: Store<initStore>, val: boolean) {
  const userInfo = store.state.userInfo;
  const item = store.state.msgList[store.state.activeUid!];
  if (item) {
    item.userDetailInfo.isFriend = val ? 1 : 0;
    store.commit('SET_MSGLISTITEM', { res: item });
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

// 操作黑名单
function useBeforeBlacklist(
  store: Store<initStore>,
  t: { (key: string | number): string },
  yUserInfo: IUserInfo,
) {
  return async (e: boolean) => {
    const res = {
      operateType: e ? 2 : 3,
      operateUid: yUserInfo.uid,
    };

    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1039,
      encryption: 'Aoelailiao.Login.UserOperateBlackListReq',
      auth: true,
    });
    Toast(t(data.body.resultString));
  };
}
</script>
<script setup lang="ts">
const emit = defineEmits(['toggleBox', 'changeTag']);
const props = defineProps({
  userDetailInfo: {
    type: Object as PropType<IUserDetailInfo>,
  },
  yUserInfo: {
    type: Object as PropType<IUserInfo>,
    required: true,
  },
});

const store = useStore(key);
const { t } = useI18n();
const onLineStatus: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>;

// 添加好友和删除好友
const toggleFriend = useToggleFriend(store, t, props.yUserInfo);

// 消息免打扰
const beforeMsgNotdisturb = useBeforeSwitch(
  store,
  1005,
  t,
  props.yUserInfo,
  true,
);

// 截屏通知
const beforeCaptureNotifica = useBeforeSwitch(store, 1003, t, props.yUserInfo);

// 置顶
const beforeTop = useBeforeSwitch(store, 1004, t, props.yUserInfo);

// 黑名单
const beforeBlacklist = useBeforeBlacklist(store, t, props.yUserInfo);

// 双向清空聊天记录
const clientCleanMsg = () => {
  Dialog({
    title: `${t('你确定要清除聊天记录')}?`,
    callBack: async () => {
      const data = await store.dispatch('postMsg', {
        query: {
          toUid: props.yUserInfo.uid,
          isGroupMsg: 0,
        },
        cmd: 2135,
        encryption: 'Aoelailiao.Message.ClientCleanMsgReq',
        auth: true,
      });
      Toast(t(data.body.resultString));
    },
  });
};

// 点击发送消息
const send = () => {
  emit('toggleBox');
  store.commit('SET_ACTIVEUID', props.yUserInfo?.uid);
  store.commit('SET_ACTIVEISGROUP', false);
};

// 获取用户在线状态
const getOnLineStatus = async () => {
  const res = {
    userOnlineState: {
      uid: props.yUserInfo.uid,
    },
  };
  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 2127,
    encryption: 'Aoelailiao.Message.UserOnlineStateNotifyReq',
    auth: true,
  });
  onLineStatus.value = data.body?.userOnlineState || {};
};
getOnLineStatus();
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.userInfo {
  height: 100%;
  .nav {
    border-bottom: 1px solid #ededed;
  }
  .title {
    font-size: 18px;
    text-align: center;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .iconfont {
    cursor: pointer;
  }
  .header {
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
    .left {
      margin-right: 15px;
      img {
        width: 60px;
        height: 60px;
        overflow: hidden;
        border-radius: 50%;
      }
    }
    .right {
      .btn {
        font-size: 12px;
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 1px;
        width: 120px;
        background: #0085ff;
        border-radius: 4px;
        display: flex;
        align-items: center;
        height: 28px;
        justify-content: center;
        margin: 20px 0;
        cursor: pointer;
      }
      .userName {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: #2b2c33;
        line-height: 20px;
        letter-spacing: 0px;
      }
      .phone {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #929292;
        line-height: 17px;
        display: flex;
        align-items: center;
        margin: 5px 0 3px;
        .iconfont {
          margin-right: 5px;
        }
      }
      .uid {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #929292;
        line-height: 17px;
        display: flex;
        align-items: center;
        .icon {
          width: 14px;
          height: 14px;
          margin-right: 5px;
          border-style: solid;
          border-width: 1px;
          @include theme('border-color', main);
          @include theme('color', main);
          font-size: 12px;
          font-weight: 600;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 1px;
        }
      }
    }
  }
  .main {
    .table {
      border-bottom: 1px solid #ededed;
      padding: 17px 0;
      .point {
        width: 10px;
        height: 10px;
        background: #ddd;
        border-radius: 50%;
        margin-right: 5px;
        &.onLine {
          background: #4ed966;
        }
      }
    }
    .info {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #2b2c33;
      height: 30px;
      background: #f0f1f4;
      display: flex;
      align-items: center;
      margin: 0 -20px;
      padding-left: 20px;
    }
  }
}
</style>
