<template>
  <div class="SystemWindow">
    <SystemWindowHeader :title="title" :icon="icon" />
    <!-- 消息内容 -->
    <div class="msg" v-if="store.state.activeUid === 1">
      <div v-for="item in systemList" :key="item.time">
        <Time>{{ formateTime(item.time, t) }}</Time>
        <div class="mmsg">
          <div class="img">
            <img src="img/systemNotify.svg" />
          </div>
          <div>
            <ImgBg>
              <span class="SystemWindowContent" v-html="item.text"></span>
              <img
                style="margin-top: 10px"
                :src="src"
                alt=""
                v-for="src in item.img"
                :key="src"
              />
            </ImgBg>
          </div>
        </div>
      </div>
    </div>
    <!-- 用户反馈 -->
    <div class="msg" v-else>
      <div v-for="item in feedbackList" :key="item.feedbackTime">
        <Time>{{ formateTime(item.feedbackTime, t) }}</Time>
        <div
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-end;
          "
        >
          <div class="box">
            <ImgBg isMe
              >{{ item.feedbackContent }}
              <div style="margin-top: 10px">
                <img
                  v-for="src in item.noticeImage"
                  :key="src"
                  :src="src"
                  alt=""
                />
              </div>
            </ImgBg>
          </div>
        </div>
        <Time>{{ formateTime(item.replyTime, t) }}</Time>
        <div class="mmsg">
          <div class="img">
            <img src="img/feedback.svg" />
          </div>
          <div>
            <ImgBg>
              <span class="SystemWindowContent">{{ item.replyContent }}</span>
            </ImgBg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { initStore, key } from '@/store';
import { computed, defineComponent, reactive, Ref, ref } from 'vue';
import { Store, useStore } from 'vuex';
import Mmsg from '@/components/Message/Mmsg/index.vue';
import Ymsg from '@/components/Message/Ymsg/index.vue';
import ImgBg from '@/components/Message/ImgBg/index.vue';
import Time from '@/components/Time/index.vue';
import { formateTime } from '@/utils/utils';
export default defineComponent({
  name: 'SystemWindow',
});

// 获取系统通知详情
async function userGetSystemNoticeContent(store: Store<initStore>) {
  const data = await store.dispatch('postMsg', {
    query: {
      msgClassId: store.state.activeUid,
    },
    cmd: 2019,
    encryption: 'Aoelailiao.Message.UserGetSystemNoticeContentListReq',
    auth: true,
  });
  console.log(data.body);

  return data.body.msgContent;
}
</script>
<script setup lang="ts">
interface IsystemList {
  text: string;
  time: number;
  img: string[];
}
import SystemWindowHeader from './header.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const store = useStore(key);
const systemList: Ref<IsystemList[]> = ref([]);
const feedbackList = ref([]);
const feedback = reactive({
  feedbackContent: '',
  replyContent: '',
  feedbackTime: 0,
  replyTime: 0,
});
const list = [
  { id: 1, title: '系统消息', icon: 'img/systemNotify.svg' },
  { id: 2, title: '用户反馈消息', icon: 'img/feedback.svg' },
  // { id: 3, title: '群解散通知' },
];

const title = computed(() => {
  const item = list.find((e) => e.id === store.state.activeUid);
  return item?.title;
});

const icon = computed(() => {
  const item = list.find((e) => e.id === store.state.activeUid);
  return item?.icon;
});

const init = async () => {
  const data = await userGetSystemNoticeContent(store);

  if (store.state.activeUid === 1) {
    // 系统通知详情
    systemList.value = data.map((e: any) => {
      let text = '';
      let time = 0;
      let img = [];
      try {
        text = JSON.parse(e.systemNoticeMsg.systemNoticeContent).Jt;
        img = JSON.parse(e.systemNoticeMsg.systemUserImage);
        time = e.updateTime;
      } catch (error) {
        text = '';
        time = 0;
        img = [];
      }
      return { text, time, img };
    });
  } else {
    // 反馈
    if (data.length) {
      feedbackList.value = data.map((e: any) => e.userFeedbackMsg);
    }
  }
};
init();
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.SystemWindow {
  .msg {
    position: absolute;
    top: 65px;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow: auto;
    padding: 20px;
  }
  .mmsg {
    display: flex;
    max-width: 80%;
    .title {
      font-size: 10px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      margin-bottom: 5px;
    }
    .text {
      font-size: 16px;
      @include theme('color', main);
      padding: 0;
    }
    .img {
      img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
      }
      margin-right: 10px;
    }
  }
}
</style>
<style>
.SystemWindowContent p {
  font-size: 16px;
}
.SystemWindowContent {
  font-size: 16px;
}
</style>
