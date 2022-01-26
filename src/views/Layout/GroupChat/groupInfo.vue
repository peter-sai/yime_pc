<template>
  <div class="groupInfo">
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
            groupDetailInfo?.groupNoticeInfo.groupNoticeContent ||
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
                  !Boolean(groupDetailInfo?.groupAttachInfo.groupMsgMute)
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
                :switch="Boolean(groupDetailInfo?.groupAttachInfo.groupTop)"
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
              props.groupDetailInfo?.groupAttachInfo.groupInviteState !== 1 &&
              props.groupDetailInfo?.groupAttachInfo.groupInviteState !== 2
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
            v-if="props.groupDetailInfo?.groupAttachInfo.groupInviteState !== 2"
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
            @click="Toast(t('为了您的帐户安全，请用手机app进行群设置'))"
          >
            <template v-slot:left>
              <Iconfont name="iconyaoqinghaoyou" size="15" />
            </template>
          </Table>
        </div>
        <div
          class="info"
          v-if="props.groupDetailInfo?.groupAttachInfo.groupInviteState !== 2"
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
              :title="item?.userAttachInfo?.remarkName || item.nickname"
              :sub-title="item.onlineState ? t('在线') : t('离线')"
              v-for="item in groupMemberUserInfos"
              :key="item.uid"
            >
              <template v-slot:userImg>
                <img v-if="item.icon" class="userImg" :src="item.icon" alt="" />
                <Iconfont
                  v-else
                  name="iconlianxiren"
                  size="45"
                  color="#A8B5BE"
                />
              </template>
              <template
                v-slot:right
                v-if="(isRoot || isAdmin) && !item.isRoot && !item.isAdmin"
              >
                <div class="del" @click="del(item)">{{ t('删除') }}</div>
              </template>
            </TableDouble>
          </div>
        </div>
      </div>
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
import { getMsgList, getStorage, getTag, setMsgList } from '@/utils/utils';
import {
  groupInviteState,
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
  }>,
) {
  const groupMemberUids =
    props.groupDetailInfo?.groupMemberLists.memberUserInfos.map(
      (e) => e.memberUid,
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
  type: number,
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
const emit = defineEmits(['changeTag', 'toggleBox']);

const isRoot = ref(false);
const isAdmin = ref(false);
const { t } = useI18n();
const store = useStore(key);
const groupMemberUserInfos: Ref<IUserInfo[]> = ref([]);
const shareLink = ref('');
const inGroupType = ref('');
const groupAttachInfo: Ref<IGroupAttachInfo> = ref({}) as Ref<IGroupAttachInfo>;
groupAttachInfo.value = props.groupDetailInfo
  ?.groupAttachInfo as IGroupAttachInfo;
inGroupType.value = groupInviteState(
  props.groupDetailInfo?.groupAttachInfo.groupInviteState,
  t,
);

// 群管理员
const adminUidList = props.groupDetailInfo?.groupMemberLists.adminUidList || [];
// 判断是否是群主
const userInfo = store.state.userInfo;
if (
  Number(userInfo.uid) ===
  Number(props.groupDetailInfo?.groupMemberLists.rootUid)
) {
  isRoot.value = true;
}
if (adminUidList.includes(Number(userInfo.uid))) {
  isAdmin.value = true;
}

// 消息通知
const beforeMsgNotdisturb = useBeforeSwitch(store, 1005, t, true);

// 置顶
const beforeTop = useBeforeSwitch(store, 1004, t);

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
    1,
  );
  const linkUrl = getLongLink.body.linkUrl;

  // 转换为短链接
  const getLink = await linkChange(
    store,
    `${linkUrl}&s=${store.state.userInfo.uid}&t=${parseInt(
      (Date.now() / 1000).toString(),
    )}`,
    0,
  );
  shareLink.value = getLink.body.linkUrl;
}

init();

// 删除
const del = async (e: IUserInfo) => {
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
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.groupInfo {
  height: 100%;
  padding-bottom: 40px;
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
    }
    .subTitle {
      width: 252px;
      height: 51px;
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
          &:hover .del {
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
        }
      }
    }
  }
}
</style>
