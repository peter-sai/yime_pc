<template>
  <div class="recommend">
    <NavigationBar
      :title="isCreateGroupChat ? '选择联系人' : '推荐好友'"
      hide-left
      disable-left
    >
      <template v-slot:left>
        <Iconfont
          v-if="!isCreateGroupChat"
          class="pointer"
          @click="$emit('toggleBox')"
          name="iconfork"
          size="20"
        />
        <Iconfont
          v-else
          name="iconleft"
          size="20"
          @click="$emit('changeTag', Etag.UserInfo)"
        />
      </template>
    </NavigationBar>
    <div style="margin: 15px 10px">
      <Search :placeholder="t('搜索')" v-model="search" :width="60" />
    </div>
    <div class="main">
      <div class="content">
        <div class="item" v-for="(item, key) in newList" :key="item.uid">
          <div v-if="item.tag && key === 0" class="tag">{{ item.tag }}</div>
          <div
            v-else-if="item.tag && newList[key - 1].tag !== item.tag"
            class="tag"
          >
            {{ item.tag }}
          </div>
          <Table :title="item.name" hideMore @click="toggleActive(item)">
            <template v-slot:left>
              <img v-if="item.icon" :src="item.icon" alt="" />
              <Iconfont v-else name="iconlianxiren" size="30" color="#A8B5BE" />
            </template>
            <template v-slot:right>
              <Iconfont
                name="icondanxuankuang"
                v-if="item.active"
                size="14"
                color="#0085FF"
              />
              <Iconfont name="iconradio" v-else size="14" color="#BDBDBD" />
            </template>
          </Table>
        </div>
      </div>
      <div
        class="btn"
        :class="{
          active: isCreateGroupChat
            ? true
            : newList.filter((e) => e.active).length,
        }"
        @click="submit"
      >
        {{ t('确定') }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Table from '@/components/Table/index.vue';
import { Etag } from '../index.vue';
import {
  defineComponent,
  Ref,
  ref,
  computed,
  defineEmits,
  defineProps,
} from 'vue';
import Iconfont from '@/iconfont/index.vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import Search from '@/components/Search/index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { IContacts } from '@/types/user';
import { getTag } from '@/utils/utils';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';
import { hideLoading, showLoading } from '@/plugin/Loading';
export default defineComponent({
  name: 'recommend',
});
</script>
<script setup lang="ts">
const emit = defineEmits(['changeTag', 'toggleBox', 'blackListToast']);
const props = defineProps({
  isCreateGroupChat: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();
const store = useStore(key);
const list: Ref<IContacts[]> = ref([]);
const activeUid = store.state.activeUid;
const userId = store.state.userUid;
const search = ref('');
// 获取列表
const init = async () => {
  try {
    const res = {};
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1009,
      encryption: 'Aoelailiao.Login.UserGetFriendsAndGroupsListReq',
      auth: true,
    });

    list.value = data.body.friendInfos.filter(
      (e: IContacts) =>
        Number(e.uid) !== Number(activeUid) || props.isCreateGroupChat
    );
    list.value.forEach((e: IContacts) => {
      e.name = (e.userAttachInfo && e.userAttachInfo.remarkName) || e.nickname;
      e.tag = getTag(e);
      if (Number(e.uid) === Number(userId)) {
        e.active = true;
      } else {
        e.active = false;
      }
    });
    list.value.sort((a, b) => a.tag.charCodeAt(0) - b.tag.charCodeAt(0));
  } catch (error) {
    console.log(error);
  }
};
init();

const newList = computed(() =>
  list.value.filter((e) => e.name.includes(search.value))
);

// 切换选中状态
const toggleActive = (item: IContacts) => {
  if (Number(item.uid) === Number(userId)) return;
  item.active = !item.active;
};

const submit = async () => {
  const activeList = newList.value.filter((e) => e.active);

  // 推荐
  if (!props.isCreateGroupChat) {
    if (!activeList.length) return;
    // const isGroup = route.query.isGroup ? 1 : 0;
    // 将别人分享给自己
    activeList.forEach(async (e) => {
      const userInfo = store.state.userInfo;
      const res = {
        msgInfo: {
          isGroupMsg: 0,
          fromId: userInfo.uid,
          toId: store.state.activeUid,
          msgShowType: 1,
          isEncrypt: 0,
          msgContent: {
            msgContentType: 15,
            msgContent: 'visitingCard',
            visitingCard: {
              type: 0,
              uid: e.uid,
              icon: e.icon,
              name: e.name || e.nickname,
              showContent: '个人名片',
              sourceTime: Date.now(),
            },
          },
        },
      };
      if (store.state.replyMsg?.msgId) {
        res.msgInfo.replyMsgId = store.state.replyMsg?.msgId;
      }
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 2001,
        encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
        auth: true,
      });
      if(data.body.resultCode == 1535){
        throw emit('blackListToast', {store, t, yUserInfo:{uid:store.state.activeUid}, title: t('该用户已注销,是否将其移除好友列表,并清空聊天会话?')})
      }
      Toast(t(data.body.resultString));
      if (data.body.resultCode === 0) {
        emit('toggleBox');
        reset();
      }
    });
  } else {
    // 创建群聊
    if (activeList.length < 1) return;
    // 获取个人信息 (群主)
    const userInfo = store.state.userInfo;

    const memberUserInfos = activeList.map((e) => {
      return {
        memberUid: e.uid,
      };
    });
    memberUserInfos.unshift({
      memberUid: userInfo.uid,
    });

    if (!memberUserInfos.find((e) => Number(e.memberUid) === Number(userId))) {
      memberUserInfos.push({
        memberUid: userId,
      });
    }
    showLoading();
    // 创建群
    const data = await store.dispatch('postMsg', {
      query: {
        operateType: 1,
        groupInfo: {
          groupMemberLists: {
            rootUid: userInfo.uid,
            memberUserInfos,
          },
        },
      },
      cmd: 1027,
      encryption: 'Aoelailiao.Login.UserOperateGroupInfoReq',
      auth: true,
    });
    hideLoading();
    Toast(t(data.body.resultString));
    if (data.body.resultCode === 0) {
      const groupInfo = data.body.groupInfo;
      store.commit('SET_ACTIVEUID', groupInfo.groupId);
      store.commit('SET_ACTIVEISGROUP', true);
    }
  }
};
function reset() {
  const replyData: any = computed(() => store.state.replyData);
  const activeUid: any = computed(() => store.state.activeUid);
  if (replyData.value && activeUid.value) {
    replyData.value[activeUid.value] = {
      showReplyBox: false,
      replyMsg: {},
      replyUser: '',
    };
    store.commit('SET_REPLYDATA', replyData);
    store.commit('SET_REPLYMSG', {});
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.recommend {
  height: 100%;
  display: flex;
  flex-direction: column;
  .main {
    height: 100%;
    position: relative;
    overflow: auto;
    .content {
      box-sizing: border-box;
      padding: 8px 13px;
      padding-bottom: 70px;
      .item {
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .tag {
          font-size: 14px;
          padding: 5px 0;
          color: #0085ff;
          background: #f4f4f4;
          margin: 0 -13px;
          padding-left: 17px;
        }
        .table {
          cursor: pointer;
          padding: 9px 0;
        }
      }
    }
    .btn {
      font-size: 14px;
      position: fixed;
      bottom: 0;
      right: 0;
      font-family: SourceHanSansCN, SourceHanSansCN-Medium;
      font-weight: 500;
      color: #ffffff;
      width: 320px;
      height: 50px;
      background: #aaa;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        background: #0085ff;
        cursor: pointer;
      }
    }
  }
}
</style>
