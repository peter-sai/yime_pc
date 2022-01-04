<template>
  <div class="groupWindow">
    <!-- 群 -->
    <GroupChatHeader
      :title="groupDetailInfo.groupName"
      :subTitle="
        groupDetailInfo.groupMemberLists
          ? groupDetailInfo.groupMemberLists.memberUserInfos.length.toString()
          : ''
      "
      :icon="groupDetailInfo.groupIcon"
      @toggleBox="toggleBox"
      @changeTag="changeTag"
    />

    <!-- 消息内容 -->
    <div class="msg">
      <Message
        v-if="groupDetailInfo.groupId"
        :groupDetailInfo="groupDetailInfo"
      />
    </div>

    <Bottom
      v-model="inputVal"
      @sendImg="sendImg('img')"
      @enter="enter"
      @sendFile="sendImg('file')"
    />
    <!-- 文件 和 图片选择 -->
    <input ref="changUserImg" type="file" hidden :accept="accept" />

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
    </div>
  </div>
</template>
<script lang="ts">
import { initStore, key } from '@/store';
import { IGroupInfo } from '@/types/user';
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
} from 'vue';
import Message from '../Window/message.vue';
import { Store, useStore } from 'vuex';
import GroupChatHeader from './header.vue';
import GroupInfo from '../Layout/GroupChat/groupInfo.vue';
import EditGroup from '../Layout/GroupChat/editGroup.vue';
import AddGroupType from '../Layout/GroupChat/addGroupType.vue';
import AddGroupMembers from '../Layout/GroupChat/addGroupMembers.vue';
import Bottom from '../Layout/bottom.vue';
import { Etag } from '../Layout/index.vue';
import { useEnter, useCbImg, useSendImg } from '@/hooks/window';
import { useI18n } from 'vue-i18n';
import { ImsgItem } from '@/types/msg';
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
    console.log(msgItem.value);

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
const { t } = useI18n();
// 是否显示右侧
const showBox = ref(false);
const toggleBox = () => {
  showBox.value = !showBox.value;
};
// 右侧显示的内容
const tag = ref<Etag>(Etag['UserInfo']);
const changeTag = (val: Etag) => {
  tag.value = val;
};

const groupDetailInfo: ComputedRef<IGroupInfo> = computed(
  () => store.state.msgList[store.state.activeUid!]?.groupDetailInfo || {},
);
const store = useStore(key);
async function init() {
  await getGroupInfo(store);
}
init();

const inputVal = ref('');

// 文件选择类型
const accept = ref('image/*');
const changUserImg: Ref<HTMLInputElement | null> = ref(null);

const cbImg = useCbImg(store, accept, t);

onMounted(async () => {
  changUserImg.value!.addEventListener('change', cbImg);
});

onBeforeUnmount(() => {
  changUserImg.value!.removeEventListener('change', cbImg);
});

// 发送消息
const enter = useEnter(store, inputVal, 1, null, t);
// 发送图片
const sendImg = useSendImg(store, 1, t, changUserImg, accept, nextTick);
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
    overflow: auto;
    padding: 20px;
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
