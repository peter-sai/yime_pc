<template>
  <div style="flex: 1" @click.stop="showMenu = false">
    <MessageHeader @isSearch="changeIsSearch" @rightClick="rightClick" />
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
            <div v-if="item.isGroup">
              <div class="userImg" v-if="item.groupDetailInfo.groupIcon">
                <img :src="item.groupDetailInfo.groupIcon" alt="" />
              </div>
              <div class="userImg" v-else>
                {{
                  item.groupDetailInfo.groupName
                    ? item.groupDetailInfo.groupName
                        .substr(0, 1)
                        .toLocaleUpperCase()
                    : ''
                }}
              </div>
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
          <template v-slot:num v-else-if="item.unRead">
            <Badge
              :isMute="
                item.isGroup
                  ? item.groupDetailInfo?.groupAttachInfo?.groupMsgMute
                  : item.userDetailInfo?.userInfo?.userAttachInfo?.msgMute
              "
              :num="0"
              :hover="item.id === store.state.activeUid"
            />
          </template>
        </TableDouble>
        <!-- 系统消息 -->
        <TableDouble
          v-if="item.msgClassId === 1"
          html
          :subTitle="JSON.parse(item.msgClassRecentMsgContent).Jt"
          @click="store.commit('SET_ACTIVEUID', item.msgClassId)"
          :hover="item.msgClassId === store.state.activeUid"
        >
          <template v-slot:title>
            <div class="sysText">
              {{ t(item.msgClassTitle) }}
              <Iconfont name="iconbianzu19" size="15" />
            </div>
          </template>
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
      </div>
    </div>

    <div class="box" v-if="showMenu" :style="style">
      <div
        v-if="rightClickItem.isGroup"
        class="rightClickItem"
        @click="
          groupBeforeTop(
            !rightClickItem.groupDetailInfo?.groupAttachInfo?.groupTop,
            rightClickItem.id,
          )
        "
      >
        <Iconfont name="icondingzi" size="15" />
        <span>{{
          rightClickItem.groupDetailInfo?.groupAttachInfo?.groupTop
            ? t('取消置顶')
            : t('置顶')
        }}</span>
      </div>
      <div
        v-else
        class="rightClickItem"
        @click="
          userBeforeTop(
            !rightClickItem.userDetailInfo?.userInfo?.userAttachInfo?.msgTop,
            rightClickItem.id,
          )
        "
      >
        <Iconfont name="icondingzi" size="15" />
        <span>{{
          rightClickItem.userDetailInfo?.userInfo?.userAttachInfo?.msgTop
            ? t('取消置顶')
            : t('置顶')
        }}</span>
      </div>
      <div
        v-if="rightClickItem.unReadNum || rightClickItem.unRead"
        class="rightClickItem"
        @click="read(rightClickItem)"
      >
        <Iconfont name="iconbianzu9" size="15" />
        <span>{{ t('已读') }}</span>
      </div>
      <div v-else class="rightClickItem" @click="unRead(rightClickItem)">
        <Iconfont name="iconbianzu9" size="15" />
        <span>{{ t('未读') }}</span>
      </div>
      <div
        class="rightClickItem"
        v-if="rightClickItem.isGroup"
        @click="
          beforeMsgNotdisturb(
            rightClickItem.groupDetailInfo?.groupAttachInfo?.groupMsgMute,
            rightClickItem,
          )
        "
      >
        <Iconfont name="iconxitongjingyin" size="15" />
        <span>{{
          rightClickItem.groupDetailInfo?.groupAttachInfo?.groupMsgMute
            ? t('取消静音')
            : t('静音')
        }}</span>
        >
      </div>
      <div
        class="rightClickItem"
        v-else
        @click="
          beforeMsgNotdisturb(
            rightClickItem.userDetailInfo?.userInfo?.userAttachInfo?.msgMute,
            rightClickItem,
          )
        "
      >
        <Iconfont name="iconxitongjingyin" size="15" />
        <span>{{
          rightClickItem.userDetailInfo?.userInfo?.userAttachInfo?.msgMute
            ? t('取消静音')
            : t('静音')
        }}</span>
      </div>
      <div
        class="rightClickItem"
        v-if="rightClickItem.isGroup"
        @click="quitGroupChat(rightClickItem)"
      >
        <Iconfont name="icontuichu" size="15" />
        <span>{{ t('退出群聊') }}</span>
      </div>
      <div class="rightClickItem" @click="hide(rightClickItem)">
        <Iconfont name="iconyincangbukejian" size="15" />
        <span>{{ t('隐藏') }}</span>
      </div>
      <div class="rightClickItem" @click="del(rightClickItem)">
        <Iconfont name="icondelete" size="12" />
        <span>{{ t('删除') }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  Ref,
  ref,
} from 'vue';
import TableDouble from '@/components/TableDouble/index.vue';
import Badge from '@/components/Badge/index.vue';
import Iconfont from '@/iconfont/index.vue';
import MessageHeader from './header.vue';
import { Store, storeKey, useStore } from 'vuex';
import Errors from '../Errors/index.vue';
import { upDateStore } from '../Layout/Chat/userInfo.vue';
import { initStore, key } from '@/store';
import { IUserInfo } from '@/types/user';
import { Dialog } from '../../plugin/Dialog';
import {
  switchMsg,
  useGetOfflineMsg,
  mergeData,
  useFormateTime,
  useBeforeSwitch as useGroupBeforeSwitch,
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
import { IGroupListItem } from '@/types/group';
export default defineComponent({
  name: 'message',
});

const isSearch = ref(false);

const rightClickItem = ref({}) as Ref<ImsgItem>;

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
const showMenu = ref(false);
const style = ref({ left: '0px', top: '0px' });
const contextmenu = (e: any, item: ImsgItem) => {
  style.value.left = e.pageX + 'px';
  style.value.top = e.pageY + 'px';
  e?.preventDefault();
  showMenu.value = true;
  rightClickItem.value = item;
};

const rightClick = (e: any, item: ImsgItem) => {
  style.value.left = e.pageX + 'px';
  style.value.top = e.pageY + 'px';
  rightClickItem.value = item;
  showMenu.value = true;
};

onMounted(() => {
  document.body.addEventListener(
    'click',
    () => {
      showMenu.value = false;
    },
    true,
  );
});

// 列表
const store = useStore(key);
const msgList: ComputedRef<TMsgItem[]> = computed(() => {
  const list: TMsgItem[] = Object.values(store.state.msgList) as TMsgItem[];

  // 区分置顶和非置顶
  let topList: TMsgItem[] = [];
  let defList: TMsgItem[] = [];
  list
    .filter(
      (e: TMsgItem) =>
        e.msgClassId! || (e.lastMsg && e.lastMsg.msgId && !e.isDel),
    )
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
      (b.updateTime || b.lastMsg?.msgTime) -
      (a.updateTime || a.lastMsg?.msgTime),
  );
  defList.sort(
    (a: TMsgItem, b: TMsgItem) =>
      (b.updateTime || b.lastMsg?.msgTime) -
      (a.updateTime || a.lastMsg?.msgTime),
  );

  return topList.concat(defList);
});

const getType = (lastMsg: IMsgInfo<TMsgContent>, item: ImsgItem) => {
  if (lastMsg.isGroupMsg) {
    return switchMsg(lastMsg, t, store, {} as IUserInfo, [], item);
  } else {
    return switchMsg(lastMsg, t, store, item?.userDetailInfo?.userInfo || []);
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
  item.unRead = false;
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

setTimeout(() => {
  init();
});

// 设置已读
const read = (item: ImsgItem) => {
  const msgList = store.state.msgList;
  const res = msgList[item.id];
  res.unReadNum = 0;
  res.unRead = false;
  store.commit('SET_MSGLISTITEM', { uid: item.id, res });
};
// 设置未读
const unRead = (item: ImsgItem) => {
  const msgList = store.state.msgList;
  const res = msgList[item.id];
  res.unRead = true;
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
    // const data = await store.dispatch('postMsg', {
    //   query: {
    //     groupId: store.state.activeUid,
    //   },
    //   cmd: 1029,
    //   encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
    //   auth: true,
    // });
    // const msgItem = data.body;
    // const item = store.state.msgList[store.state.activeUid!];
    // item.groupDetailInfo = msgItem.groupDetailInfo;
    // store.commit('SET_MSGLISTITEM', { res: item });
    if (store.state.msgList[item.id]) {
      delete store.state.msgList[item.id];
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
    // store.commit('DEL_MSGITEM', item.id);
  }
};

// 删除
const del = (item: any) => {
  Dialog({
    title: t(
      '当前会话删除后，所有聊天记录将被被删除，收到新消息，或通过搜索会话名称，会话将再次显示',
    ),
    callBack: async () => {
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
    },
  });
};

// 隐藏
const hide = (item: any) => {
  Dialog({
    title: t(
      '当前会话隐藏后，聊天记录不会被删除。收到新消息，或通过搜索会话名称，会话将再次显示',
    ),
    callBack: async () => {
      if (store.state.msgList[item.id]) {
        /**
         * 1、所有未读消息设为已读
          2、关闭消息通知
          3、取消置顶
          4、当前列表删除会话入口
         */
        const selectItem = store.state.msgList[item.id];
        selectItem.isDel = true;
        selectItem.unReadNum = 0;
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
            opt: 0,
          },
          cmd: 2163,
          encryption: 'Aoelailiao.Message.HideConversationReq',
          auth: true,
        });
      }
    },
  });
};

// 群置顶
const groupBeforeTop = useGroupBeforeSwitch(store, 1004, t);

// 置顶
const userBeforeTop = useBeforeSwitch(store, 1004, t);

function useBeforeSwitch(
  store: Store<initStore>,
  settingItemId: number,
  t: { (key: string | number): string },
) {
  return async (e: boolean, uid: number) => {
    const res = {
      objectType: 1,
      objectId: uid,
      settingItemId,
      switchState: e ? 1 : 0,
    };
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
        if (settingItemId === 1004) {
          // 置顶
          upDateStore('msgTop', Number(e), store, false, uid);
        }
        resovle(true);
      } else {
        reject();
      }
      Toast(t(data.body.resultString));
    });
  };
}
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
  .sysText {
    font-size: 14px;
    display: flex;
    align-items: center;
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
}
.box {
  position: fixed;
  // width: 106px;
  background: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0px 0px 26px 0px rgba(0, 0, 0, 0.2);
  z-index: 99;
  padding: 5px;
  box-sizing: border-box;
  // top: 75%;
  // right: 13px;
  .rightClickItem {
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
