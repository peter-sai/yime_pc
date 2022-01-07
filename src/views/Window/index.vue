<template>
  <div class="window">
    <!-- 个人 -->
    <ChatHeader
      :icon="yUserInfo?.icon"
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
    <div class="msg">
      <Message
        :yUserInfo="yUserInfo"
        @toggleBox="toggleBox"
        @changeTag="changeTag"
      />
    </div>

    <Bottom
      v-model="inputVal"
      @recommend="recommend"
      @enter="enter"
      @sendImg="sendImg('img')"
      @sendFile="sendImg('file')"
    />
    <!-- 文件 和 图片选择 -->
    <input ref="changUserImg" type="file" hidden :accept="accept" />

    <!-- 陌生人 -->
    <div class="stranger" v-if="false">
      <div class="title">对方通过 <span>YGG中文社群</span> 发来消息</div>
      <div class="btn">
        <div class="addBlackList">加入黑名单</div>
        <div class="chat">继续聊天</div>
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
    </div>
  </div>
</template>
<script lang="ts">
import { initStore, key } from '@/store';
import { IUserDetailInfo, IUserInfo } from '@/types/user';
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
} from 'vue';
import Message from './message.vue';
import { useI18n } from 'vue-i18n';
import { getTime } from '@/utils/utils';
import { Store, useStore } from 'vuex';
import UserInfo from '../Layout/Chat/userInfo.vue';
import CloudFile from '../Layout/Chat/cloudFile.vue';
import CommonGroup from '../Layout/Chat/commonGroup.vue';
import Recommend from '../Layout/Chat/recommend.vue';
import { useEnter, useCbImg, useSendImg } from '@/hooks/window';
import ChatHeader from './header.vue';
import Bottom from '../Layout/bottom.vue';
import { Etag } from '../Layout/index.vue';
import { ImsgItem } from '@/types/msg';

export default defineComponent({
  name: 'window',
});
// 获取详情
const useGetDetail = async (
  store: Store<initStore>,
  userDetailInfo: Ref<IUserDetailInfo>,
  isBotUser: Ref<boolean>,
  yUserInfo: Ref<IUserInfo>,
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

  if (msgItem.userDetailInfo.userInfo.isBotUser) {
    isBotUser.value = true;
  } else {
    isBotUser.value = false;
  }

  // userDetailInfo.value = msgItem.userDetailInfo || {};
  yUserInfo.value = msgItem.userDetailInfo?.userInfo || {};
};

// 获取用户登录状态
const useStatus = async (
  store: Store<initStore>,
  onlineInfo: Ref<IUserInfo>,
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
  onlineInfo: Ref<IUserInfo>,
) {
  // 获取用户详细资料
  await useGetDetail(store, userDetailInfo, isBotUser, yUserInfo);
  // 获取用户登录状态
  await useStatus(store, onlineInfo);
}
</script>

<script setup lang="ts">
defineEmits(['toggleBox', 'changeTag']);
const { t } = useI18n();
const writeState = ref(0); //0--结束输入(未输入), 1--正在输入
const store = useStore(key);
const yUserInfo: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>; // 当前聊天用户信息
const userInfo: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>; // 需要显示详情用户的信息
const userDetailInfo: Ref<IUserDetailInfo> = ref({}) as Ref<IUserDetailInfo>; // 需要显示详情用户的信息
const isBotUser = ref(false);
const onlineInfo: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>;

// 文件选择类型
const accept = ref('image/*');
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
  changUserImg.value!.addEventListener('change', cbImg);
});

onBeforeUnmount(() => {
  changUserImg.value!.removeEventListener('change', cbImg);
});

// 发送消息
const enter = useEnter(store, inputVal, 0, null, t);
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
  },
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
    overflow: auto;
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
