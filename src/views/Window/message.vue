<template>
  <div ref="msgWindow" class="msgWindow">
    <!-- 无消息时显示 -->
    <div
      class="noMsg"
      v-if="
        (!itemChat.readList || !itemChat.readList.length) &&
        !activeIsGroup &&
        !userDetailInfo?.isFriend
      "
    >
      <Iconfont
        style="display: inline-block"
        v-if="yUserInfo?.isBotUser"
        name="iconbianzu16"
        size="90"
      />
      <img
        class="userImg"
        v-else-if="yUserInfo?.icon"
        :src="yUserInfo?.icon"
        alt=""
      />
      <Iconfont
        style="display: inline-block"
        v-else
        name="iconlianxiren"
        size="90"
        color="#A8B5BE"
      />
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
        <!-- 阅后即焚 -->
        <div v-if="item.msgShowType === 3 && item.fired" class="item">
          <Ymsg
            @click="showUserInfo(getUserInfo(item).uid)"
            :userInfo="getUserInfo(item)"
            :isBurn="item.msgShowType === 3"
            :fired="item.fired"
            v-if="isShowHowComponent(item)"
          >
            {{ t('消息已焚毁') }}
          </Ymsg>
          <Mmsg
            @menuClick="menuClick($event, item)"
            :isRead="item.msgId <= readMsgId"
            :isBurn="item.msgShowType === 3"
            :fired="item.fired"
            v-else
          >
            {{ t('消息已焚毁') }}
          </Mmsg>
        </div>
        <div class="item" v-else-if="item.type === 'stringContent'">
          <!-- 普通消息 -->
          <div>
            <Ymsg
              @click="showUserInfo(getUserInfo(item).uid)"
              @menuClick="menuClick($event, item)"
              :isBurn="item.msgShowType === 3"
              :userInfo="getUserInfo(item)"
              v-if="isShowHowComponent(item)"
            >
              {{ item.msgContent.stringContent }}
            </Ymsg>
            <Mmsg
              @menuClick="menuClick($event, item)"
              :isRead="item.msgId <= readMsgId"
              :isBurn="item.msgShowType === 3"
              v-else
            >
              {{ item.msgContent.stringContent }}
            </Mmsg>
          </div>
        </div>
        <!-- 位置 -->
        <div class="item" v-else-if="item.type === 'gpsMsgInfo'">
          <Ymsg
            @click="showUserInfo(getUserInfo(item).uid)"
            :userInfo="getUserInfo(item)"
            v-if="isShowHowComponent(item)"
          >
            {{ t('请在App客户端, 查看位置消息') }}
          </Ymsg>
          <Mmsg :isRead="item.msgId <= readMsgId" v-else>
            {{ t('请在App客户端, 查看位置消息') }}
          </Mmsg>
        </div>
        <!-- at消息 -->
        <div class="item" v-else-if="item.type === 'groupAtInfo'">
          <Ymsg
            @click="showUserInfo(getUserInfo(item).uid)"
            @menuClick="menuClick($event, item)"
            :userInfo="getUserInfo(item)"
            v-if="isShowHowComponent(item)"
          >
            {{ item.msgContent.groupAtInfo.stringContent }}
          </Ymsg>
          <Mmsg
            @menuClick="menuClick($event, item)"
            :isRead="item.msgId <= readMsgId"
            v-else
          >
            {{ item.msgContent.groupAtInfo.stringContent }}
          </Mmsg>
        </div>
        <!-- 图片消息 -->
        <div class="item" v-else-if="item.type === 'imageMsg'">
          <YImg
            @click="showUserInfo(getUserInfo(item).uid)"
            v-if="isShowHowComponent(item)"
            @menuClick="menuClick($event, item)"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            :userInfo="getUserInfo(item)"
            :src="item.msgContent.imageMsg.imageUrl"
            @showBigImg="showBigImg(item)"
          />
          <MImg
            v-else
            :isRead="item.msgId <= readMsgId"
            @showBigImg="showBigImg(item)"
            @menuClick="menuClick($event, item)"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            :src="item.msgContent.imageMsg.imageUrl"
          />
        </div>
        <!-- 文件消息 -->
        <div class="item" v-else-if="item.type === 'fileInfo'">
          <YFile
            @click="showUserInfo(getUserInfo(item).uid)"
            v-if="isShowHowComponent(item)"
            @menuClick="menuClick($event, item)"
            :userInfo="getUserInfo(item)"
            :item="item.msgContent.fileInfo"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            @download="download(item.msgContent.fileInfo)"
          />
          <MFile
            v-else
            :isRead="item.msgId <= readMsgId"
            @menuClick="menuClick($event, item)"
            :item="item.msgContent.fileInfo"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            @download="download(item.msgContent.fileInfo)"
          />
        </div>
        <!-- 名片 -->
        <div class="item" v-else-if="item.type === 'visitingCard'">
          <YVisitingCard
            @clickCard="
              showUserInfo(
                item.msgContent.visitingCard.uid,
                'card',
                item.msgContent.visitingCard,
              )
            "
            @click="showUserInfo(getUserInfo(item).uid)"
            @menuClick="menuClick($event, item)"
            :userInfo="getUserInfo(item)"
            v-if="isShowHowComponent(item)"
            :item="item.msgContent.visitingCard"
          />
          <MVisitingCard
            v-else
            @clickCard="
              showUserInfo(
                item.msgContent.visitingCard.uid,
                'card',
                item.msgContent.visitingCard,
              )
            "
            :item="item.msgContent.visitingCard"
            @menuClick="menuClick($event, item)"
            :isRead="item.msgId <= readMsgId"
          />
        </div>
        <!-- 语音消息 -->
        <div class="item" v-else-if="item.type === 'voiceMsg'">
          <YAudio
            @click="showUserInfo(getUserInfo(item).uid)"
            v-if="isShowHowComponent(item)"
            :userInfo="getUserInfo(item)"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            :voiceMsg="item.msgContent.voiceMsg"
            :msgId="item.msgId"
          />
          <MAudio
            v-else
            @menuClick="menuClick($event, item)"
            :isRead="item.msgId <= readMsgId"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            :voiceMsg="item.msgContent.voiceMsg"
          />
        </div>
        <!-- 音视频 -->
        <div class="item" v-else-if="item.type === 'videoCallInfo'">
          <YVideo
            @click="showUserInfo(getUserInfo(item).uid)"
            v-if="isShowHowComponent(item)"
            :userInfo="getUserInfo(item)"
            :data="item.msgContent.videoCallInfo"
            @call="call(item.msgContent.videoCallInfo)"
          />
          <MVideo
            v-else
            :isRead="item.msgId <= readMsgId"
            :data="item.msgContent.videoCallInfo"
            @call="call(item.msgContent.videoCallInfo)"
          />
        </div>
        <!-- link消息 -->
        <div class="item" v-else-if="item.type === 'linkUrlInfo'">
          <Ylink
            v-if="isShowHowComponent(item)"
            @menuClick="menuClick($event, item)"
            @click="showUserInfo(getUserInfo(item).uid)"
            :userInfo="getUserInfo(item)"
            :groupDetailInfo="groupDetailInfo"
            :url="item.msgContent.linkUrlInfo.url"
          />
          <Mlink
            v-else
            @menuClick="menuClick($event, item)"
            :isRead="item.msgId <= readMsgId"
            :url="item.msgContent.linkUrlInfo.url"
          />
        </div>
        <!-- 视频文件 -->
        <div class="item" v-else-if="item.type === 'videoMsgInfo'">
          <YVideoFile
            v-if="isShowHowComponent(item)"
            @click="showUserInfo(getUserInfo(item).uid)"
            :userInfo="getUserInfo(item)"
            @menuClick="menuClick($event, item)"
            :videoMsgInfo="item.msgContent.videoMsgInfo"
            :msgId="item.msgId"
            @onPlay="playMsgId = item.msgId"
            :playMsgId="playMsgId"
          />
          <MVideoFile
            v-else
            :isRead="item.msgId <= readMsgId"
            @menuClick="menuClick($event, item)"
            :videoMsgInfo="item.msgContent.videoMsgInfo"
            :msgId="item.msgId"
            @onPlay="playMsgId = item.msgId"
            :playMsgId="playMsgId"
          />
        </div>
        <!-- 系统消息 -->
        <div class="item" v-else-if="item.type === 'systemNotifyInfo'">
          <div class="revoke">{{ systemNotifyInfo(item) }}</div>
        </div>
        <!-- 清理消息 -->
        <div class="item" v-else-if="item.type === 'cleanInfo'">
          <div class="revoke">
            {{ cleanInfof(item.msgContent.cleanInfo) }}
          </div>
        </div>
        <!-- 撤回消息 -->
        <div class="item" v-else-if="item.type === 'revokeInfo'">
          <div class="revoke">
            {{ getRevokeName(item) }}
          </div>
        </div>
        <div class="item" v-else-if="item.type === 'fireInfo'">
          <div class="revoke">{{ fireInfo(item) }}</div>
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
          v-if="
            copyItem.type === 'stringContent' || copyItem.type === 'linkUrlInfo'
          "
          :data-clipboard-text="
            copyItem.msgContent.stringContent ||
            copyItem.msgContent.linkUrlInfo.url
          "
          >{{ t('复制') }}</span
        >
        <span
          class="copyMsg"
          v-if="copyItem.type === 'imageMsg'"
          @click="copyImg(copyItem?.msgContent?.imageMsg?.imageUrl)"
          >{{ t('复制') }}</span
        >
         <span
          @click="forward(copyItem.msgId)"
          >{{ t('回复') }}</span
        >
        <span
          v-if="copyItem.type !== 'voiceMsg'"
          @click="forward(copyItem.msgId)"
          >{{ t('转发') }}</span
        >
        <span
          @click="save(copyItem)"
          v-if="
            ['imageMsg', 'fileInfo', 'videoMsgInfo'].includes(copyItem.type)
          "
          >{{ t('保存') }}</span
        >
        <span
          v-if="copyItem.fromId === store.state.userInfo.uid"
          @click="del(copyItem)"
          >{{ t('撤销') }}</span
        >
        <!-- <span v-if="isShowHowComponent(copyItem)" @click="delMsg(copyItem)">{{
          t('删除')
        }}</span> -->
      </div>
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
  nextTick,
} from 'vue';
export default defineComponent({
  name: 'Message',
});
</script>

<script setup lang="ts">
import ClipboardItem from 'ClipboardItem';
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
import MVideo from '@/components/Message/MVideo/index.vue';
import YVideo from '@/components/Message/YVideo/index.vue';
import Ylink from '@/components/Message/Ylink/index.vue';
import Mlink from '@/components/Message/Mlink/index.vue';
import Iconfont from '../../iconfont/index.vue';
import YVideoFile from '@/components/Message/YVideoFile/index.vue';
import MVideoFile from '@/components/Message/MVideoFile/index.vue';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';
import { useI18n } from 'vue-i18n';
import { showImg } from '../../plugin/ShowImg';
import {
  IFileInfo,
  IFireInfo,
  IImageMsgInfo,
  IMsgInfo,
  ImsgItem,
  IVisitingCard,
} from '@/types/msg';
import { formateTime } from '@/utils/utils';
import { Etag } from '../Layout/index.vue';
import { initRonyun } from '@/App.vue';
import {
  useSendImg,
  useSystemNotifyInfo,
  useUserGetConversationHasReadedMsgInfo,
  useRevoke,
  useDelMsg,
  formatMsg,
  downloadFile,
} from '@/hooks/window';
import { IGroupInfo, IUserDetailInfo, IUserInfo } from '@/types/user';
import { Toast } from '@/plugin/Toast';
import ClipboardJS from 'clipboard';
import { MediaAudio } from '@/plugin/Audio';
import { hideLoading, showLoading } from '@/plugin/Loading';

const playMsgId = ref(0);

async function getGroupInfo(store: Store<initStore>, uid: number) {
  if (!uid) return;

  let msgItem: Ref<ImsgItem> = ref(store.state.msgList[uid]);
  // 如果不存在则获取 (群聊不在聊天列表中会没有信息)
  if (!msgItem.value) {
    const data = await store.dispatch('postMsg', {
      query: {
        groupId: uid,
      },
      cmd: 1029,
      encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
      auth: true,
    });

    msgItem.value = data.body;

    const item = {
      id: data.body.groupDetailInfo.groupId,
      isBotUser: false,
      isGroup: true,
      readList: [],
      unReadNum: 0,
      userDetailInfo: {},
      lastMsg: {},
      groupDetailInfo: data.body.groupDetailInfo,
    };

    store.commit('SET_MSGLISTITEM', { res: item });
  }
}

const store = useStore(key);
const emit = defineEmits(['toggleBox', 'changeTag', 'selectGroupMember']);
const msgWindow: Ref<HTMLDivElement> = ref() as Ref<HTMLDivElement>;

// 显示用户详情
const showUserInfo = async (
  uid: number,
  isCard?: string,
  visitingCard?: IVisitingCard,
) => {
  if (isCard) {
    // 群名片
    if (visitingCard?.type) {
      // await getGroupInfo(store, uid);
      store.commit('SET_ACTIVEUID', uid);
      store.commit('SET_ACTIVEISGROUP', true);
    } else {
      const source = {
        source: visitingCard?.name,
        sourceId: uid,
        sourceType: 1,
      };
      store.commit('SET_MSGSOURCE', source);
      store.commit('SET_ACTIVEUID', uid);
      store.commit('SET_ACTIVEISGROUP', false);
    }
  } else {
    emit('toggleBox', uid);
    emit('changeTag', Etag.UserInfo);
  }
};
const { t } = useI18n();
const style = ref({
  left: 0,
  top: 0,
});

const copyItem = ref({} as IMsgInfo<string>);
let clipboard: any = null;

const scroll = () => {
  msgWindow.value.scrollIntoView();
  msgWindow.value.scrollTop = msgWindow.value.scrollHeight;
};

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
  scroll();
});
onUnmounted(() => {
  clipboard && clipboard.destroy();
});

// 清空消息
const cleanInfof = (cleanInfo: any) => {
  return formatMsg(cleanInfo.stringContent, t);
};

// 已读最大msgid
const readMsgId = ref(0);

const props = defineProps({
  yUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
  userDetailInfo: {
    type: Object as PropType<IUserDetailInfo>,
  },
});

// 消息列表
const list = computed(() => store.state.msgList);
const itemChat: ComputedRef<ImsgItem> = computed(() => {
  let activeList = list.value[store.state.activeUid!] || {};
  activeList.readList = arrDistinctByProp(activeList.readList, 'clientMsgUuid');
  return activeList;
});

const imageList = computed(() => {
  const list = itemChat.value.readList
    .filter((e: IMsgInfo<IImageMsgInfo>) => e.type === 'imageMsg')
    .map((e) => {
      return {
        msgId: e.msgId,
        imageUrl: e.msgContent.imageMsg.imageUrl,
      };
    });
  return list;
});

// 登录用户信息
const userInfo = computed(() => store.state.userInfo);

const showMen = ref(false);

const menuClick = (e: any, data: any) => {
  if (e.target.tagName === 'VIDEO') {
    style.value.left = e.target.offsetParent.offsetLeft + 10;
    style.value.top = e.target.offsetParent.offsetTop + 10;
  } else {
    style.value.left = e.target.offsetLeft + 10;
    style.value.top = e.target.offsetTop + 10;
  }
  copyItem.value = data;
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

// 焚烧消息
const fireInfo = (item: IMsgInfo<IFireInfo>) => {
  const res = item.msgContent.fireInfo.stringContent;
  // const msg = t(res.split('#')[0]).substr(7, res.length);
  // const user = res.split('#')[1];
  // return user + msg;
  return res;
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
const getUserInfo: (item: IMsgInfo<string>) => IUserInfo = (item) => {
  return (
    !activeIsGroup.value
      ? props.yUserInfo
      : groupMemberLists.value.find((e) => e.uid === item.fromId)
  ) as IUserInfo;
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

  // 上传已读最大消息msgid
  const msgList = store.state?.msgList[store.state?.activeUid];
  if (msgList?.lastMsg.msgId !== readMsgId.value) {
    const isGroup = store.state.activeIsGroup ? 1 : 0;
    const res = {
      msgHasReadedInfo: {
        isGroupMsg: isGroup,
        toId: isGroup ? msgList?.lastMsg.fromId : msgList?.lastMsg.toId,
        fromId: isGroup ? msgList?.lastMsg.toId : msgList?.lastMsg.fromId,
        msgIdMax: msgList?.lastMsg.msgId,
      },
      deviceBrand: 'web',
    };

    await store.dispatch('postMsg', {
      query: res,
      cmd: 2149,
      encryption:
        'Aoelailiao.Message.UserUpdateConversationHasReadedMsgInfoReq',
      auth: true,
    });
  }
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
        msgHasReadedInfos.length &&
        store.state.userInfo.uid === msgHasReadedInfos[0].fromId
      ) {
        readMsgId.value = msgHasReadedInfos[0].msgIdMax;
      }
    }
    if (data.cmd === 2004) {
      await nextTick;
      scroll();
    }
  },
);

watch(
  computed(() => store.state.msgInfo),
  (e) => {
    if (e.cmd === 2146) {
      nextTick(() => {
        scroll();
      });
    }
  },
);

onUnmounted(() => {
  stop();
});

// 撤回消息
const del = useRevoke(store, t);

// 删除消息
const delMsg = useDelMsg(store, t);

// 获取撤回消息人
const getRevokeName = (item: IMsgInfo<string>) => {
  const res = formatMsg(item.msgContent.revokeInfo.stringContent!, t);
  return res;
};

// 转发
const forward = (msgId: number) => {
  //
  store.commit('SET_FORWARDMSGID', msgId);
  emit('toggleBox');
  emit('changeTag', Etag.Forward);
};

// 开始音视频
const call = async (item: any) => {
  const data = await store.dispatch('postMsg', {
    query: {
      functionId: 20010,
      objectId: store.state.activeUid,
    },
    cmd: 1189,
    encryption: 'Aoelailiao.Login.UserCheckFunctionPrivilegeReq',
    auth: true,
  });

  if (data?.body?.functionState === 1) {
    const mediaNode = document.getElementById('media')!;
    if (mediaNode.hasChildNodes()) {
      return Toast(t('正在通话中'));
    }
    if (!store.state.rongIm) {
      try {
        showLoading();
        await initRonyun(store);
        if (!store.state.activeIsGroup) {
          // 单聊
          MediaAudio({
            isCall: true,
            mediaType: item.videoType,
            yUserInfo: props.yUserInfo,
          });
        } else {
          // 群聊
          emit('selectGroupMember', item.videoType);
        }
      } catch (error) {
        console.log(error);
        return Toast(t('服务初始化失败'));
      }
      hideLoading();
    } else {
      if (!store.state.activeIsGroup) {
        MediaAudio({
          isCall: true,
          mediaType: item.videoType,
          yUserInfo: props.yUserInfo,
        });
      } else {
        // 群聊
        emit('selectGroupMember', item.videoType);
      }
    }
  } else {
    return Toast(t('发送者无权限'));
  }
};

// 保存
const save = (item: IMsgInfo<IFireInfo | IImageMsgInfo>) => {
  const file = {
    url: '',
    name: '',
  };
  if (item.type === 'imageMsg') {
    file.url = item.msgContent.imageMsg.imageUrl!;
  } else if (item.type === 'fileInfo') {
    file.url = item.msgContent.fileInfo.fileUrl!;
    file.name = item.msgContent.fileInfo.fileName!;
  } else if (item.type === 'videoMsgInfo') {
    file.url = item.msgContent.videoMsgInfo.url!;
    file.name = item.msgContent.videoMsgInfo.name!;
  } else {
    file.url = '';
  }

  downloadFile(file);
};

// 下载
const download = (item: IFileInfo) => {
  const file = {
    url: item.fileUrl,
    name: item.fileName,
  };
  downloadFile(file);
};

// 复制图片
const copyImg = (url: string) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  img.onload = (v: any) => {
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    canvas.width = v.target.width;
    canvas.height = v.target.height;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    canvas.toBlob(async (blob) => {
      const data = [new ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data).then(
        () => {
          Toast(t('复制成功'));
        },
        () => {
          console.error('Unable to write to clipboard.');
        },
      );
    });
  };
};

// 放大图片
const showBigImg = (item: IMsgInfo<IImageMsgInfo>) => {
  const index = imageList.value.findIndex((e) => e.msgId === item.msgId);
  showImg(index, imageList.value);
};

// 消息去重
const arrDistinctByProp = (arr: Array<any>, prop: string) => {
  let obj = {};
  return (arr || []).reduce(function (preValue, item) {
    obj[item[prop]] ? '' : (obj[item[prop]] = true && preValue.push(item));
    return preValue;
  }, []);
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.msgWindow {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
}
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
