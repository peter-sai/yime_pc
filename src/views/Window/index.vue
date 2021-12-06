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

    <div class="bottom">
      <Bottom />
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
            :yUserInfo="yUserInfo"
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
          <Recommend @toggleBox="toggleBox" @changeTag="changeTag" />
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { initStore, key } from '@/store';
import { IUserDetailInfo, IUserInfo } from '@/types/user';
import { defineComponent, ref, Ref, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { getTime } from '@/utils/utils';
import { Store, useStore } from 'vuex';
import UserInfo from '../Layout/userInfo.vue';
import CloudFile from '../Layout/cloudFile.vue';
import CommonGroup from '../Layout/commonGroup.vue';
import Recommend from '../Layout/recommend.vue';
import ChatHeader from './header.vue';
import Bottom from '../Layout/bottom.vue';
import { Etag } from '../Layout/index.vue';

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
  const res = {
    uid: store.state.activeUid,
  };
  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 1011,
    encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
    auth: true,
  });

  if (data.body.userDetailInfo.userInfo.isBotUser) {
    isBotUser.value = true;
  } else {
    isBotUser.value = false;
  }

  userDetailInfo.value = data.body?.userDetailInfo || {};
  yUserInfo.value = data.body?.userDetailInfo?.userInfo || {};
  return data;
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
</script>
<script setup lang="ts">
defineEmits(['toggleBox', 'changeTag']);
const { t } = useI18n();
const writeState = ref(0); //0--结束输入(未输入), 1--正在输入
const store = useStore(key);
const userDetailInfo: Ref<IUserDetailInfo> = ref({}) as Ref<IUserDetailInfo>;
const yUserInfo: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>;
const isBotUser = ref(false);
const onlineInfo: Ref<IUserInfo> = ref({}) as Ref<IUserInfo>;

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

async function init() {
  // 获取用户详细资料
  await useGetDetail(store, userDetailInfo, isBotUser, yUserInfo);
  // 获取用户登录状态
  await useStatus(store, onlineInfo);
}

init();
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.window {
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
  .bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    position: absolute;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-top: 1px solid #eaebea;
    display: flex;
    justify-content: space-between;
  }
}
</style>
