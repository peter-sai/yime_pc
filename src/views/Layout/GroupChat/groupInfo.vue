<template>
  <div class="groupInfo" @click="showMenu = false">
    <NavigationBar :title="t('群资料')" hide-left disable-left>
      <template v-slot:left>
        <Iconfont
          class="pointer"
          @click="$emit('toggleBox')"
          name="iconfork"
          size="20"
        />
      </template>
      <template v-slot:right v-if="isRoot || isAdmin">
        <Iconfont
          @click="$emit('changeTag', Etag.EditGroup)"
          class="pointer"
          name="iconfankui"
          size="20"
        />
      </template>
    </NavigationBar>
    <div style="flex: 1; height: 100%; overflow: auto">
      <div class="header">
        <div class="userImg">
          <img
            v-if="groupDetailInfo?.groupIcon"
            :src="groupDetailInfo?.groupIcon"
            alt=""
          />
          <span v-else>{{
            groupDetailInfo?.groupName
              ? groupDetailInfo?.groupName.substr(0, 1).toLocaleUpperCase()
              : ''
          }}</span>
        </div>
        <div class="title">{{ groupDetailInfo?.groupName }}</div>
        <div class="subTitle">
          {{
            groupDetailInfo?.groupNoticeInfo?.groupNoticeContent ||
            t('暂无群公告')
          }}
        </div>
      </div>
      <div class="main">
        <!-- table -->
        <div>
          <Table title="消息通知" hide-more>
            <template v-slot:left>
              <Iconfont name="icontongzhi" size="15" />
            </template>
            <template v-slot:right>
              <Switch
                :beforeChange="beforeMsgNotdisturb"
                :switch="
                  !Boolean(groupDetailInfo?.groupAttachInfo?.groupMsgMute)
                "
              />
            </template>
          </Table>
          <Table
            :title="`@${t('我时显示通知')}`"
            hide-more
            v-if="Boolean(groupDetailInfo?.groupAttachInfo?.groupMsgMute)"
          >
            <template v-slot:left>
              <Iconfont name="icontongzhi" size="15" />
            </template>
            <template v-slot:right>
              <Switch
                :beforeChange="beforeGroopMsgAtNotdisturb"
                :switch="
                  Boolean(groupDetailInfo?.groupAttachInfo?.groupMsgAtNotify)
                "
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
                :switch="Boolean(groupDetailInfo?.groupAttachInfo?.groupTop)"
              />
            </template>
          </Table>
          <Table
            title="加群方式"
            :hideMore="!isRoot && !isAdmin"
            @click="
              (isRoot || isAdmin) && $emit('changeTag', Etag.AddGroupType)
            "
          >
            <template v-slot:left>
              <Iconfont name="iconyaoqinghaoyou" size="15" />
            </template>
            <template v-slot:right>
              <div class="right">
                {{ inGroupType }}
              </div>
            </template>
          </Table>
          <Table
            v-if="
              props.groupDetailInfo?.groupAttachInfo?.groupInviteState !== 1 &&
              props.groupDetailInfo?.groupAttachInfo?.groupInviteState !== 2
            "
            title="群链接"
            class="copyGroup"
            :data-clipboard-text="groupDetailInfo?.qrCode"
          >
            <template v-slot:left>
              <Iconfont name="iconbianzu4" size="15" />
            </template>
            <template v-slot:right>
              <div class="right">{{ groupDetailInfo?.qrCode }}</div>
            </template>
          </Table>
          <Table
            title="邀请链接"
            v-if="
              props.groupDetailInfo?.groupAttachInfo?.groupInviteState !== 2
            "
          >
            <template v-slot:left>
              <Iconfont name="iconbianzu6" size="15" />
            </template>
            <template v-slot:right>
              <Iconfont
                class="pointer copyGroup"
                name="iconfuzhi"
                :data-clipboard-text="shareLink"
                size="15"
                color="#0085FF"
              />
            </template>
          </Table>
          <Table
            title="群管理"
            v-if="isRoot || isAdmin"
            @click="$emit('changeTag', Etag.GroupSetting)"
          >
            <template v-slot:left>
              <Iconfont name="iconyaoqinghaoyou" size="15" />
            </template>
          </Table>
        </div>
        <div
          class="info"
          v-if="props.groupDetailInfo?.groupAttachInfo?.groupInviteState !== 2"
        >
          {{ t('邀请链接复制后60分钟有效') }}
        </div>
        <!-- button -->
        <div class="btn" @click="quitGroupChat">{{ t('退出群聊') }}</div>
        <!-- groupInfo -->
        <div class="groupInfo">
          <div class="title">
            <div class="titleLeft">{{ t('群成员') }}</div>
            <div
              class="titleRight"
              @click="$emit('changeTag', Etag.AddGroupMembers)"
            >
              <Iconfont
                name="iconyaoqinghaoyoubeifen"
                class="pointer"
                size="18"
              />
            </div>
          </div>
          <!-- 群列表 -->
          <div class="groupList">
            <TableDouble
              @contextmenu="contextmenu($event, item)"
              :title="item?.userAttachInfo?.remarkName || item.nickname"
              :sub-title="item.onlineState ? t('在线') : t('离线')"
              @click="userClick(item.uid)"
              v-for="item in groupMemberUserInfos"
              :key="item.uid"
              :style="{
                cursor: item.uid !== store.state.userInfo.uid ? 'pointer' : '',
              }"
            >
              <template v-slot:userImg>
                <Iconfont v-if="item.isBotUser" name="iconbianzu16" size="45" />
                <img
                  v-else-if="item.icon"
                  class="userImg"
                  :src="item.icon"
                  alt=""
                />
                <Iconfont
                  v-else
                  name="iconlianxiren"
                  size="45"
                  color="#A8B5BE"
                />
              </template>
              <template v-slot:right v-if="item.isRoot">
                <div class="root">{{ t('群主') }}</div>
              </template>
              <template v-slot:right v-else-if="item.isAdmin">
                <div class="admin">{{ t('管理') }}</div>
              </template>
              <!-- <template
                v-slot:right
                v-if="(isRoot || isAdmin) && !item.isRoot && !item.isAdmin"
              >
                <div class="del" @click.stop="del(item)">{{ t('删除') }}</div>
              </template> -->
            </TableDouble>
          </div>
        </div>
      </div>
    </div>

    <div
      class="menu"
      v-if="showMenu && !rightClickItem.isRoot"
      @contextmenu="(e) => e?.preventDefault()"
      :style="style"
    >
      <span
        v-if="isRoot && !rightClickItem.isAdmin"
        @click="addAdmin(rightClickItem)"
        class="copyMsg"
        >{{ t('设为管理员') }}</span
      >
      <span
        v-else-if="isRoot && rightClickItem.isAdmin"
        class="copyMsg"
        @click="closeAdmin(rightClickItem)"
        >{{ t('取消管理员') }}</span
      >
      <span
        v-if="isRoot"
        class="copyMsg"
        @click="groupOwnerTransfer(rightClickItem)"
        >{{ t('转让群主') }}</span
      >
      <span
        v-if="isRoot || (isAdmin && !rightClickItem.isAdmin)"
        class="copyMsg"
        @click="del(rightClickItem)"
        >{{ t('移出') }}</span
      >
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineEmits, defineProps, PropType } from 'vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import TableDouble from '@/components/TableDouble/index.vue';
import Switch from '@/components/Switch/index.vue';
import Iconfont from '@/iconfont/index.vue';
import { Etag } from '../index.vue';
import {
  IContacts,
  IGroupAttachInfo,
  IGroupInfo,
  IUserInfo,
} from '@/types/user';
import { useI18n } from 'vue-i18n';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';
import { ref, Ref, onMounted, onUnmounted } from 'vue';
import ClipboardJS from 'clipboard';
import { Toast } from '@/plugin/Toast';
import {
  groupInviteState as getGroupInviteState,
  useUserOperateGroupInfo,
  useBeforeSwitch,
} from '@/hooks/window';
import { Dialog } from '@/plugin/Dialog';
import { IGroupListItem } from '@/types/group';
export default defineComponent({
  name: 'groupInfo',
});
// 获取群成员详情
async function getGroupMemberUserInfos(
  store: Store<initStore>,
  groupMemberUserInfos: Ref<IUserInfo[]>,
  props: Readonly<{
    groupDetailInfo?: IGroupInfo | undefined;
  }>
) {
  const groupMemberUids =
    props.groupDetailInfo?.groupMemberLists?.memberUserInfos.map(
      (e) => e.memberUid
    );
  const res = await store.dispatch('postMsg', {
    query: { uid: groupMemberUids },
    cmd: 1115,
    encryption: 'Aoelailiao.Login.ClientGetUserInfoListReq',
    auth: true,
  });

  groupMemberUserInfos.value = (res.body.userInfo || []).map((e: any) => {
    e.isRoot = false;
    e.isAdmin = false;
    if (
      Number(e.uid) === Number(props.groupDetailInfo?.groupMemberLists.rootUid)
    ) {
      e.isRoot = true;
    }
    if (
      props.groupDetailInfo?.groupMemberLists?.adminUidList?.includes(e.uid)
    ) {
      e.isAdmin = true;
    }
    return e;
  });
}

// 链接转换
async function linkChange(
  store: Store<initStore>,
  linkUrl: string,
  type: number
) {
  const data = await store.dispatch('postMsg', {
    query: {
      type,
      linkUrl,
    },
    cmd: 1199,
    encryption: 'Aoelailiao.Login.UserShortLinkConvertReq',
    auth: true,
  });
  return data;
}
</script>
<script setup lang="ts">
let clipboard: any = null;
onMounted(() => {
  //  复制
  clipboard = new ClipboardJS('.copyGroup');
  clipboard.on('success', () => {
    Toast(t('复制成功'));
  });
});

onUnmounted(() => {
  clipboard && clipboard.destroy();
});
const props = defineProps({
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
});

const emit = defineEmits(['changeTag', 'toggleBox', 'updateUser']);

const isRoot = ref(false);
const isAdmin = ref(false);
const { t } = useI18n();
const store = useStore(key);
const groupMemberUserInfos: Ref<IUserInfo[]> = ref([]);
const shareLink = ref('');
const inGroupType = ref('');

const showMenu = ref(false);
const rightClickItem = ref({}) as Ref<IUserInfo>;
const style: Ref<any> = ref({});
const contextmenu = (e: any, item: IUserInfo) => {
  if (!isRoot.value && !isAdmin.value) return;

  if (90 + e.pageX > window.innerWidth && 90 + e.pageY > window.innerHeight) {
    style.value.right = 0;
    style.value.bottom = 0;
    style.value.left = 'auto';
    style.value.top = 'auto';
  } else if (90 + e.pageX > window.innerWidth) {
    style.value.right = 0;
    style.value.top = e.pageY + 'px';
    style.value.left = 'auto';
    style.value.bottom = 'auto';
  } else if (90 + e.pageY > window.innerHeight) {
    style.value.bottom = 0;
    style.value.left = e.pageX + 'px';
    style.value.right = 'auto';
    style.value.top = 'auto';
  } else {
    style.value.left = e.pageX + 'px';
    style.value.top = e.pageY + 'px';
    style.value.bottom = 'auto';
    style.value.right = 'auto';
  }
  e?.preventDefault();
  showMenu.value = true;
  rightClickItem.value = item;
};

const groupAttachInfo: Ref<IGroupAttachInfo> = ref({}) as Ref<IGroupAttachInfo>;
groupAttachInfo.value = props.groupDetailInfo
  ?.groupAttachInfo as IGroupAttachInfo;
inGroupType.value = getGroupInviteState(
  props.groupDetailInfo?.groupAttachInfo?.groupInviteState,
  t
);

// 群管理员
const adminUidList =
  props.groupDetailInfo?.groupMemberLists?.adminUidList || [];
// 判断是否是群主
const userInfo = store.state.userInfo;
if (
  Number(userInfo.uid) ===
  Number(props.groupDetailInfo?.groupMemberLists?.rootUid)
) {
  isRoot.value = true;
}
if (adminUidList.includes(Number(userInfo.uid))) {
  isAdmin.value = true;
}

// @我时显示通知
const beforeGroopMsgAtNotdisturb = useBeforeSwitch(store, 2108, t);

// 消息通知
const beforeMsgNotdisturb = useBeforeSwitch(store, 1005, t, true);

// 置顶
const beforeTop = useBeforeSwitch(store, 1004, t);

const userClick = (uid: number) => {
  if (uid === store.state.userInfo.uid) return;

  if (props.groupDetailInfo?.groupAttachInfo?.groupMemberSplit) {
    return Toast('群员不能互相访问详情，请咨询管理员');
  }
  emit('updateUser', uid);
  emit('changeTag', Etag.UserInfo);
};

// 删除群聊
const userOperateGroupInfo = useUserOperateGroupInfo(store);
const quitGroupChat = async () => {
  if (isRoot.value) {
    return Toast(t('请前往解散群'));
  }
  Dialog({
    title: t('退出群聊') + '?',
    callBack: async () => {
      const query = {
        groupId: store.state.activeUid,
      };
      const data = await userOperateGroupInfo(3, query);
      Toast(t(data.body.resultString));
      if (data.body.resultCode === 0) {
        emit('toggleBox');

        if (store.state.msgList[store.state.activeUid!]) {
          store.dispatch('postMsg', {
            query: {
              isGroupMsg: store.state.activeIsGroup ? 1 : 0,
              objectId: store.state.activeUid,
              opt: 1,
            },
            cmd: 2163,
            encryption: 'Aoelailiao.Message.HideConversationReq',
            auth: true,
          });
          delete store.state.msgList[store.state.activeUid!];
          store.commit('SET_ACTIVEUID', null);
        }

        const data1 = await store.dispatch('postMsg', {
          query: {},
          cmd: 1009,
          encryption: 'Aoelailiao.Login.UserGetFriendsAndGroupsListReq',
          auth: true,
        });

        data1.body.groupInfos.forEach((e: IGroupListItem) => {
          if (e.groupMemberLists.rootUid === Number(userInfo.uid)) {
            e.root = true;
          }
          if (e.groupMemberLists.adminUidList.includes(Number(userInfo.uid))) {
            e.admin = true;
          }
        });

        store.commit('SET_GROUPINFOS', data1.body.groupInfos);
      }
    },
  });
};

async function init() {
  getGroupMemberUserInfos(store, groupMemberUserInfos, props);
  // 链接转换 (转换为长链接)
  const getLongLink = await linkChange(
    store,
    props.groupDetailInfo?.qrCode as string,
    1
  );
  const linkUrl = getLongLink.body.linkUrl;

  // 转换为短链接
  const getLink = await linkChange(
    store,
    `${linkUrl}&s=${store.state.userInfo.uid}&t=${parseInt(
      (Date.now() / 1000).toString()
    )}`,
    0
  );
  shareLink.value = getLink.body.linkUrl;
}

init();

// 删除
const del = async (e: IUserInfo) => {
  showMenu.value = false;
  const query = {
    groupId: store.state.activeUid,
    groupMemberLists: {
      memberUserInfos: [{ memberUid: e.uid }],
    },
  };

  const data = await userOperateGroupInfo(5, query);
  Toast(t(data.body.resultString));
  if (data.body.resultCode === 0) {
    const data = await store.dispatch('postMsg', {
      query: {
        groupId: store.state.activeUid,
      },
      cmd: 1029,
      encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
      auth: true,
    });
    const msgItem = data.body;
    const item = store.state.msgList[store.state.activeUid!];
    item.groupDetailInfo = msgItem.groupDetailInfo;
    store.commit('SET_MSGLISTITEM', { res: item });
    emit('toggleBox');
  }
};

// 添加群管理
const addAdmin = async (e: IUserInfo) => {
  showMenu.value = false;
  const query = {
    operateType: 6,
    groupInfo: {
      groupId: store.state.activeUid,
      groupMemberLists: {
        adminUidList: [
          ...(props.groupDetailInfo?.groupMemberLists?.adminUidList || []),
          e.uid,
        ],
      },
    },
  };
  const data = await store.dispatch('postMsg', {
    query,
    cmd: 1027,
    encryption: 'Aoelailiao.Login.UserOperateGroupInfoReq',
    auth: true,
  });
  if (data.body.resultCode === 0) {
    emit('toggleBox');
    uploadGroupInfo();
  }
  Toast(t(data.body.resultString));
};

// 取消群管理
const closeAdmin = async (e: IUserInfo) => {
  showMenu.value = false;
  const adminList =
    props.groupDetailInfo?.groupMemberLists?.adminUidList.filter(
      (v) => v !== e.uid
    );
  const query = {
    operateType: 6,
    groupInfo: {
      groupId: store.state.activeUid,
      groupMemberLists: {
        adminUidList: adminList,
      },
    },
  };
  const data = await store.dispatch('postMsg', {
    query,
    cmd: 1027,
    encryption: 'Aoelailiao.Login.UserOperateGroupInfoReq',
    auth: true,
  });
  if (data.body.resultCode === 0) {
    emit('toggleBox');
    uploadGroupInfo();
  }
  Toast(t(data.body.resultString));
};

// 群主转让
const groupOwnerTransfer = async (item: IUserInfo) => {
  showMenu.value = false;
  Dialog({
    title: `确定选择 ${item.nickname} 为新群主, 您将主动放弃群主身份`,
    callBack: async () => {
      const res = {
        operateType: 7,
        groupInfo: {
          groupId: store.state.activeUid,
          groupMemberLists: {
            rootUid: item.uid,
          },
        },
      };
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 1027,
        encryption: 'Aoelailiao.Login.UserOperateGroupInfoReq',
        auth: true,
      });
      Toast(t(data.body.resultString));
      if (data.body.resultCode === 0) {
        emit('toggleBox');
        uploadGroupInfo();
      }
    },
  });
};

// 更新群信息
async function uploadGroupInfo() {
  const data = await store.dispatch('postMsg', {
    query: {
      groupId: store.state.activeUid,
    },
    cmd: 1029,
    encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
    auth: true,
  });
  const { msgList, activeUid } = store.state;
  const msgItem = msgList[activeUid!];
  msgItem.groupDetailInfo = data.body.groupDetailInfo;
  store.commit('SET_MSGLISTITEM', { res: msgItem });
}
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.groupInfo {
  height: 100%;
  padding-bottom: 40px;
  .menu {
    position: fixed;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    box-sizing: border-box;
    // padding: 8px 5px;
    span {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      width: 80px;
      color: #333333;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      padding: 3px 0;
      margin: 2px 0;
      line-height: 17px;
      &:hover {
        background: #0085ff;
        color: #fff;
      }
    }
  }
  .iconfont {
    &.pointer {
      cursor: pointer;
    }
  }
  .header {
    text-align: center;
    .userImg {
      margin: 22px 0 8px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #f0f0f0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      span {
        color: #0085ff;
        font-size: 32px;
      }
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .title {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #2b2c33;
      line-height: 20px;
      letter-spacing: 0px;
      max-width: 90%;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .subTitle {
      width: 252px;
      // height: 51px;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #929292;
      line-height: 17px;
      text-align: left;
      text-align: center;
      margin: 5px auto 15px;
    }
  }
  .main {
    .table {
      border-bottom: 1px solid #ededed;
      padding: 17px 20px;
      .right {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: right;
        color: #929292;
        line-height: 20px;
      }
    }
    .info {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #929292;
      line-height: 17px;
      margin: 8px 20px 13px;
    }
    .btn {
      margin: 0 auto;
      width: 280px;
      height: 34px;
      border: 1px solid #bdbdbd;
      border-radius: 6px;
      color: #fa5151;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .groupInfo {
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 320px;
        height: 30px;
        background: #f0f1f4;
        margin: 25px 0 15px;
        padding: 0 20px;
        box-sizing: border-box;
        .titleLeft {
          height: 17px;
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #2b2c33;
          line-height: 17px;
        }
      }
      .groupList {
        .tableDouble {
          padding: 13px 20px;
          position: relative;
          &:hover {
            background: #f9f9f9;
          }
          &:after {
            @include tableBottomLine;
          }
          .userImg {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            overflow: hidden;
          }
          .del {
            font-size: 12px;
            cursor: pointer;
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            color: #2b2c33;
            width: 42px;
            height: 18px;
            border: 1px solid #2b2c33;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .root {
            font-size: 12px;
            cursor: pointer;
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            color: #0085ff;
            width: 42px;
            height: 18px;
            border: 1px solid #0085ff;
            border-radius: 3px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .admin {
            font-size: 12px;
            cursor: pointer;
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            color: #dc734b;
            width: 42px;
            height: 18px;
            border: 1px solid #dc734b;
            border-radius: 3px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
