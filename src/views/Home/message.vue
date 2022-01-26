<template>
  <div style="flex: 1" @click.stop="showMenu = 0">
    <MessageHeader @isSearch="changeIsSearch" />
    <div
      v-if="!msgList.length"
      style="position: absolute; left: 0; right: 0; bottom: 50px; top: 50px"
    >
      <Errors id="2" />
    </div>
    <div class="message" v-if="!isSearch">
      <div
        class="tableItem"
        @contextmenu="contextmenu($event, item)"
        v-for="item in msgList"
        :key="item.id"
      >
        <!-- 普通消息列表 -->
        <TableDouble
          v-if="!item.msgClassTitle"
          @click="goTo(item)"
          :hover="item.id === store.state.activeUid"
        >
          <template v-slot:title>
            <div class="title">
              <span v-if="item.isGroup">
                {{ item.groupDetailInfo?.groupName }}
              </span>
              <span v-else>{{ item.userDetailInfo?.userInfo?.nickname }}</span>
              <Iconfont
                v-if="
                  item.isGroup
                    ? item.groupDetailInfo?.groupAttachInfo?.groupTop
                    : item.userDetailInfo?.userInfo?.userAttachInfo?.msgTop
                "
                name="icondingzi"
                size="12"
                color="#B6B7BA"
              />
              <Iconfont
                v-if="
                  item.isGroup
                    ? item.groupDetailInfo?.groupAttachInfo?.groupMsgMute
                    : item.userDetailInfo?.userInfo?.userAttachInfo?.msgMute
                "
                name="iconjingyin"
                size="12"
                color="#B6B7BA"
              />
            </div>
          </template>
          <template v-slot:subTitle>
            <span
              class="subTitle at"
              :class="{
                at: getType(item.lastMsg, item) === t('有提到你的信息'),
              }"
              v-if="getType(item.lastMsg, item) === t('有提到你的信息')"
              >@{{ getType(item.lastMsg, item) }}</span
            >
            <span class="subTitle" v-else>{{
              (getType(item.lastMsg, item) || '').replace(/\u0000/g, '')
            }}</span>
          </template>
          <template v-slot:userImg>
            <div class="userImg" v-if="item.isGroup">
              {{
                item.groupDetailInfo.groupName
                  ? item.groupDetailInfo.groupName
                      .substr(0, 1)
                      .toLocaleUpperCase()
                  : ''
              }}
            </div>
            <div class="userImg" v-else>
              <Iconfont
                v-if="item?.userDetailInfo?.userInfo?.isBotUser"
                style="display: inline-block"
                name="iconbianzu16"
                size="45"
                color="#A8B5BE"
              />
              <img
                v-else-if="item?.userDetailInfo?.userInfo?.icon"
                :src="item?.userDetailInfo?.userInfo?.icon"
              />
              <Iconfont
                v-else
                name="iconlianxiren"
                style="display: inline-block"
                size="45"
                color="#A8B5BE"
              />
            </div>
          </template>
          <template v-slot:time> </template>
          <template v-slot:num v-if="item.unReadNum">
            <Badge
              :isMute="
                item.isGroup
                  ? item.groupDetailInfo?.groupAttachInfo?.groupMsgMute
                  : item.userDetailInfo?.userInfo?.userAttachInfo?.msgMute
              "
              :num="item.unReadNum"
              :hover="item.id === store.state.activeUid"
            />
          </template>
        </TableDouble>
        <!-- 系统消息 -->
        <TableDouble
          v-if="item.msgClassId === 1"
          html
          :subTitle="JSON.parse(item.msgClassRecentMsgContent).Jt"
          :title="t(item.msgClassTitle)"
          @click="store.commit('SET_ACTIVEUID', item.msgClassId)"
          :hover="item.msgClassId === store.state.activeUid"
        >
          <template v-slot:userImg>
            <div class="userImg">
              <img src="img/systemNotify.svg" alt="" />
            </div>
          </template>
          <!-- <template v-slot:time>{{ formateTime(item.updateTime) }}</template> -->
        </TableDouble>
        <!-- 反馈 -->
        <TableDouble
          v-if="item.msgClassId === 2"
          html
          :subTitle="item.msgClassRecentMsgContent"
          :title="t(item.msgClassTitle)"
          @click="store.commit('SET_ACTIVEUID', item.msgClassId)"
          :hover="item.msgClassId === store.state.activeUid"
        >
          <template v-slot:userImg>
            <div class="userImg">
              <img src="img/feedback.svg" alt="" />
            </div>
          </template>
          <!-- <template v-slot:time>{{ formateTime(item.updateTime) }}</template> -->
        </TableDouble>
        <div class="box" v-if="showMenu === item.id">
          <div class="item" @click="read(item)">
            <Iconfont name="iconbianzu9" size="15" />
            <span>{{ t('已读') }}</span>
          </div>
          <div
            class="item"
            v-if="item.isGroup"
            @click="
              beforeMsgNotdisturb(
                item.groupDetailInfo?.groupAttachInfo?.groupMsgMute,
                item,
              )
            "
          >
            <Iconfont name="iconxitongjingyin" size="12" />
            <span>{{
              item.groupDetailInfo?.groupAttachInfo?.groupMsgMute
                ? t('取消静音')
                : t('静音')
            }}</span>
            >
          </div>
          <div
            class="item"
            v-else
            @click="
              beforeMsgNotdisturb(
                item.userDetailInfo?.userInfo?.userAttachInfo?.msgMute,
                item,
              )
            "
          >
            <Iconfont name="iconxitongjingyin" size="12" />
            <span>{{
              item.userDetailInfo?.userInfo?.userAttachInfo?.msgMute
                ? t('取消静音')
                : t('静音')
            }}</span>
          </div>
          <div class="item" v-if="item.isGroup" @click="quitGroupChat(item)">
            <Iconfont name="icontuichu" size="12" />
            <span>{{ t('退出群聊') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from 'vue';
import TableDouble from '@/components/TableDouble/index.vue';
import Badge from '@/components/Badge/index.vue';
import Iconfont from '@/iconfont/index.vue';
import MessageHeader from './header.vue';
import { Store, storeKey, useStore } from 'vuex';
import Errors from '../Errors/index.vue';
import { initStore, key } from '@/store';
import { IUserInfo } from '@/types/user';
import {
  switchMsg,
  useGetOfflineMsg,
  mergeData,
  useFormateTime,
} from '@/hooks/window';
import {
  IMsgInfo,
  ImsgItem,
  INotifyClassMsgListInfo,
  TMsgContent,
} from '@/types/msg';
import { useI18n } from 'vue-i18n';
import {
  useClientSendMsgAckToServer,
  useUserOperateGroupInfo,
} from '@/hooks/window';
import { hideLoading, showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { getMsgList } from '@/utils/utils';
import { IGroupListItem } from '@/types/group';
export default defineComponent({
  name: 'message',
});
const isSearch = ref(false);

const changeIsSearch = (res: boolean) => {
  isSearch.value = res;
};

// 用户操作设置项的开关
function useBeforeSwitchChat(
  store: Store<initStore>,
  settingItemId: number,
  t: { (key: string | number): string },
) {
  return async (e: boolean, item: ImsgItem) => {
    const res = {
      objectType: item.isGroup ? 2 : 1,
      objectId: item.id,
      settingItemId,
      switchState: e ? 0 : 1,
    };
    showLoading();

    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1041,
      encryption: 'Aoelailiao.Login.UserOperateSettingItemSwitchReq',
      auth: true,
    });

    hideLoading();
    if (data.body.resultCode === 0) {
      // // 更新缓存
      if (settingItemId === 1005) {
        // 消息免打扰
        const msgList = store.state.msgList;
        if (msgList && msgList[item.id]) {
          const newMsgList = msgList[item.id];
          if (!item.isGroup) {
            if (!newMsgList.userDetailInfo.userInfo.userAttachInfo) {
              newMsgList.userDetailInfo.userInfo.userAttachInfo = {};
            }
            newMsgList.userDetailInfo.userInfo.userAttachInfo.msgMute = e
              ? 0
              : 1;
          } else {
            newMsgList.groupDetailInfo.groupAttachInfo.groupMsgMute = e ? 0 : 1;
          }
          store.commit('SET_MSGLISTITEM', { res: newMsgList, uid: item.id });
        }
      }
    }
    Toast(t(data.body.resultString));
  };
}

// 获取通知
async function userGetSystemNotice(store: Store<initStore>) {
  const data = await store.dispatch('postMsg', {
    query: {},
    cmd: 2017,
    encryption: 'Aoelailiao.Message.UserGetSystemNoticeMsgClassListReq',
    auth: true,
  });

  return data.body?.classMsgInfo.filter((e: any) => e.msgClassHaveNewMsg === 1);
}
</script>
<script setup lang="ts">
type TMsgItem = INotifyClassMsgListInfo & ImsgItem;
const { t } = useI18n();
const formateTime = useFormateTime();
const showMenu = ref(0);
const contextmenu = (e: any, item: ImsgItem) => {
  e.preventDefault();
  showMenu.value = item.id;
};

// 列表
const store = useStore(key);
const msgList: ComputedRef<TMsgItem[]> = computed(() => {
  const list: TMsgItem[] = Object.values(store.state.msgList) as TMsgItem[];
  // 区分置顶和非置顶
  let topList: TMsgItem[] = [];
  let defList: TMsgItem[] = [];
  list
    .filter((e: TMsgItem) => e.msgClassId! || (e.lastMsg && e.lastMsg.msgId))
    .forEach((e: TMsgItem) => {
      if (e.isGroup && e.groupDetailInfo?.groupAttachInfo?.groupTop) {
        topList.push(e);
      } else if (
        !e.isGroup &&
        e?.userDetailInfo?.userInfo?.userAttachInfo?.msgTop
      ) {
        topList.push(e);
      } else {
        defList.push(e);
      }
    });

  // 排序置顶和非置顶列表
  topList.sort(
    (a: TMsgItem, b: TMsgItem) =>
      (b.updateTime || b.lastMsg.msgTime) - (a.updateTime || a.lastMsg.msgTime),
  );
  defList.sort(
    (a: TMsgItem, b: TMsgItem) =>
      (b.updateTime || b.lastMsg.msgTime) - (a.updateTime || a.lastMsg.msgTime),
  );

  return topList.concat(defList);
});

const getType = (lastMsg: IMsgInfo<TMsgContent>, item: ImsgItem) => {
  if (lastMsg.isGroupMsg) {
    return switchMsg(lastMsg, t, store, {} as IUserInfo, [], item);
  } else {
    return switchMsg(lastMsg, t, store, item.userDetailInfo.userInfo);
  }
};

const goTo = (item: ImsgItem) => {
  if (item.isGroup) {
    // 群聊
    store.commit('SET_ACTIVEUID', item.id);
    store.commit('SET_ACTIVEISGROUP', true);
  } else {
    // 单聊
    store.commit('SET_ACTIVEUID', item.id);
    store.commit('SET_ACTIVEISGROUP', false);
  }
  item.unReadNum = 0;
  store.commit('SET_MSGLISTITEM', { res: item });
};

// aks
const clientSendMsgAckToServer = (msgInfos: IMsgInfo<TMsgContent>[]) => {
  const lastMsgInfo =
    msgInfos.length > 0 ? msgInfos[msgInfos.length - 1] : null;
  if (lastMsgInfo) {
    const { msgId, fromId, toId } = lastMsgInfo;
    const ackToServer = useClientSendMsgAckToServer(
      store,
      lastMsgInfo.isGroupMsg ? 1 : 0,
    );
    ackToServer(msgId, fromId, toId, 1);
  }
};

const init = async () => {
  // 一、 获取离线数据
  const { offlineMsgInfos } = await useGetOfflineMsg(store);

  // 发送ack
  clientSendMsgAckToServer(offlineMsgInfos);

  // 获取通知
  const data: INotifyClassMsgListInfo[] = await userGetSystemNotice(store);

  data.forEach((e: any) => {
    store.commit('ADD_NOTIFY', { id: e.msgClassId, res: e });
  });
  // 合并数据
  await mergeData(offlineMsgInfos, store, []);
};
init();

// 设置已读
const read = (item: ImsgItem) => {
  const msgList = store.state.msgList;
  const res = msgList[item.id];
  res.unReadNum = 0;
  store.commit('SET_MSGLISTITEM', { uid: item.id, res });
};

// 设置静音
const beforeMsgNotdisturb = useBeforeSwitchChat(store, 1005, t);

const userInfo = store.state.userInfo;

// 退出群聊
const userOperateGroupInfo = useUserOperateGroupInfo(store);
const quitGroupChat = async (item: ImsgItem) => {
  if (
    Number(item.groupDetailInfo.groupMemberLists.rootUid) ===
    Number(store.state.userInfo.uid)
  ) {
    // 是群主 无法直接 退出群聊 需要解散
    return Toast(t('请解散群聊'));
  }

  const query = {
    groupId: item.id,
  };
  const data = await userOperateGroupInfo(3, query);
  Toast(t(data.body.resultString));
  if (data.body.resultCode === 0) {
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
    store.commit('DEL_MSGITEM', item.id);
  }
};
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.tableDouble {
  padding: 17px 13px;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  width: 300px;
  .title {
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      line-height: 16px;
      color: #333;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .iconfont {
      margin-left: 10px;
    }
  }
  .subTitle {
    font-size: 14px;
    color: #999;
    line-height: 18px;
    width: 150px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &.at {
      color: #e6a66a;
    }
  }
  &::after {
    @include tableBottomLine;
  }
  .userImg {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f0f0;
    display: inline-flex;
    align-items: center;
    color: #0085ff;
    font-size: 30px;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.tableItem {
  position: relative;
  .box {
    position: absolute;
    // width: 106px;
    background: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0px 0px 26px 0px rgba(0, 0, 0, 0.2);
    z-index: 99;
    padding: 5px;
    box-sizing: border-box;
    top: 75%;
    right: 13px;
    .item {
      display: flex;
      cursor: pointer;
      align-items: center;
      padding: 6px 8px;
      &:hover {
        background: #eee;
      }
      span {
        color: #000000;
        font-size: 14px;
        margin-left: 8px;
      }
    }
  }
}

.hover {
  .subTitle {
    color: #fff;
  }
  .title {
    span {
      color: #fff;
    }
  }
}
</style>
