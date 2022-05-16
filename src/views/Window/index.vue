<template>
  <div class="window">
    <!-- 个人 -->
    <ChatHeader
      :icon="yUserInfo?.icon"
      :isBotUser="isBotUser"
      :title="
        yUserInfo?.userAttachInfo && yUserInfo.userAttachInfo.remarkName
          ? yUserInfo.userAttachInfo.remarkName
          : yUserInfo.nickname
      "
      :subTitle="
        writeState
          ? t('正在输入内容')
          : onlineInfo.onlineState || isBotUser
          ? t('在线')
          : t('上次在线：') + getTime(onlineInfo.lastOnlineTime, t)
      "
      @toggleBox="toggleBox"
      @changeTag="changeTag"
    />

    <!-- 消息内容 -->
    <div
      class="msg"
      :style="{
        background: `url(${bg}) center no-repeat`,
        backgroundSize: 'cover',
      }"
    >
      <Message
        :key="store.state.key"
        :yUserInfo="yUserInfo"
        :userDetailInfo="userDetailInfo"
        @toggleBox="toggleBox"
        @changeTag="changeTag"
      />
    </div>

    <Bottom
      v-model="inputVal"
      :yUserInfo="yUserInfo"
      @recommend="recommend"
      @enter="enter"
      @sendImg="sendImg('img')"
      @sendFile="sendImg('file')"
    />
    <!-- 文件 和 图片选择 -->
    <input
      ref="changUserImg"
      :value="files"
      type="file"
      hidden
      :accept="accept"
      multiple
    />

    <!-- 陌生人 -->
    <div class="stranger" v-if="strangerInfo">
      <div class="title">
        {{ formate(t('对方通过%@发来消息'), strangerInfo.source) }}
      </div>
      <div class="btn">
        <div class="addBlackList" @click="addBlock">{{ t('加入黑名单') }}</div>
        <div class="chat" @click="addFriend">{{ t('继续聊天') }}</div>
      </div>
    </div>
    <!-- 弹框 -->
    <div>
      <transition name="fade">
        <div v-if="showBox" class="box" @click.stop="showBox = false" />
      </transition>
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.UserInfo" class="boxContent">
          <!-- 用户资料 -->
          <UserInfo
            :userDetailInfo="userDetailInfo"
            :yUserInfo="userInfo"
            :onlineInfo="onlineInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
          />
        </div>
      </transition>
      <!-- 群资料 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.GroupInfo" class="boxContent">
          <GroupInfo
            @toggleBox="toggleBox"
            @changeTag="changeTag"
            :groupDetailInfo="groupDetailInfo"
          />
        </div>
      </transition>
      <!-- 共同群聊 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.CommonGroup" class="boxContent">
          <CommonGroup @toggleBox="toggleBox" @changeTag="changeTag" />
        </div>
      </transition>
      <!-- 云文件 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.CloudFile" class="boxContent">
          <CloudFile @toggleBox="toggleBox" @changeTag="changeTag" />
        </div>
      </transition>
      <!-- 推荐好友 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.Recommend" class="boxContent">
          <Recommend
            @toggleBox="toggleBox"
            :isCreateGroupChat="false"
            @changeTag="changeTag"
          />
        </div>
      </transition>
      <!-- 创建群聊 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.CreateGroupChat" class="boxContent">
          <Recommend
            @toggleBox="toggleBox"
            :isCreateGroupChat="true"
            @changeTag="changeTag"
          />
        </div>
      </transition>
      <!-- 转发消息 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.Forward" class="boxContent">
          <Forward @toggleBox="toggleBox" @changeTag="changeTag" />
        </div>
      </transition>
      <!-- 设置背景 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.SetBackground" class="boxContent">
          <SetBackground @toggleBox="toggleBox" @changeTag="changeTag" />
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { initStore, key } from '@/store';
import { IGroupInfo, IUserDetailInfo, IUserInfo } from '@/types/user';
import {
  defineComponent,
  ref,
  Ref,
  defineEmits,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watch,
  computed,
  onUnmounted,
  ComputedRef,
  reactive,
  effect,
} from 'vue';
import Message from './message.vue';
import { useI18n } from 'vue-i18n';
import { getTime } from '@/utils/utils';
import { Store, useStore } from 'vuex';
import UserInfo, { useToggleFriend } from '../Layout/Chat/userInfo.vue';
import Forward from '../Layout/Chat/Forward.vue';
import SetBackground from '../Layout/Chat/SetBackground.vue';
import CloudFile from '../Layout/Chat/cloudFile.vue';
import CommonGroup from '../Layout/Chat/commonGroup.vue';
import Recommend from '../Layout/Chat/recommend.vue';
import { useEnter, useCbImg, useSendImg } from '@/hooks/window';
import GroupInfo from '../Layout/GroupChat/groupInfo.vue';
import ChatHeader from './header.vue';
import Bottom from '../Layout/bottom.vue';
import { Etag } from '../Layout/index.vue';
import { ImsgItem } from '@/types/msg';
import { useBeforeBlacklist } from '../Layout/Chat/userInfo.vue';

export default defineComponent({
  name: 'window',
});

// 获取详情
const useGetDetail = async (
  store: Store<initStore>,
  userDetailInfo: Ref<IUserDetailInfo>,
  isBotUser: Ref<boolean>,
  yUserInfo: Ref<IUserInfo>
) => {
  if (!store.state.activeUid) return;

  let msgItem: ImsgItem = store.state.msgList[store.state.activeUid!];

  // 如果不存在则获取 (单聊不在聊天列表中会没有信息)
  if (!msgItem) {
    const res = {
      uid: store.state.activeUid,
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1011,
      encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
      auth: true,
    });
    msgItem = data.body;
  }

  if (msgItem?.userDetailInfo?.userInfo?.isBotUser) {
    isBotUser.value = true;
  } else {
    isBotUser.value = false;
  }

  userDetailInfo.value = msgItem.userDetailInfo || {};
  yUserInfo.value = msgItem.userDetailInfo?.userInfo || {};
};

// 获取用户登录状态
const useStatus = async (
  store: Store<initStore>,
  onlineInfo: Ref<IUserInfo>
) => {
  const res = {
    userOnlineState: {
      uid: store.state.activeUid,
    },
  };
  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 2127,
    encryption: 'Aoelailiao.Message.UserOnlineStateNotifyReq',
    auth: true,
  });
  onlineInfo.value = data.body?.userOnlineState || {};
};

// init
async function init(
  store: Store<initStore>,
  userDetailInfo: Ref<IUserDetailInfo>,
  isBotUser: Ref<boolean>,
  yUserInfo: Ref<IUserInfo>,
  onlineInfo: Ref<IUserInfo>
) {
  // 获取用户详细资料
  await useGetDetail(store, userDetailInfo, isBotUser, yUserInfo);
  // 获取用户登录状态
  await useStatus(store, onlineInfo);
}
</script>

<script setup lang="ts">
import Iconfont from '../../iconfont/index.vue';
defineEmits(['toggleBox', 'changeTag']);
const { t } = useI18n();
const writeState = ref(0); //0--结束输入(未输入), 1--正在输入
const store = useStore(key);
const yUserInfo: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>; // 当前聊天用户信息
const userInfo: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>; // 需要显示详情用户的信息
const userDetailInfo: Ref<IUserDetailInfo> = ref({}) as Ref<IUserDetailInfo>; // 需要显示详情用户的信息
const isBotUser = ref(false);
const onlineInfo: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>;
const files = ref('');
const bg = computed(() => store.state.chatbg);

const groupDetailInfo: ComputedRef<IGroupInfo> = computed(
  () => store.state.msgList[store.state.userUid]?.groupDetailInfo || {}
);

// 获取聊天背景
const getClientGetCurrentBackground = async () => {
  const data = await store.dispatch('postMsg', {
    query: {
      toId: store.state.activeUid,
    },
    cmd: 2041,
    encryption: 'Aoelailiao.Message.ClientGetCurrentBackgroundUrlReq',
    auth: true,
  });
  store.commit('SET_CHATBG', data.body.backgroundUrl || '');
};

// 群聊陌生人
const strangerInfo = computed(() => {
  const userInfo = store.state?.msgList[store.state?.activeUid];
  if (
    userInfo?.userDetailInfo?.isFriend ||
    userInfo?.userDetailInfo?.isInMyBlacklist ||
    userInfo?.readList?.length > 1
  ) {
    return null;
  }
  const msgSource = userInfo?.lastMsg?.attachInfo?.msgSource;
  try {
    if (msgSource) {
      const item = JSON.parse(msgSource);
      if (item.sourceId != store.state.activeUid) {
        return item;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
});

// 加入黑名单
const addBlock = async () => {
  const userInfo = store.state?.msgList[store.state?.activeUid];
  const query = {
    uid: userInfo?.lastMsg.fromId,
  };
  if (userInfo) {
    await useBeforeBlacklist(store, t, query as IUserInfo)(true);
    if (store.state.msgList[userInfo?.lastMsg.fromId]) {
      delete store.state.msgList[userInfo?.lastMsg.fromId];
      store.commit('SET_ACTIVEUID', null);
    }
  }
};

// 点击继续聊天
const addFriend = async () => {
  const userInfo = store.state?.msgList[store.state?.activeUid];
  const query = {
    uid: userInfo?.lastMsg.fromId,
  };
  await useToggleFriend(store, t, query as IUserInfo)(true);
};

const formate = (temp: string, info: string) => {
  return temp.replace('%@', info);
};

// 文件选择类型
const accept = ref('image/*,video/*');
const changUserImg: Ref<HTMLInputElement | null> = ref(null);

// 是否显示右侧
const showBox = ref(false);
const toggleBox = async (uid?: number) => {
  if (!showBox.value) {
    const userId = uid || store.state.activeUid;
    store.commit('SET_USERUID', userId);
  }
  let msgItem: ImsgItem | null = null;
  // let msgItem: ImsgItem = store.state.msgList[store.state.userUid!];
  // 如果不存在则获取 (单聊不在聊天列表中会没有信息)
  if (!msgItem) {
    const res = {
      uid: store.state.userUid,
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1011,
      encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
      auth: true,
    });
    msgItem = data.body;
  }

  userDetailInfo.value = msgItem?.userDetailInfo || {};
  userInfo.value = msgItem?.userDetailInfo?.userInfo || {};
  showBox.value = !showBox.value;
  const newMsgItem: ImsgItem = store.state.msgList[store.state.userUid!];
  if (!newMsgItem) return;
  newMsgItem.userDetailInfo = msgItem?.userDetailInfo;
  store.commit('SET_MSGLISTITEM', {
    uid: store.state.userUid,
    res: newMsgItem,
  });
};

// 右侧显示的内容
const tag = ref<Etag>(Etag['UserInfo']);
const changeTag = (val: Etag) => {
  tag.value = val;
};

// 输入框值
const inputVal = ref('');

// 分享
const recommend = () => {
  toggleBox();
  changeTag(Etag.Recommend);
};

// 初始化
init(store, userDetailInfo, isBotUser, yUserInfo, onlineInfo);

const cbImg = useCbImg(store, accept, t);

onMounted(async () => {
  store.commit('SET_CHATBG', '');
  getClientGetCurrentBackground();
  changUserImg.value!.addEventListener('change', (e) => {
    cbImg(e, store.state.activeUid!);
    changUserImg.value?.setAttribute('type', 'text');
  });
});

onBeforeUnmount(() => {
  changUserImg.value!.removeEventListener('change', cbImg);
});

// 发送消息
const enter = useEnter(store, inputVal, 0, t);
// 发送图片
const sendImg = useSendImg(store, 0, t, changUserImg, accept, nextTick);

const stop = watch(
  computed(() => store.state.msgInfo),
  async (data: any) => {
    // 获取后台自动推送的上线和离线消息
    if (data.cmd === 2129) {
      if (
        Number(store.state.activeUid) === Number(data.body.userOnlineState.uid)
      ) {
        onlineInfo.value = data.body?.userOnlineState || {};
      }
    }
    // 监听输入状态
    if (data.cmd === 2125) {
      const userWriteState = data.body?.userWriteState || {};
      const uid = Number(store.state.activeUid);
      if (userWriteState.fromId === uid) {
        writeState.value = userWriteState.writeState;
      }
    }
  }
);
onUnmounted(() => {
  stop();
});
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.window {
  // position: relative;
  .msg {
    position: absolute;
    top: 65px;
    left: 0;
    right: 0;
    bottom: 50px;
    padding: 20px;
  }
  .stranger {
    position: absolute;
    width: 362px;
    height: 128px;
    background: #f0f1f4;
    border-radius: 10px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 25px 0;
    box-sizing: border-box;
    text-align: center;
    .title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #050505;
      line-height: 20px;
      span {
        color: #0085ff;
        font-size: 14px;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24px;
      div {
        width: 106px;
        height: 34px;
        border-radius: 4px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .addBlackList {
        background: #ffffff;
        color: #4b4b4b;
        margin-right: 20px;
      }
      .chat {
        width: 106px;
        color: #fff;
        height: 34px;
        background: #0085ff;
        border-radius: 4px;
      }
    }
  }
  .box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .boxContent {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 320px;
    background: #fff;
  }
}
</style>
