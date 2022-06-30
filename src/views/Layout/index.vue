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
      <!-- <div
        style="
          height: 40px;
          background: #d73232;
          font-size: 16px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        "
        v-if="store.state.isOnLine"
      >
        {{ t(store.state.isOnLine) }}
      </div> -->

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
      <div class="ondragover" v-show="isShowDragover">
        <div class="box" ref="dragover">
          <Iconfont name="iconwenjian2" size="30" color="#666" />
          {{ t('拖入要发送的文件') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue';
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
  SetBackground,
  GroupSetting,
  SetRemarkName
}
export default defineComponent({
  name: 'Layout',
});
</script>
<script setup lang="ts">
import Iconfont from '../../iconfont/index.vue';
import { Toast } from '@/plugin/Toast';
const store = useStore(key);
const { t } = useI18n();
const dragover: Ref<HTMLDivElement> = ref({}) as Ref<HTMLDivElement>;

const isShowDragover = ref(false);

let timer: any = null;
document.ondragover = () => {
  if (!store.state.activeUid) return;
  clearTimeout(timer);
  timer = setTimeout(function () {
    isShowDragover.value = false;
  }, 200);
  isShowDragover.value = true;
};
onMounted(() => {
  dragover.value.ondragover = function () {
    return false;
  };
  dragover.value.ondrop = function (ev: any) {
    const oFile = ev.dataTransfer.files[0];
    console.log(ev.dataTransfer.files);
    for (const e of ev.dataTransfer.files) {
      readFile(e);
    }
    return false;
  };
});

const readFile = (oFile: File) => {
  return new Promise((resovle, reject) => {
    const reader = new FileReader();
    //读取成功
    reader.onload = function () {
      store.commit('SET_DROPFILE', {
        url: reader.result,
        file: oFile,
      });
      resovle(reader.result);
    };
    reader.onabort = function () {
      Toast('读取中断');
    };
    reader.onerror = function () {
      Toast('读取失败');
    };
    reader.readAsDataURL(oFile);
  });
};
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
    flex-direction: column;
    .ondragover {
      background: rgba(255, 255, 255, 0.8);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 99;
      padding: 20px;
      .box {
        width: 100%;
        height: 100%;
        border: 2px dashed #666;
        font-size: 22px;
        font-weight: bold;
        color: #666;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
          margin-right: 10px;
        }
      }
    }
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
