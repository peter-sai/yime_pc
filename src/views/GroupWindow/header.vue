<template>
  <div class="groupChatHeader">
    <div class="addGroup" v-if="groupCallState?.callState && !conversationing">
      <div class="left"></div>
      <div class="middle">{{ t('加入群通话') }}</div>
      <div class="right">
        <span @click="addGroupChat">{{ t('加入') }}</span>
      </div>
    </div>
    <div class="header">
      <div class="headerLeft">
        <div class="userImg">
          <img v-if="icon" :src="icon" alt="" />
          <span v-else>{{
            title ? title.substr(0, 1).toLocaleUpperCase() : ''
          }}</span>
        </div>
        <div class="userInfo">
          <div class="name">{{ title }}</div>
          <div class="subTitle">{{ subTitle }}</div>
        </div>
      </div>
      <div class="headerRight" v-if="isShowRight">
        <Iconfont @click="queryClick" name="iconsousuo" size="20" />
        <Iconfont @click="rightClick" name="icondiandian" size="20" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  defineEmits,
  defineProps,
  PropType,
} from 'vue';
export default defineComponent({
  name: 'groupChatHeader',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { Etag } from '../Layout/index.vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { key } from '@/store';
const emit = defineEmits(['toggleBox', 'changeTag', 'queryClick']);
const rightClick = () => {
  emit('toggleBox');
  emit('changeTag', Etag.GroupInfo);
};
const queryClick = () => {
  emit('queryClick');
};
const props = defineProps({
  title: {
    type: String,
  },
  subTitle: {
    type: String || Number,
  },
  icon: {
    type: String,
  },
  groupCallState: {
    type: Object as PropType<{
      callState: number;
      groupId: number;
      userId: number[];
    }>,
  },
  isShowRight: {
    type: Boolean,
  },
});
const { t } = useI18n();
const store = useStore(key);
const addGroupChat = async () => {
  const data = await store.dispatch('postMsg', {
    query: {
      groupId: store.state.activeUid,
    },
    cmd: 2159,
    encryption: 'Aoelailiao.Message.GroupCallApplyJoinToServserReq',
    auth: true,
  });
};
const conversationing = computed(() => store.state.conversationIng);
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.groupChatHeader {
  .addGroup {
    height: 50px;
    background: #0085ff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    div {
      flex: 1;
    }
    .middle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
    }
    .right {
      text-align: right;
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        width: 50px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid #ffffff;
        text-align: center;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
      }
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    height: 64px;
    align-items: center;
    padding: 0 21px;
    border-bottom: 1px solid #eaebea;
    background: #fff;
    .headerLeft {
      display: flex;
      .userImg {
        img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: #0085ff;
          font-size: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
        }
      }
      .userInfo {
        padding-bottom: 5px;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        justify-content: space-between;
        .name {
          height: 20px;
          font-size: 14px;
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 500;
          color: #0a0a0a;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 250px;
        }
        .subTitle {
          height: 10px;
          font-size: 10px;
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: left;
          color: #999999;
          line-height: 15px;
        }
      }
    }
    .headerRight {
      display: flex;
      align-items: center;
      .iconfont {
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
}
</style>
