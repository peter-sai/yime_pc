<template>
  <div class="search" v-if="search.showBox">
    <div class="left">
      <div
        class="top"
        :class="
          (queryInfo.index + 1 === queryInfo.selectList.length ||
            !queryInfo.selectList.length) &&
          'disable'
        "
        @click="goNext('+')"
      ></div>
      <div
        class="bottom"
        :class="
          (queryInfo.index < 1 || !queryInfo.selectList.length) && 'disable'
        "
        @click="goNext('-')"
      ></div>
    </div>
    <div class="intputBg">
      <div class="icon">
        <Iconfont name="iconsousuo" size="15" color="#aaa" />
      </div>
      <input
        type="text"
        ref="searchRef"
        :placeholder="t('请输入')"
        v-model="search.inputVal"
      />
      <div
        class="icon close"
        @click="
          search.inputVal = '';
          queryInfo.selectList = [];
          queryInfo.index = 0;
          isEnterInputVal = '';
        "
      >
        <Iconfont name="iconsearch" size="20" color="#aaa" />
      </div>
    </div>
    <div class="num">
      {{ queryInfo.selectList.length ? queryInfo.index + 1 : 0 }}/{{
        queryInfo.selectList.length
      }}
    </div>
    <div
      class="close"
      @click="
        search.inputVal = '';
        queryInfo.selectList = [];
        queryInfo.index = 0;
        search.showBox = false;
      "
    >
      <Iconfont name="iconsearch" size="20" color="#0085FF" />
    </div>
  </div>
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
      <div
        v-for="(item, key) in itemChat.readList || []"
        :key="item.id"
        :id="item.msgId"
      >
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
        <div
          class="item"
          style="padding: 0"
          v-else-if="item.type === 'stringContent'"
        >
          <!-- 普通消息 -->
          <div
            style="padding: 20px 0"
            :style="{
              background:
                item.msgId === queryInfo.selectList[queryInfo.index]
                  ? 'rgba(0,0,0,0.1)'
                  : '',
            }"
          >
            <Ymsg
              @click="showUserInfo(getUserInfo(item).uid)"
              @menuClick="menuClick($event, item)"
              :isBurn="item.msgShowType === 3"
              :replyMsg="getReply(item)"
              :userInfo="getUserInfo(item)"
              :replyUserInfo="getUserInfo(getReply(item))"
              :search="search.inputVal"
              :isEnterInputVal="isEnterInputVal"
              v-if="isShowHowComponent(item)"
            >
              {{ item.msgContent.stringContent }}
            </Ymsg>
            <Mmsg
              @menuClick="menuClick($event, item)"
              :isRead="item.msgId <= readMsgId"
              :replyMsg="getReply(item)"
              :replyUserInfo="getUserInfo(getReply(item))"
              :isBurn="item.msgShowType === 3"
              :search="search.inputVal"
              :isEnterInputVal="isEnterInputVal"
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
            :isBurn="item.msgShowType === 3"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            v-if="isShowHowComponent(item)"
            :search="search.inputVal"
            :isEnterInputVal="isEnterInputVal"
          >
            {{ item.msgContent.groupAtInfo.stringContent }}
          </Ymsg>
          <Mmsg
            @menuClick="menuClick($event, item)"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :isBurn="item.msgShowType === 3"
            :isRead="item.msgId <= readMsgId"
            :search="search.inputVal"
            :isEnterInputVal="isEnterInputVal"
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
            @addImgLoadEvent="addImgLoadEvent(item)"
            @delImgLoadEvent="delImgLoadEvent(item)"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            :userInfo="getUserInfo(item)"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :src="item.msgContent.imageMsg.imageUrl"
            @showBigImg="showBigImg(item)"
          />
          <MImg
            v-else
            :isRead="item.msgId <= readMsgId"
            @showBigImg="showBigImg(item)"
            @menuClick="menuClick($event, item)"
            @addImgLoadEvent="addImgLoadEvent(item)"
            @delImgLoadEvent="delImgLoadEvent(item)"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :src="item.msgContent.imageMsg.imageUrl"
          />
        </div>
        <!-- 表情消息 -->
        <div class="item" v-else-if="item.type === 'emojiInfo'">
          <YImg
            @click="showUserInfo(getUserInfo(item).uid)"
            v-if="isShowHowComponent(item)"
            @menuClick="menuClick($event, item)"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            :userInfo="getUserInfo(item)"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :src="item.msgContent.emojiInfo.url"
            isEmoji
          />
          <MImg
            v-else
            :isRead="item.msgId <= readMsgId"
            @menuClick="menuClick($event, item)"
            :isBurn="item.msgShowType === 3"
            :fired="false"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :src="item.msgContent.emojiInfo.url"
            isEmoji
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
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :fired="false"
            @download="download(item.msgContent.fileInfo)"
          />
          <MFile
            v-else
            :isRead="item.msgId <= readMsgId"
            @menuClick="menuClick($event, item)"
            :item="item.msgContent.fileInfo"
            :isBurn="item.msgShowType === 3"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
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
                item.msgContent.visitingCard
              )
            "
            @click="showUserInfo(getUserInfo(item).uid)"
            @menuClick="menuClick($event, item)"
            :userInfo="getUserInfo(item)"
            v-if="isShowHowComponent(item)"
            :item="item.msgContent.visitingCard"
            :isBurn="item.msgShowType === 3"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :fired="false"
          />
          <MVisitingCard
            v-else
            @clickCard="
              showUserInfo(
                item.msgContent.visitingCard.uid,
                'card',
                item.msgContent.visitingCard
              )
            "
            :item="item.msgContent.visitingCard"
            @menuClick="menuClick($event, item)"
            :isBurn="item.msgShowType === 3"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :fired="false"
            :isRead="item.msgId <= readMsgId"
          />
        </div>
        <!-- 语音消息 -->
        <div class="item" v-else-if="item.type === 'voiceMsg'">
          <YAudio
            @click="showUserInfo(getUserInfo(item).uid)"
            v-if="isShowHowComponent(item)"
            @menuClick="menuClick($event, item)"
            :userInfo="getUserInfo(item)"
            :isBurn="item.msgShowType === 3"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :fired="false"
            :voiceMsg="item.msgContent.voiceMsg"
            :msgId="item.msgId"
          />
          <MAudio
            v-else
            @menuClick="menuClick($event, item)"
            :isRead="item.msgId <= readMsgId"
            :isBurn="item.msgShowType === 3"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
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
            :isBurn="item.msgShowType === 3"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :fired="false"
            @onPlay="playMsgId = item.msgId"
            :playMsgId="playMsgId"
          />
          <MVideoFile
            v-else
            :isRead="item.msgId <= readMsgId"
            @menuClick="menuClick($event, item)"
            :videoMsgInfo="item.msgContent.videoMsgInfo"
            :msgId="item.msgId"
            :isBurn="item.msgShowType === 3"
            :replyMsg="getReply(item)"
            :replyUserInfo="getUserInfo(getReply(item))"
            :fired="false"
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
        :style="style"
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
          v-if="
            (copyItem.type === 'emojiInfo' &&
              copyItem.fromId !== store.state.userInfo.uid) ||
            copyItem.type !== 'emojiInfo' ||
            copyItem.fromId === store.state.userInfo.uid
          "
          @click="reply(copyItem)"
          >{{ t('回复') }}</span
        >
        <span
          v-if="copyItem.type !== 'voiceMsg' && copyItem.type !== 'emojiInfo'"
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
        <span
          v-if="
            (['emojiInfo'].includes(copyItem.type) &&
              copyItem.fromId !== store.state.userInfo.uid) ||
            ['imageMsg'].includes(copyItem.type)
          "
          @click="addToCollection(copyItem)"
          >{{ t('添加到收藏') }}</span
        >
        <span v-if="isShowHowComponent(copyItem)" @click="delMsg(copyItem)">{{
          t('删除')
        }}</span>
      </div>
    </div>
    <div
      class="goBottom"
      v-if="unRead"
      @click.stop="
        unRead = 0;
        scroll();
      "
    >
      <div class="tag">
        <Badge :num="unRead" />
      </div>
      <Iconfont
        name="iconleft"
        size="20"
        color="#929292"
        style="transform: rotate(-90deg)"
      />
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
  reactive,
  effect,
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
  useGetGroupHistoryMsg,
} from '@/hooks/window';
import { IGroupInfo, IUserDetailInfo, IUserInfo } from '@/types/user';
import { Toast } from '@/plugin/Toast';
import ClipboardJS from 'clipboard';
import { MediaAudio } from '@/plugin/Audio';
import { hideLoading, showLoading } from '@/plugin/Loading';
import Badge from '@/components/Badge/index.vue';

const search = reactive({
  inputVal: '',
  showBox: false,
});

const searchRef: Ref<HTMLInputElement | null> = ref(null);

const callback = async (e: any) => {
  if (e.ctrlKey && e.keyCode === 70) {
    search.showBox = true;
    await nextTick();
    searchRef.value?.focus();
  } else if (e.keyCode === 27) {
    search.showBox = false;
    search.inputVal = '';
    queryInfo.selectList = [];
    queryInfo.index = 0;
  }
};
document.body.addEventListener('keydown', callback);

const unRead = ref(0);
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
  visitingCard?: IVisitingCard
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
    if (props.groupDetailInfo?.groupAttachInfo?.groupMemberSplit) {
      return Toast('群员不能互相访问详情，请咨询管理员');
    }

    emit('toggleBox', uid);
    emit('changeTag', Etag.UserInfo);
  }
};
const { t } = useI18n();
const style: Ref<any> = ref({});

const copyItem = ref({} as IMsgInfo<string>);
let clipboard: any = null;

const scroll = () => {
  if (msgWindow.value) {
    msgWindow.value.scrollIntoView();
    msgWindow.value.scrollTop = msgWindow.value.scrollHeight;
  }
};

const status: Ref<boolean> = ref(true);
const scrollEvent = async (e: any) => {
  const clientHeight = e.target.clientHeight;
  const scrollTop = e.target.scrollTop;
  const scrollHeight = e.target.scrollHeight;

  if (clientHeight + scrollTop >= scrollHeight) {
    unRead.value = 0;
  }

  const id = msgWindow.value.querySelector('.Message').firstElementChild.id;
  if (status.value && scrollTop <= 0 && !!store.state?.activeUid) {
    status.value = false;
    const data = await useGetGroupHistoryMsg(
      store,
      store.state?.msgList[store.state?.activeUid]
    );
    await nextTick();
    msgWindow.value.scrollTo({
      top: msgWindow.value.querySelector('div[id="' + id + '"]').offsetTop,
      behavior: 'instant',
    });
    status.value = !!data;
  }
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
  msgWindow.value?.addEventListener('scroll', scrollEvent);
});
onUnmounted(() => {
  clipboard && clipboard.destroy();
  document.body.removeEventListener('keydown', callback);
  msgWindow.value?.removeEventListener('scroll', scrollEvent);
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
  toggleSearch: {
    type: Boolean,
  },
});

watch(
  () => props.toggleSearch,
  () => {
    search.showBox = !search.showBox;
  }
);

const isEnterInputVal = ref('');
// 点击确定查询选中的文案
const searchRefKeyDownCallBack = async (e: any) => {
  if (e.keyCode === 13) {
    // const data = await store.dispatch('postMsg', {
    //   query: {
    //     isGroupMsg: 0,
    //     objectId: store.state.activeUid,
    //     searchType: 4,
    //     keyWord: search.inputVal,
    //   },
    //   cmd: 2063,
    //   encryption: 'Aoelailiao.Message.UserSearchHistoryMsgReq',
    //   auth: true,
    // });
    // console.log(data);

    const val = (isEnterInputVal.value = search.inputVal);
    if (val) {
      queryInfo.selectList = [];
      itemChat.value.readList.forEach((e) => {
        if (e.msgContent?.stringContent?.includes(val)) {
          queryInfo.selectList.push(e.msgId);
        }
      });
    } else {
      queryInfo.selectList = [];
    }
    queryInfo.index = queryInfo.selectList.length - 1;
    setTimeout(() => {
      goNext();
    }, 0);
    if (!queryInfo.selectList.length && val) {
      return Toast(t('没有找到任何相关内容'));
    }
  }
};
watch(
  () => search.showBox,
  async (val) => {
    if (val) {
      await nextTick();
      searchRef.value?.addEventListener('keydown', searchRefKeyDownCallBack);
    } else {
      isEnterInputVal.value = '';
      await nextTick();
      searchRef.value?.removeEventListener('keydown', searchRefKeyDownCallBack);
    }
  }
);

// 消息列表
const list = computed(() => store.state.msgList);
const itemChat: ComputedRef<ImsgItem> = computed(() => {
  let activeList = list.value[store.state.activeUid!] || {};
  activeList.readList = arrDistinctByProp(activeList.readList, 'clientMsgUuid');
  return activeList;
});

const queryInfo = reactive<{ selectList: Array<any>; index: number }>({
  selectList: [],
  index: 0,
});

// 自动查询选中的文案
// watch(
//   () => search.inputVal,
//   async (val) => {
//     if (val) {
//       queryInfo.selectList = [];
//       itemChat.value.readList.forEach((e) => {
//         if (e.msgContent?.stringContent?.includes(val)) {
//           queryInfo.selectList.push(e.msgId);
//         }
//       });
//     } else {
//       queryInfo.selectList = [];
//     }
//     queryInfo.index = queryInfo.selectList.length - 1;
//     setTimeout(() => {
//       goNext();
//     }, 0);
//     if (!queryInfo.selectList.length && val) {
//       return Toast(t('没有找到任何相关内容'));
//     }
//   }
// );

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

const menuClick = (e: any, data: IMsgInfo<string>) => {
  let boxHeader = 175;
  if (data.type === 'voiceMsg') {
    boxHeader = 80;
  }

  if (
    75 + e.pageX > window.innerWidth &&
    boxHeader + e.pageY > window.innerHeight - 50
  ) {
    style.value.right = 0;
    style.value.bottom = '50px';
    style.value.left = 'auto';
    style.value.top = 'auto';
  } else if (75 + e.pageX > window.innerWidth) {
    style.value.right = 0;
    style.value.top = e.pageY + 'px';
    style.value.left = 'auto';
    style.value.bottom = 'auto';
  } else if (boxHeader + e.pageY > window.innerHeight - 50) {
    style.value.bottom = '50px';
    style.value.left = e.pageX + 'px';
    style.value.right = 'auto';
    style.value.top = 'auto';
  } else {
    style.value.left = e.pageX + 'px';
    style.value.top = e.pageY + 'px';
    style.value.bottom = 'auto';
    style.value.right = 'auto';
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
// 回复相关信息
const replyData = computed(() => store.state.replyData);

onMounted(() => {
  document.body.addEventListener('click', bodyClickCb);
  store.commit(
    'SET_REPLYMSG',
    replyData.value[store.state.activeUid]?.replyMsg
  );
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

// 获取回复的信息
const getReply = (item: IMsgInfo<string>) => {
  let msgInfo = itemChat.value.readList.find(
    (e) => e.msgId === item.replyMsgId
  ) as IMsgInfo;
  if (msgInfo == undefined && item.replyMsgId && item.replyMsgId != '0') {
    msgInfo = {
      msgId: 1,
    };
  }
  return msgInfo;
};

// 获取需要显示的头像信息
const getUserInfo: (item: IMsgInfo<string>) => IUserInfo = (item) => {
  let userInfos;
  if (!activeIsGroup.value) {
    userInfos =
      userInfo.value.uid === item?.fromId ? userInfo.value : props.yUserInfo;
  } else {
    userInfos =
      groupMemberLists.value.find((e) => e.uid === item?.fromId) ||
      userInfo.value;
  }
  return userInfos as IUserInfo;
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
    store.state.userInfo.uid
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
      if (
        msgWindow.value.scrollHeight <=
        msgWindow.value.clientHeight + msgWindow.value.scrollTop + 300
      ) {
        await nextTick;
        scroll();
        return;
      }
      // 单聊 除去自己端
      const msgInfos = data.body.msgInfos[0];
      const state = store.state;
      if (!state.activeIsGroup) {
        if (msgInfos.fromId === state.activeUid) {
          unRead.value++;
        } else {
          await nextTick;
          scroll();
          return;
        }
      } else {
        // 群聊 除去自己端
        if (
          msgInfos.fromId !== state.userInfo.uid &&
          msgInfos.toId === state.activeUid
        ) {
          unRead.value++;
        } else {
          await nextTick;
          scroll();
          return;
        }
      }

      // await nextTick;
      // scroll();
    }
  }
);

watch(
  computed(() => store.state.msgInfo),
  (e) => {
    if (e.cmd === 2146) {
      nextTick(() => {
        scroll();
      });
    }
  }
);

onUnmounted(() => {
  stop();
});

// 回复消息
const reply = (item: IMsgInfo<string>) => {
  replyData.value[store.state.activeUid] = {
    showReplyBox: true,
    replyMsg: item,
    replyUser: getUserInfo(item).nickname,
  };
  store.commit('SET_REPLYDATA', replyData);
  store.commit('SET_REPLYMSG', replyData.value[store.state.activeUid].replyMsg);
};

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
        }
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

// 添加到收藏
const addToCollection = async (copyItem: any) => {
  let url = '';
  if (copyItem.type === 'emojiInfo') {
    url = copyItem.msgContent.emojiInfo.url;
  } else {
    url = copyItem.msgContent.imageMsg.imageUrl;
  }

  const query = {
    optype: 10,
    url,
  };
  const data = await store.dispatch('postMsg', {
    query,
    cmd: 2037,
    encryption: 'Aoelailiao.Message.ImageOperateReq',
    auth: true,
  });
  Toast(t(data.body.resultString));
};

const goNext = async (val?: string) => {
  if (val === '+') {
    if (queryInfo.index < queryInfo.selectList.length - 1) {
      queryInfo.index++;
    }
  } else if (val === '-') {
    if (queryInfo.index > 0) {
      queryInfo.index--;
    }
  }
  const dom = document.getElementById(queryInfo.selectList[queryInfo.index]);
  dom?.scrollIntoView({
    behavior: 'smooth', //顺滑的滚动
    block: 'center', //容器上下的中间
    inline: 'start', //容器左右的左边
  });
};

const imgLoadEventList: Ref<Array<number>> = ref([]);
const addImgLoadEvent = (e: any) => {
  imgLoadEventList.value.push(e.msgId);
};
const delImgLoadEvent = (e: any) => {
  const index = imgLoadEventList.value.findIndex((v) => v === e.msgId);
  imgLoadEventList.value.splice(index, 1);
};
watch(imgLoadEventList.value, (val) => {
  if (!val.length) {
    scroll();
  }
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.goBottom {
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 999;
  width: 36px;
  height: 36px;
  background: #fff;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.12);
  .tag {
    position: absolute;
    width: 30px;
    bottom: 80%;
    left: 50%;
    transform: translateX(-50%);
  }
}
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
    position: fixed;
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
      width: 65px;
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
.search {
  height: 50px;
  border-top: 1px solid #f0f1f4;
  border-bottom: 1px solid #f0f1f4;
  background: #fff;
  position: absolute;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  left: 0;
  right: 0;
  top: 0;
  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top {
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #0085ff;
      border-left: 2px solid #0085ff;
      transform: rotate(-45deg) translateY(-5px);
      margin-right: 15px;
      cursor: pointer;
      &.disable {
        border-bottom: 2px solid #ddd;
        border-left: 2px solid #ddd;
      }
    }
    .bottom {
      cursor: pointer;
      width: 10px;
      height: 10px;
      border-top: 2px solid #0085ff;
      border-right: 2px solid #0085ff;
      transform: rotate(-45deg) translateY(5px);
      &.disable {
        border-top: 2px solid #ddd;
        border-right: 2px solid #ddd;
      }
    }
  }
  .intputBg {
    flex: 1;
    margin: 0 20px;
    height: 30px;
    background: #f0f1f4;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    input {
      width: 100%;
      font-size: 14px;
      padding-left: 5px;
    }
  }
  .num {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #050505;
    line-height: 17px;
    margin-right: 20px;
  }
  .close {
    cursor: pointer;
    transform: rotate(45deg);
  }
}
</style>
