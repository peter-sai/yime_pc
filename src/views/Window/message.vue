<template>
  <!-- 无消息时显示 -->
  <div
    class="noMsg"
    v-if="(!itemChat.readList || !itemChat.readList.length) && !activeIsGroup"
  >
    <img class="userImg" :src="yUserInfo?.icon" alt="" />
    <div class="title">{{ yUserInfo?.nickname }}</div>
    <div class="bg">
      <!-- <img :src="sayHello" alt="" /> -->
      <SayHello class="img" />
      <div class="info">{{ t('打个招呼，开始聊天吧') }}</div>
      <div class="btn" @click.stop="sendImg('sayHello')">
        {{ t('打招呼') }}
      </div>
    </div>
  </div>
  <div class="Message">
    <div v-for="(item, key) in itemChat.readList || []" :key="item.id">
      <Time v-if="isShowTime(key)">{{ formateTime(item.msgTime, t) }}</Time>
      <!-- 普通消息 -->
      <div class="item" v-if="item.type === 'stringContent'">
        <!-- 阅后即焚 -->
        <div v-if="item.msgShowType === 3">
          <Ymsg :userInfo="getUserInfo(item)" v-if="isShowHowComponent(item)">
            请在App客户端, 查看阅后即焚消息
          </Ymsg>
          <Mmsg :isRead="item.msgId <= readMsgId" v-else>
            请在App客户端, 查看阅后即焚消息
          </Mmsg>
        </div>
        <!-- 普通消息 -->
        <div v-else>
          <Ymsg
            @menuClick="menuClick($event, item)"
            :userInfo="getUserInfo(item)"
            v-if="isShowHowComponent(item)"
          >
            {{ item.msgContent.stringContent }}
          </Ymsg>
          <Mmsg
            @menuClick="menuClick($event, item)"
            :isRead="item.msgId <= readMsgId"
            v-else
          >
            {{ item.msgContent.stringContent }}
          </Mmsg>
        </div>
      </div>
      <!-- 图片消息 -->
      <div class="item" v-else-if="item.type === 'imageMsg'">
        <YImg
          v-if="isShowHowComponent(item)"
          @menuClick="menuClick($event, item)"
          :userInfo="getUserInfo(item)"
          :src="item.msgContent.imageMsg.imageUrl"
        />
        <MImg
          v-else
          :isRead="item.msgId <= readMsgId"
          @menuClick="menuClick($event, item)"
          :src="item.msgContent.imageMsg.imageUrl"
        />
      </div>
      <!-- 文件消息 -->
      <div class="item" v-else-if="item.type === 'fileInfo'">
        <YFile
          v-if="isShowHowComponent(item)"
          @menuClick="menuClick($event, item)"
          :userInfo="getUserInfo(item)"
          :item="item.msgContent.fileInfo"
        />
        <MFile
          v-else
          :isRead="item.msgId <= readMsgId"
          @menuClick="menuClick($event, item)"
          :item="item.msgContent.fileInfo"
        />
      </div>
      <!-- 名片 -->
      <div class="item" v-else-if="item.type === 'visitingCard'">
        <YVisitingCard
          :userInfo="getUserInfo(item)"
          v-if="isShowHowComponent(item)"
          :item="item.msgContent.visitingCard"
        />
        <MVisitingCard
          v-else
          :item="item.msgContent.visitingCard"
          :isRead="item.msgId <= readMsgId"
        />
      </div>
      <!-- 音视频消息 -->
      <div class="item" v-else-if="item.type === 'voiceMsg'">
        <YAudio
          v-if="isShowHowComponent(item)"
          :userInfo="getUserInfo(item)"
          :voiceMsg="item.msgContent.voiceMsg"
        />
        <MAudio
          v-else
          :isRead="item.msgId <= readMsgId"
          :voiceMsg="item.msgContent.voiceMsg"
        />
      </div>
      <!-- 系统消息 -->
      <div class="item" v-else-if="item.type === 'systemNotifyInfo'">
        <div class="revoke">{{ systemNotifyInfo(item) }}</div>
      </div>
      <!-- 撤回消息 -->
      <div class="item" v-else-if="item.type === 'revokeInfo'">
        <div class="revoke">
          {{ getRevokeName(item) }} {{ t('撤回了一条消息') }}
        </div>
      </div>
    </div>
    <div
      class="menu"
      v-if="showMen"
      @contextmenu="contextmenu"
      :style="{ left: style.left + 'px', top: style.top + 'px' }"
    >
      <span
        class="copyMsg"
        v-if="copyItem.type === 'stringContent'"
        :data-clipboard-text="copyItem.msgContent.stringContent"
        >复制</span
      >
      <span>转发</span>
      <span>保存</span>
      <span
        v-if="copyItem.fromId === store.state.userInfo.uid"
        @click="del(copyItem)"
        >删除</span
      >
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  defineEmits,
  onBeforeUnmount,
  onMounted,
  Ref,
  ref,
  defineProps,
  PropType,
  watch,
  onUnmounted,
} from 'vue';
export default defineComponent({
  name: 'Message',
});
</script>

<script setup lang="ts">
import Mmsg from '@/components/Message/Mmsg/index.vue';
import Ymsg from '@/components/Message/Ymsg/index.vue';
import Time from '@/components/Time/index.vue';
import SayHello from '@/components/Message/SayHello/index.vue';
import MImg from '@/components/Message/MImg/index.vue';
import YImg from '@/components/Message/YImg/index.vue';
import YFile from '@/components/Message/YFile/index.vue';
import MFile from '@/components/Message/MFile/index.vue';
import MVisitingCard from '@/components/Message/MVisitingCard/index.vue';
import YVisitingCard from '@/components/Message/YVisitingCard/index.vue';
import YAudio from '@/components/Message/YAudio/index.vue';
import MAudio from '@/components/Message/MAudio/index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';
import { IMsgInfo, ImsgItem } from '@/types/msg';
import { formateTime } from '@/utils/utils';
import {
  useSendImg,
  useSystemNotifyInfo,
  useUserGetConversationHasReadedMsgInfo,
  useRevoke,
} from '@/hooks/window';
import { IGroupInfo, IUserInfo } from '@/types/user';
import { Toast } from '@/plugin/Toast';
import ClipboardJS from 'clipboard';
const store = useStore(key);
defineEmits(['menuClick', 'contextmenu']);
const { t } = useI18n();
const style = ref({
  left: 0,
  top: 0,
});

const copyItem = ref({} as IMsgInfo<string>);
let clipboard: any = null;

onMounted(() => {
  // 复制
  clipboard = new ClipboardJS('.copyMsg');
  clipboard.on('success', () => {
    Toast(t('复制成功'));
  });

  clipboard.on('error', () => {
    // 不支持复制
    console.log('该浏览器不支持自动复制');
  });
});
onUnmounted(() => {
  clipboard && clipboard.destroy();
});

// 已读最大msgid
const readMsgId = ref(0);

const props = defineProps({
  yUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
});

// 消息列表
const list = computed(() => store.state.msgList);
const itemChat: ComputedRef<ImsgItem> = computed(
  () => list.value[store.state.activeUid!] || {},
);

// 登录用户信息
const userInfo = computed(() => store.state.userInfo);

const showMen = ref(false);

const menuClick = (e: any, data: any) => {
  copyItem.value = data;
  style.value.left = e.x - 320;
  style.value.top = e.y - 85;
  showMen.value = true;
};
const contextmenu = (e: any) => {
  e.preventDefault();
};

// 控制消息时间的显示
let msgKey = 0;
const isShowTime = (k: number) => {
  if (k === 0) {
    msgKey = k;
    return true;
  }
  const prev = itemChat.value.readList[msgKey].msgTime;
  const now = itemChat.value.readList[k].msgTime;
  const minute10 = 10 * 60;
  if (now - prev <= minute10) {
    return false;
  }
  msgKey = k;
  return true;
};

// 发送图片
const sendImg = useSendImg(store, 0, t);

const bodyClickCb = () => {
  showMen.value = false;
};
onMounted(() => {
  document.body.addEventListener('click', bodyClickCb);
});
onBeforeUnmount(() => {
  document.body.removeEventListener('click', bodyClickCb);
});

// 群聊相关 ////////////////////
const groupMemberLists: Ref<IUserInfo[]> = ref([]);
// 判断当前是否是群聊
const activeIsGroup = computed(() => store.state.activeIsGroup);

// 根据是否是群聊 而计算要显示哪个组件
const isShowHowComponent = (item: IMsgInfo<string>) => {
  return !activeIsGroup.value
    ? item.toId === userInfo.value.uid
    : item.fromId !== userInfo.value.uid;
};

// 获取需要显示的头像信息
const getUserInfo = (item: IMsgInfo<string>) => {
  return !activeIsGroup.value
    ? props.yUserInfo
    : groupMemberLists.value.find((e) => e.uid === item.fromId);
};

const userGetConversationHasReadedMsgInfo =
  useUserGetConversationHasReadedMsgInfo(store);
const init = async () => {
  // 批量获取好友
  if (activeIsGroup.value) {
    const groupMemberUids =
      props.groupDetailInfo?.groupMemberLists.memberUserInfos
        .map((e) => e.memberUid)
        .filter((e) => Number(e) !== Number(store.state.userInfo.uid));

    const res = await store.dispatch('postMsg', {
      query: { uid: groupMemberUids },
      cmd: 1115,
      encryption: 'Aoelailiao.Login.ClientGetUserInfoListReq',
      auth: true,
    });
    groupMemberLists.value = res.body.userInfo;
  }

  // 获取最大msgId
  const msgHasReadedInfos = await userGetConversationHasReadedMsgInfo(
    store.state.activeUid!,
    store.state.userInfo.uid,
  );
  readMsgId.value = msgHasReadedInfos[0].msgIdMax;
};
init();

// 系统消息显示
const systemNotifyInfo = useSystemNotifyInfo(store, t);

let stop = watch(
  computed(() => store.state.msgInfo),
  async (data: any) => {
    // 监听服务器推送的已读消息通知
    if (data.cmd === 2148) {
      const msgHasReadedInfos = data.body?.msgHasReadedInfos || [];
      if (
        store.state.userInfo.uid === msgHasReadedInfos[0].fromId &&
        msgHasReadedInfos.length
      ) {
        readMsgId.value = msgHasReadedInfos[0].msgIdMax;
      }
    }
  },
);

onUnmounted(() => {
  stop();
});

// 撤回消息
const del = useRevoke(store, t);

// 获取撤回消息人
const getRevokeName = (item: IMsgInfo<string>) => {
  if (Number(item.fromId) === Number(store.state.activeUid)) {
    const msgList = store.state.msgList;
    if (msgList) {
      const userInfo = msgList[store.state.activeUid!].userDetailInfo.userInfo;
      const userAttachInfo = userInfo.userAttachInfo || {};
      return userAttachInfo.remarkName || userInfo.nickname;
    }
  } else {
    const userAttachInfo = userInfo.value.userAttachInfo || {};
    return userAttachInfo.remarkName || userInfo.value.nickname;
  }
  return '';
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.Message {
  position: relative;
  .item {
    margin: 20px 0;
    .revoke {
      color: #666;
      font-size: 12px;
      text-align: center;
    }
  }
  .menu {
    position: absolute;
    left: 88px;
    top: 36px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    box-sizing: border-box;
    padding: 8px 5px;
    span {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      width: 45px;
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
}
.noMsg {
  text-align: center;
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  .userImg {
    width: 90px;
    height: 90px;
    border-radius: 50%;
  }
  .title {
    height: 28px;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    margin: 18px 0;
    color: #333333;
  }
  .bg {
    border-radius: 10px;
    padding: 18px;
    background: #f4f4f4;
    .img {
      width: 84px;
      height: 84px;
    }
    .info {
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      margin: 8px 0 18px;
      color: #333;
    }
    .btn {
      width: 150px;
      height: 40px;
      background: linear-gradient(130deg, #00bbff 8%, #0085ff 96%);
      border-radius: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 40px;
      margin: 0 auto;
      cursor: pointer;
    }
  }
}
</style>
