<template>
  <div class="layout">
    <div class="left">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <div class="right">
      <div class="noChat chat" v-if="!store.state.activeUid">
        <div>{{ t('请选择一个对话开始聊天') }}</div>
      </div>
      <div class="chat" v-else>
        <!-- 反馈&系统消息 -->
        <SystemWindow
          v-if="[1, 2, 3].includes(store.state.activeUid)"
          :key="store.state.activeUid"
        />
        <div v-else>
          <!-- 个人 -->
          <Window
            v-if="!store.state.activeIsGroup"
            :key="store.state.activeUid"
          />
          <!-- 群 -->
          <GroupWindow
            v-if="store.state.activeIsGroup"
            :key="store.state.activeUid"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import SystemWindow from '../SystemWindow/index.vue';
import Window from '../Window/index.vue';
import GroupWindow from '../GroupWindow/index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

export enum Etag {
  UserInfo,
  GroupInfo,
  EditGroup,
  CloudFile,
  CommonGroup,
  Recommend,
  AddGroupType,
  CreateGroupChat,
  AddGroupMembers,
  Forward,
  SelectGroupMemberVideos,
}
export default defineComponent({
  name: 'Layout',
});
</script>
<script setup lang="ts">
const store = useStore(key);
const { t } = useI18n();
</script>
<style lang="scss" scoped>
.layout {
  display: flex;
  .left {
    width: 300px;
    border-right: 1px solid #eaebea;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
  }
  .right {
    position: fixed;
    left: 300px;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    z-index: 9;

    .chat {
      position: relative;
      z-index: 99;
      flex: 1;
      &.noChat {
        justify-content: center;
        align-items: center;
        display: flex;
        div {
          font-size: 12px;
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: left;
          color: #828282;
          line-height: 18px;
          letter-spacing: 1px;
          // width: 189px;
          padding: 0 20px;
          height: 26px;
          background: #f3f3f6;
          border-radius: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
