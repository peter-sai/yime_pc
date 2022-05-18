<template>
  <div class="groupWindow">
    <!-- 群 -->
    <GroupChatHeader
      :title="groupDetailInfo.groupName"
      :groupCallState="groupCallState"
      @queryClick="queryClick"
      :subTitle="
        groupDetailInfo.groupMemberLists
          ? groupDetailInfo.groupMemberLists.memberUserInfos.length.toString()
          : ''
      "
      :icon="groupDetailInfo.groupIcon"
      @toggleBox="toggleBox"
      @changeTag="changeTag"
      :isShowRight="
        groupDetailInfo.groupState === 1 &&
        memberUserInfos.includes(store.state.userInfo.uid)
      "
    />

    <!-- 消息内容 -->
    <div class="msg">
      <Message
        :key="store.state.key"
        v-if="groupDetailInfo.groupId"
        ref="message"
        :groupDetailInfo="groupDetailInfo"
        @toggleBox="toggleBox"
        @changeTag="changeTag"
        @selectGroupMember="ShowSelectGroupMember"
      />
    </div>

    <Bottom
      v-if="
        groupDetailInfo.groupState === 1 &&
        memberUserInfos.includes(store.state.userInfo.uid)
      "
      v-model="inputVal"
      :groupDetailInfo="groupDetailInfo.groupId ? groupDetailInfo : undefined"
      :isGroupMember="
        (groupDetailInfo?.groupMemberLists?.memberUserInfos || []).some(
          (e) => Number(e.memberUid) === Number(store.state.userInfo.uid)
        )
      "
      @sendImg="sendImg('img')"
      @selectGroupMember="ShowSelectGroupMember"
      @enter="enter"
      @sendFile="sendImg('file')"
      @atUserInfoLists="getAtUserInfoList"
      :atUserInfoList="atUserInfoList"
    />

    <div
      class="btnBox"
      v-if="
        groupDetailInfo.groupState === 1 &&
        !memberUserInfos.includes(store.state.userInfo.uid)
      "
    >
      <div @click="addGroup" class="btn">{{ t('加入群聊') }}</div>
    </div>
    <!-- 文件 和 图片选择 -->
    <input ref="changUserImg" type="file" hidden :accept="accept" multiple />

    <!-- 弹框 -->
    <div>
      <transition name="fade">
        <div v-if="showBox" class="box" @click.stop="showBox = false" />
      </transition>
      <!-- 群资料 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.GroupInfo" class="boxContent">
          <GroupInfo
            :groupDetailInfo="groupDetailInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
            @updateUser="updateUser"
          />
        </div>
      </transition>
      <!-- 编辑群资料 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.EditGroup" class="boxContent">
          <EditGroup
            :groupDetailInfo="groupDetailInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
          />
        </div>
      </transition>
      <!-- 编辑群资料 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.AddGroupType" class="boxContent">
          <AddGroupType
            :groupDetailInfo="groupDetailInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
          />
        </div>
      </transition>
      <!-- 添加群成员 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.AddGroupMembers" class="boxContent">
          <AddGroupMembers
            :groupDetailInfo="groupDetailInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
          />
        </div>
      </transition>

      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.UserInfo" class="boxContent">
          <!-- 用户资料 -->
          <UserInfo
            :userDetailInfo="userDetailInfo"
            :yUserInfo="userInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
            :title="groupDetailInfo.groupName"
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
      <!-- 群管理 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.GroupSetting" class="boxContent">
          <GroupSetting
            @toggleBox="toggleBox"
            @changeTag="changeTag"
            :groupDetailInfo="groupDetailInfo"
          />
        </div>
      </transition>
      <!-- 选择群视频成员 -->
      <transition name="fade-transform1" mode="out-in">
        <div
          v-if="showBox && tag === Etag.SelectGroupMemberVideos"
          class="boxContent"
        >
          <SelectGroupMemberVideos
            :groupDetailInfo="groupDetailInfo"
            :mediaType="mediaType"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
          />
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
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed,
  ComputedRef,
  watch,
} from 'vue';
import UserInfo from '../Layout/Chat/userInfo.vue';
import Recommend from '../Layout/Chat/recommend.vue';
import CloudFile from '../Layout/Chat/cloudFile.vue';
import CommonGroup from '../Layout/Chat/commonGroup.vue';
import SelectGroupMemberVideos from '../Layout/GroupChat/selectGroupMemberVideos.vue';
import Forward from '../Layout/Chat/Forward.vue';
import Message from '../Window/message.vue';
import { Store, useStore } from 'vuex';
import GroupChatHeader from './header.vue';
import GroupInfo from '../Layout/GroupChat/groupInfo.vue';
import GroupSetting from '../Layout/GroupChat/GroupSetting.vue';
import EditGroup from '../Layout/GroupChat/editGroup.vue';
import AddGroupType from '../Layout/GroupChat/addGroupType.vue';
import AddGroupMembers from '../Layout/GroupChat/addGroupMembers.vue';
import Bottom from '../Layout/bottom.vue';
import { Etag } from '../Layout/index.vue';
import { useEnter, useCbImg, useSendImg } from '@/hooks/window';
import { useI18n } from 'vue-i18n';
import { ImsgItem } from '@/types/msg';
import { Toast } from '@/plugin/Toast';
export default defineComponent({
  name: 'groupWindow',
});

async function getGroupInfo(store: Store<initStore>) {
  if (!store.state.activeUid) return;

  let msgItem: Ref<ImsgItem> = ref(store.state.msgList[store.state.activeUid!]);
  // 如果不存在则获取 (群聊不在聊天列表中会没有信息)
  if (!msgItem.value) {
    const data = await store.dispatch('postMsg', {
      query: {
        groupId: store.state.activeUid,
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
</script>
<script setup lang="ts">
defineEmits(['toggleBox', 'changeTag']);
// 视频还是语音
const mediaType = ref(1);
const atUserInfoList: Ref<IUserInfo[]> = ref([]);
const { t } = useI18n();
const userUid = computed(() => store.state.userUid);
const userInfo: ComputedRef<IUserInfo> = computed(
  () => store.state.msgList[userUid.value!]?.userDetailInfo?.userInfo || {}
); // 需要显示详情用户的信息
const userDetailInfo: ComputedRef<IUserDetailInfo | null> = computed(
  () => store.state.msgList[userUid.value!]?.userDetailInfo || {}
);
const groupCallState: Ref<{
  callState: number;
  groupId: number;
  userId: number[];
}> = ref({}) as Ref<{
  callState: number;
  groupId: number;
  userId: number[];
}>;
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
  const userUid = store.state.userUid;
  if (!msgItem) {
    const res = {
      uid: userUid,
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1011,
      encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
      auth: true,
    });
    msgItem = data.body;
  }
  const newMsgList = store.state.msgList[userUid!];
  if (newMsgList) {
    newMsgList.userDetailInfo = msgItem?.userDetailInfo || {};
    store.commit('SET_MSGLISTITEM', {
      res: newMsgList,
      uid: userUid,
    });
  } else {
    const item = {
      readList: [],
      isGroup: 0,
      id: userUid,
      unReadNum: 0,
      isBotUser: false,
      userDetailInfo: msgItem?.userDetailInfo || {},
      lastMsg: {},
      groupDetailInfo: {},
    };
    store.commit('SET_MSGLISTITEM', {
      res: item,
      uid: userUid,
    });
  }
  showBox.value = !showBox.value;
};
const updateUser = async (uid?: number) => {
  const userId = uid || store.state.activeUid;
  store.commit('SET_USERUID', userId);
  let msgItem: ImsgItem = store.state.msgList[store.state.userUid!];
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

  const userUid = store.state.userUid;
  const newMsgList = store.state.msgList[userUid!];
  if (newMsgList) {
    newMsgList.userDetailInfo = msgItem?.userDetailInfo || {};
    store.commit('SET_MSGLISTITEM', {
      res: newMsgList,
      uid: userUid,
    });
  } else {
    const item = {
      readList: [],
      isGroup: 0,
      id: userUid,
      unReadNum: 0,
      isBotUser: false,
      userDetailInfo: msgItem?.userDetailInfo || {},
      lastMsg: {},
      groupDetailInfo: {},
    };
    store.commit('SET_MSGLISTITEM', {
      res: item,
      uid: userUid,
    });
  }
};
// 右侧显示的内容
const tag = ref<Etag>(Etag['UserInfo']);
const changeTag = (val: Etag) => {
  tag.value = val;
};
const store = useStore(key);

const groupDetailInfo: ComputedRef<IGroupInfo> = computed(
  () => store.state.msgList[store.state.activeUid!]?.groupDetailInfo || {}
);

const memberUserInfos = computed(
  () =>
    groupDetailInfo.value?.groupMemberLists?.memberUserInfos?.map(
      (e) => e.memberUid
    ) || []
);

async function init() {
  // 查询 群 通话状态
  const data = await store.dispatch('postMsg', {
    query: {
      groupCallState: {
        groupId: store.state.activeUid,
      },
    },
    cmd: 2153,
    encryption: 'Aoelailiao.Message.GroupCallStateNotifyToServserReq',
    auth: true,
  });
  groupCallState.value = data.body.groupCallState;
  getGroupInfo(store);
}
init();

watch(
  computed(() => store.state.msgInfo),
  async (data: any) => {
    // GroupCallNotifyToClient
    if (data.cmd === 2156) {
      groupCallState.value = data.body.groupCallState;
    }
  }
);

const inputVal = ref('');

// 文件选择类型
const accept = ref('image/*,video/*');
const changUserImg: Ref<HTMLInputElement | null> = ref(null);

const cbImg = useCbImg(store, accept, t, 1);

onMounted(async () => {
  changUserImg.value!.addEventListener('change', (e) => {
    cbImg(e, store.state.activeUid);
    changUserImg.value?.setAttribute('type', 'text');
  });
});

onBeforeUnmount(() => {
  changUserImg.value!.removeEventListener('change', cbImg);
});

// 选择群成员进行音视频通话
const ShowSelectGroupMember = (e: number) => {
  mediaType.value = e;
  toggleBox();
  changeTag(Etag.SelectGroupMemberVideos);
};

// 发送消息
const enter = useEnter(store, inputVal, 1, t);
// 发送图片
const sendImg = useSendImg(store, 1, t, changUserImg, accept, nextTick);

// 获取at 用户列表
const getAtUserInfoList = (userInfoList: IUserInfo[]) => {
  atUserInfoList.value = userInfoList;
};

// 加入群聊
const addGroup = async () => {
  const query = {
    operateType: 2,
    groupInfo: {
      groupId: store.state.activeUid,
      groupMemberLists: {
        ...groupDetailInfo.value.groupMemberLists,
        memberUserInfos: [
          ...groupDetailInfo.value.groupMemberLists.memberUserInfos,
        ],
      },
    },
  };
  query.groupInfo.groupMemberLists.memberUserInfos.push({
    memberUid: store.state.userInfo.uid,
    joinType: 3,
    inviteUid: query.groupInfo.groupMemberLists.rootUid,
  });
  const data = await store.dispatch('postMsg', {
    query,
    cmd: 1027,
    encryption: 'Aoelailiao.Login.UserOperateGroupInfoReq',
    auth: true,
  });
  Toast(t(data.body.resultString));
};

const message: Ref<typeof Message | null> = ref(null);
const queryClick = () => {
  if (message.value?.search.showBox) {
    message.value.search.showBox = !message.value.search.showBox;
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.groupWindow {
  .msg {
    position: absolute;
    top: 65px;
    left: 0;
    right: 0;
    bottom: 50px;
    padding: 20px;
    z-index: -1;
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
  .btnBox {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    .btn {
      height: 22px;
      font-size: 16px;
      font-weight: 400;
      text-align: center;
      line-height: 22px;
      color: #fff;
      width: 142px;
      height: 44px;
      background: linear-gradient(130deg, #2999ff 8%, #0064c1 96%);
      border-radius: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
