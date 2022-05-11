<template>
  <div class="bottom">
    <div class="reply" v-if="replyActive?.showReplyBox">
      <div class="reply-left">
        <img src="../../assets/img/reply.svg" alt="" />
        <div class="line"></div>
        <div class="text">
          <span>回复 {{ replyActive?.replyUser }}</span>
          <span>{{ replyContent }}</span>
        </div>
      </div>
      <img src="../../assets/img/close.svg" alt="" @click="reset" />
    </div>
    <div class="content">
      <div class="itemLeft">
        <Iconfont
          name="iconsearch"
          @click.stop="showOpertion = !showOpertion"
          size="20"
          color="#2B2C33"
        />
        <div
          ref="input"
          class="input"
          :placeholder="t('输入消息')"
          contenteditable="true"
          :value="modelValue"
          @click.stop=""
          @input="onInput"
          @keydown.enter="onEnter"
          @paste="paste"
        >
          {{ modelValue }}
        </div>
      </div>
      <div class="itemRight">
        <Iconfont
          @click.stop="toggleExpres"
          name="iconbiaoqing"
          size="20"
          color="#2B2C33"
        />
        <Iconfont
          v-if="!store.state.activeIsGroup"
          @click.stop="burnInfo.show = !burnInfo.show"
          name="iconyuehoujifen"
          size="24"
          :color="burnInfo.show ? '#0085FF' : '#2B2C33'"
        />
        <Iconfont
          @click="toggleAudio"
          name="iconyuyin"
          size="20"
          color="#2B2C33"
        />
        <div
          v-if="modelValue || copyImgList.length"
          class="send"
          @click.stop="onEnter"
        >
          <img src="../../assets/img/send.svg" alt="" />
        </div>
      </div>
      <!-- 操作弹框 -->
      <div class="boxOperation" v-if="showOpertion">
        <div class="child">
          <div class="opeItem" @click.stop="onEmit('sendImg')">
            <Iconfont name="iconxiangce" size="20" color="#111111" />
            <div>{{ t('相册') }}</div>
          </div>
          <div class="opeItem" @click="start(1)">
            <Iconfont name="iconicon_yuyinshipin1" size="20" color="#111111" />
            <div>{{ t('语音') }}</div>
          </div>
          <div class="opeItem" @click="start(2)">
            <Iconfont name="iconshipintonghua" size="24" color="#111111" />
            <div>{{ t('视频') }}</div>
          </div>
        </div>
        <div class="child">
          <div class="opeItem" @click.stop="onEmit('sendFile')">
            <Iconfont name="iconwenjian1" size="20" color="#111111" />
            <div>{{ t('文件') }}</div>
          </div>
          <div
            class="opeItem"
            :style="store.state.activeIsGroup && style"
            @click="onEmit('recommend')"
          >
            <Iconfont name="icontuijianhaoyou" size="20" color="#111111" />
            <div>{{ t('推荐好友') }}</div>
          </div>
          <div class="opeItem" :style="style">
            <Iconfont name="iconweizhi" size="20" color="#111111" />
            <div>{{ t('位置') }}</div>
          </div>
        </div>
      </div>
      <!-- 设置焚阅时间 -->
      <div class="burnRead" v-if="burnInfo.show">
        <div class="title">{{ t('设置焚毁时间') }}</div>
        <div class="burnBox">
          <div
            class="burnItem"
            @click.stop="userBeforeFire(item.id)"
            v-for="item in burnInfo.list"
            :key="item.id"
            :class="{ active: item.id === burnInfo.active }"
          >
            {{ t(item.name) }}
          </div>
        </div>
      </div>
    </div>
    <!-- 复制的图片 和 拖拽的文件 -->
    <div class="copyImg" v-if="copyImgList.length">
      <div
        class="copyImgBox"
        v-for="(item, key) in copyImgList"
        :key="item.url"
      >
        <div
          class="imgBox"
          v-if="item?.file?.type?.includes('image')"
          :style="{
            backgroundImage: `url(${item.url})`,
            backgroundSize: 'cover',
          }"
        >
          <!-- <img :src="item.url" alt="" /> -->
          <i class="close" @click="delImgList(key)"> </i>
        </div>
        <div class="imgBox fileBox" v-else>
          <Iconfont name="iconwenjian2" size="20" color="#999" />
          <div class="name">{{ item?.file?.name }}</div>
          <div class="size">{{ getSize(item?.file?.size || 0) }}</div>
          <i class="close" @click="delImgList(key)"> </i>
        </div>
      </div>
    </div>
    <!-- at 消息 -->
    <div v-if="showAtBox" class="at">
      <Table
        v-for="item in newAtUserInfoList"
        :key="item.uid"
        hide-more
        :title="item.nickname"
        @click="selectAtInfo(item)"
      >
        <template v-slot:left>
          <img :src="item.icon" v-if="item.icon" alt="" />
          <Iconfont v-else color="#0A0A0A" size="25" name="iconquanburenyuan" />
        </template>
      </Table>
    </div>
    <!-- 录音 语音消息 -->
    <div v-show="showAudio" class="audioBox">
      <div class="left">
        <Iconfont
          @click="toggleAudio"
          name="iconchahao"
          size="14"
          color="main"
        />
        <div class="time">
          <div class="canvas" style="height: 20px; width: 40px" />
          <div class="line"><i :style="{ width: line + '%' }"></i></div>
          <span>{{ formateAudioTime(audioTime) }}</span>
          <span class="info" v-if="audioTime === 60">{{
            t('时间最长60s')
          }}</span>
        </div>
      </div>
      <div class="right" @click="toggleAudio('send')">
        <img
          style="
            width: 30px;
            height: 30px;
            background: #fff;
            border-radius: 50%;
          "
          class="ml15"
          :src="send"
          alt=""
        />
      </div>
    </div>
    <!-- 表情 -->
    <div v-if="showExpres">
      <div class="box">
        <div class="expres" v-if="showCacheEmoji === 2">
          <div
            class="item"
            @click.stop="select(item, modelValue)"
            v-for="item in expressionList"
            :key="item.id"
          >
            <img class="img" :src="item.path" alt="" />
          </div>
        </div>
        <div class="expres" v-else-if="showCacheEmoji === 1">
          <div
            class="item"
            @click.stop="select(item, modelValue)"
            v-for="item in emojiList"
            :key="item.id"
          >
            <img class="img" :src="item.path" alt="" />
          </div>
        </div>
        <div class="expres" v-else-if="showCacheEmoji === 3">
          <div class="add" @click.stop="uploadImgToCollection"></div>
          <div
            class="item"
            @contextmenu="contextmenu($event, item)"
            v-for="item in collectionList"
            :key="item.id"
            @click.stop="sendCollection(item)"
          >
            <img :src="item.url" alt="" class="img" />
            <div class="preview">
              <img :src="item.url" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="btn">
        <Iconfont
          v-if="showCacheEmoji === 1"
          class="iconfont"
          @click.stop="changeCacheEmoji(1)"
          name="iconemoji_icon2_copy"
          size="18"
        />
        <Iconfont
          v-else
          class="iconfont"
          @click.stop="changeCacheEmoji(1)"
          name="iconshijian"
          color="main"
          size="18"
        />
        <Iconfont
          v-if="showCacheEmoji === 2"
          class="iconfont"
          name="iconicon_xiaolian"
          size="18"
          color="#617EE0"
          @click.stop="changeCacheEmoji(2)"
        />
        <Iconfont
          v-else
          class="iconfont"
          name="iconemoji_icon3"
          size="18"
          color="main"
          @click.stop="changeCacheEmoji(2)"
        />
        <Iconfont
          v-if="showCacheEmoji === 3"
          class="iconfont"
          name="iconshoucang"
          size="18"
          color="#617EE0"
          @click.stop="changeCacheEmoji(3)"
        />
        <Iconfont
          v-else
          class="iconfont"
          name="iconshoucang"
          size="18"
          color="main"
          @click.stop="changeCacheEmoji(3)"
        />
      </div>
    </div>

    <div
      class="menu"
      v-if="showMenu"
      @contextmenu="(e) => e.preventDefault()"
      :style="styleCollection"
    >
      <span @click.stop="delCollection(rightClickItem)">{{ t('删除') }}</span>
    </div>
    <!-- 图片添加到表情 -->
    <input ref="changUserImg" type="file" hidden accept="image/*" />
  </div>
</template>
<script lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { Toast } from '@/plugin/Toast';
import { initStore, key } from '@/store';
import { getStorage, setStorage } from '@/utils/utils';
import { MediaAudio } from '@/plugin/Audio';
import Recorder from 'Recorder';
import { initRonyun } from '@/App.vue';
import { upLoadFile, initOss } from '../../hooks/window';
import { upDateStore } from '@/hooks/window';
import { getSize } from '@/utils/utils';
import {
  defineComponent,
  ref,
  reactive,
  Ref,
  defineEmits,
  defineProps,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  PropType,
  computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { Store, useStore } from 'vuex';
import { IGroupInfo, IUserInfo } from '@/types/user';
export default defineComponent({
  name: 'bottom',
});

interface IexpressionItem {
  id: number;
  name: string;
  path: string;
}

// input
function useInput(
  emit: (event: 'update:modelValue', ...args: any[]) => void,
  emojiList: Ref<IexpressionItem[]>,
  input: Ref<HTMLInputElement | null>
) {
  // 选择
  const select = (e: any, modelValue: string) => {
    input.value?.focus();
    if (!emojiList.value.find((v) => v.name === e.name)) {
      emojiList.value.push(e);
    }
    emit(
      'update:modelValue',
      modelValue + String.fromCodePoint(parseInt(e.name, 16))
    );
    if (emojiList.value.length) {
      setStorage('emojiList', JSON.stringify(emojiList.value));
    }
  };

  const del = (modelValue: string) => {
    const res = [...modelValue].slice(0, [...modelValue].length - 1);
    emit('update:modelValue', res.join(''));
  };

  return {
    select,
    del,
  };
}
</script>
<script setup lang="ts">
import Table from '@/components/Table/index.vue';
import { hideLoading, showLoading } from '@/plugin/Loading';
import send from '../../assets/img/send.svg';
const changUserImg: Ref<HTMLInputElement | null> = ref(null);
const input: Ref<HTMLInputElement | null> = ref(null);
const store = useStore(key);
const { t } = useI18n();
const audioObj = ref({});
const showAtBox = ref(false);
const showReplyBox = ref(false);
const atUserInfoList: Ref<IUserInfo[]> = ref([]);
const collectionList: Ref<{ id: number; url: string }[]> = ref([]);

const styleCollection = ref({ left: '0px', top: '0px' });
const showMenu = ref(false);
const rightClickItem: Ref<{ id: number; url: string } | any> = ref({});
const contextmenu = (e: any, item: { id: number; url: string }) => {
  styleCollection.value.left = e.pageX + 'px';
  styleCollection.value.top = e.pageY + 'px';
  e?.preventDefault();
  showMenu.value = true;
  rightClickItem.value = item;
};

const dropFile = computed(() => store.state.dropFile);
const destoryReaded = computed(
  () =>
    store.state.msgList[store.state.activeUid]?.userDetailInfo?.userInfo
      ?.userAttachInfo?.destoryReaded
);

watch(dropFile, (e) => {
  if (e) {
    input.value?.focus();
    copyImgList.value.push(e);
    store.commit('SET_DROPFILE', null);
  }
});

// 粘贴的图片列表
const copyImgList: Ref<{ url: string; file: File }[]> = ref([]);

const newAtUserInfoList = computed(() => {
  const ats = props.modelValue.split('@');

  const list = atUserInfoList.value.filter((e) =>
    e.nickname
      .toLocaleLowerCase()
      .includes(ats[ats.length - 1].toLocaleLowerCase())
  );
  if (ats.length <= 1) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    showAtBox.value = false;
  }

  return list || [];
});
const style = {
  opacity: 0,
  cursor: 'auto',
};
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  userInfo: {
    type: Object as PropType<IUserInfo>,
  },
  yUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
  atUserInfoList: {
    type: Object as PropType<IUserInfo>,
  },
  isGroupMember: {
    type: Boolean,
    default: true,
  },
});
const showExpres = ref(false);
const emit = defineEmits([
  'update:modelValue',
  'atUserInfoLists',
  'enter',
  'recommend',
  'sendImg',
  'sendFile',
  'selectGroupMember',
]);

const onEmit = (res: any) => {
  if (!props.isGroupMember) return Toast(t('非群成员无法操作'));
  emit(res);
};
// 是否显示操作弹框
const showOpertion = ref(false);

// 缓存列表
const emojiList: Ref<IexpressionItem[]> = ref([]);

if (!emojiList.value.length) {
  emojiList.value = JSON.parse(getStorage('emojiList')) || [];
}

// 是否显示缓存图标
const showCacheEmoji = ref(2);
// 切换显示缓存图标
const changeCacheEmoji = async (item: number) => {
  showCacheEmoji.value = item;
};

// 焚阅时间
const burnInfo = reactive({
  list: [
    { id: 1, name: '30秒钟' },
    { id: 2, name: '1分钟' },
    { id: 3, name: '10分钟' },
    { id: 4, name: '1小时' },
    { id: 5, name: '1天' },
    { id: 0, name: '关闭焚毁' },
  ],
  active: 0,
  show: false,
});

const keys = require
  .context('../../assets/img/expression/', true, /\.png$/)
  .keys();

const expression = keys.map((e, k) => {
  return {
    id: k,
    name: e.slice(2, -4),
    path: require(`../../assets/img/expression/${e.substr(2, e.length - 2)}`),
  };
});

// 图标列表
const expressionList = reactive(expression);

// 输入框
const { select, del } = useInput(emit, emojiList, input);

const onInput = async (e: any) => {
  emit('update:modelValue', e.target.textContent);
  if (e.data === '@') {
    showAtBox.value = true;
    if (!atUserInfoList.value.length) {
      await getGroupMemberUserInfos();
    }
  }
};

const onEnter = async (e: any) => {
  if (!e.shiftKey) {
    e.preventDefault();
    emit('enter', props.atUserInfoList || [], copyImgList.value);
    copyImgList.value = [];
  }
};

// 获取群成员详情
async function getGroupMemberUserInfos() {
  const groupMemberUids = (
    props.groupDetailInfo?.groupMemberLists?.memberUserInfos || []
  ).map((e) => e.memberUid);
  const res = await store.dispatch('postMsg', {
    query: { uid: groupMemberUids },
    cmd: 1115,
    encryption: 'Aoelailiao.Login.ClientGetUserInfoListReq',
    auth: true,
  });
  atUserInfoList.value = (res.body.userInfo || []).filter(
    (e: IUserInfo) => Number(e.uid) !== Number(store.state.userInfo.uid)
  );
  atUserInfoList.value.unshift({
    uid: 0,
    nickname: 'All',
  } as IUserInfo);
  emit('atUserInfoLists', atUserInfoList.value);
}

const toggleExpres = async () => {
  showExpres.value = !showExpres.value;
  input.value?.focus();
  if (showExpres.value) {
    getCollectionList();
  }
};

const bodyClickCb = () => {
  showExpres.value = false;
  showOpertion.value = false;
  burnInfo.show = false;
  // input.value?.focus();
};

onMounted(() => {
  document.body.addEventListener('click', bodyClickCb);
  input.value?.focus();
  burnInfo.active = destoryReaded.value ? destoryReaded : 0;

  // 上传图片 添加到表情
  changUserImg.value!.addEventListener('change', async (e: any) => {
    if (!e.target.files || !e.target.files.length) return;
    if (!store.state.client.userAgent) {
      await initOss(store);
    }
    const file = e.target.files[0];
    const info = (await store.state.client.put(file.name, file)) as {
      url: string;
    } | null;
    addToCollection(info?.url || '');
  });
});

onBeforeUnmount(() => {
  document.body.removeEventListener('click', bodyClickCb);
});

// 开始音视频
const start = async (mediaType: number) => {
  if (!props.isGroupMember) return Toast(t('非群成员无法操作'));
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
          MediaAudio({ isCall: true, mediaType, yUserInfo: props.yUserInfo });
        } else {
          // 群聊
          emit('selectGroupMember', mediaType);
        }
      } catch (error) {
        console.log(error);
        return Toast(t('服务初始化失败'));
      }
      hideLoading();
    } else {
      if (!store.state.activeIsGroup) {
        MediaAudio({ isCall: true, mediaType, yUserInfo: props.yUserInfo });
      } else {
        // 群聊
        emit('selectGroupMember', mediaType);
      }
    }
  } else {
    return Toast(t('发送者无权限'));
  }
};

// 录音 语音消息

// 控制按住说话按钮的显示和隐藏
const showAudio = ref(false);
const toggleAudio = (isSend?: string) => {
  const duration = audioTime.value;
  showAudio.value = !showAudio.value;
  if (showAudio.value) {
    startRec();
  } else if (isSend === 'send') {
    sendRec(duration);
  } else {
    closeRec();
  }
};

let line = ref(0);
let audioTime = ref(0);
// 监听是否需要audio
watch(showAudio, (e) => {
  audioTime.value = 0;
  line.value = 0;
});

// 格式化录音时间
const formateAudioTime = (e: number) => {
  if (e < 10) {
    return `00:0${e}`;
  } else if (e < 60) {
    return `00:${e}`;
  } else {
    return `01:0${e - 60}`;
  }
};

let rec: any;
let wave: any;
async function startRec() {
  await nextTick();
  wave = Recorder.FrequencyHistogramView({
    elem: '.canvas',
    position: 0,
    stripeEnable: false,
    linear: [0, '#333', 0.5, '#333', 1, '#333'],
    widthRatio: 0.3,
    lineCount: 5,
  });
  rec = Recorder({
    onProcess: function (buffers: any, level: any, time: any, sampleRate: any) {
      wave.input(buffers[buffers.length - 1], level, sampleRate);
    },
    type: 'amr',
  }); //使用默认配置，mp3格式

  //打开麦克风授权获得相关资源
  rec.open(
    function () {
      //开始录音
      rec.start();
      startAudio();
    },
    function (msg: string, isUserNotAllow: boolean) {
      //用户拒绝了权限或浏览器不支持
      alert((isUserNotAllow ? '用户拒绝了权限，' : '') + '无法录音:' + msg);
    }
  );
}

function stop() {
  return new Promise((resovle, reject) => {
    rec.stop(
      function (blob: any, duration: number) {
        const name = Date.now().toString() + '.amr';
        const audioFile = new File([blob], name, { type: blob.type });
        resovle({ name, audioFile, duration });
      },
      function (msg: string) {
        alert('录音失败:' + msg);
      }
    );
  });
}

// 发送
async function sendRec(duration: number) {
  if (!store.state.client.userAgent) {
    await initOss(store);
  }
  let obj: any = {};
  if (audioTime.value <= 59) {
    obj = await stop();
  } else {
    obj = audioObj.value;
  }

  const { audioFile, name } = obj;
  showLoading();
  try {
    // const url = await upLoadFile(audioFile, store, t);
    let info: any = await store.state.client.put(name, audioFile);
    const userInfo = JSON.parse(getStorage('userInfo'));
    const isGroupMsg = store.state.activeIsGroup ? 1 : 0;

    const res = {
      msgInfo: {
        isGroupMsg,
        fromId: userInfo.uid,
        toId: Number(store.state.activeUid),
        msgShowType: 1,
        isEncrypt: 0,
        msgContent: {
          msgContentType: 3,
          msgContent: 'voiceMsg',
          voiceMsg: {
            voiceTime: duration,
            voiceUrl: info.url,
          },
        },
        type: 'voiceMsg',
        // attachInfo: {
        //   msgSource: route.query.msgSource,
        // },
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
    if (data.body.resultCode !== 0) {
      return Toast(t(data.body.resultString));
    } else {
      reset();
    }
  } catch (error) {
    console.log(error);
  }
  hideLoading();
}

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

// 取消发送
function closeRec() {
  //停止录音，得到了录音文件blob二进制对象，想干嘛就干嘛
  rec.close();
}

// 选择at消息
const selectAtInfo = (item: IUserInfo) => {
  showAtBox.value = false;
  const msgSplitList = props.modelValue.split('@');
  msgSplitList[msgSplitList.length - 1] = item.nickname;
  emit('update:modelValue', msgSplitList.join('@') + ' ');
};

function startAudio() {
  setTimeout(async () => {
    if (audioTime.value < 59 && showAudio.value) {
      startAudio();
    }
    if (audioTime.value >= 59) {
      audioObj.value = await stop();
    }
    audioTime.value++;
    line.value = (audioTime.value / 60) * 100;
  }, 1000);
}

// 粘贴
const paste = (e: any) => {
  const cbd = e.clipboardData;
  const ua = window.navigator.userAgent;
  // 如果是 Safari 直接 return
  if (!(e.clipboardData && e.clipboardData.items)) {
    return;
  }
  if (
    cbd.items &&
    cbd.items.length === 2 &&
    cbd.items[0].kind === 'string' &&
    cbd.items[1].kind === 'file' &&
    cbd.types &&
    cbd.types.length === 2 &&
    cbd.types[0] === 'text/plain' &&
    cbd.types[1] === 'Files' &&
    ua.match(/Macintosh/i) &&
    Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49
  ) {
    return;
  }
  for (let i = 0; i < cbd.items.length; i++) {
    let item = cbd.items[i];
    if (item.kind == 'file') {
      e.preventDefault();
      if (!item.type.includes('image')) return;
      // blob 就是从剪切板获得的文件，可以进行上传或其他操作
      const blob = item.getAsFile();
      if (blob.size === 0) {
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (v: any) {
        copyImgList.value.push({
          url: v.target.result,
          file: new File([blob], Date.now().toString(), {
            type: 'image/jpg',
          }),
        });
      };
    }
  }
};

// 删除
const delImgList = (key: number) => {
  copyImgList.value.splice(key, 1);
};

const replyData = computed(() => store.state.replyData);
const replyActive = computed(() => replyData.value[store.state.activeUid]);

const replyContent = computed(() => {
  let name: string;
  const msgContentType =
    replyActive?.value?.replyMsg?.msgContent?.msgContentType;
  console.log(msgContentType);
  if (msgContentType === 1) {
    name = replyActive?.value?.replyMsg?.msgContent?.stringContent;
  } else if (msgContentType === 7) {
    name = replyActive?.value?.replyMsg?.msgContent?.groupAtInfo?.stringContent;
  } else if (msgContentType === 2) {
    name = t('[图片]');
  } else if (msgContentType === 15) {
    name = t('[名片]');
  } else if (msgContentType === 3) {
    name = t('[语音]');
  } else if (msgContentType === 23) {
    name = t('[视频]');
  } else if (msgContentType === 25) {
    name = t('[链接]]');
  } else {
    const res =
      replyActive?.value?.replyMsg?.msgContent?.fileInfo?.fileName?.split('.');
    if (res.length > 1) {
      const suffix = res[1];
      name = `[ ${suffix.toLocaleLowerCase()} ]`;
    }
  }
  return name;
});

// 设置焚毁时间
const userBeforeFire = useBeforeSwitch(store, 1001, t);

function useBeforeSwitch(
  store: Store<initStore>,
  settingItemId: number,
  t: { (key: string | number): string }
) {
  return async (id: number) => {
    burnInfo.active = id;
    const res = {
      objectType: 1,
      objectId: store.state.activeUid,
      settingItemId,
      switchState: id,
    };
    showLoading();

    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1041,
      encryption: 'Aoelailiao.Login.UserOperateSettingItemSwitchReq',
      auth: true,
    });

    hideLoading();
    return new Promise((resovle, reject) => {
      if (data.body.resultCode === 0) {
        // 更新缓存
        if (settingItemId === 1001) {
          // 更新焚毁状态
          upDateStore(
            store,
            'destoryReaded',
            Number(id),
            store.state.activeUid,
            true
          );
        }
        resovle(true);
      } else {
        reject();
      }
      Toast(t(data.body.resultString));
    });
  };
}

async function getCollectionList() {
  const data = await store.dispatch('postMsg', {
    query: {
      optype: 0,
    },
    cmd: 2037,
    encryption: 'Aoelailiao.Message.ImageOperateReq',
    auth: true,
  });
  collectionList.value = data.body.images;
}

//
const uploadImgToCollection = () => changUserImg.value?.click();

// 添加到收藏
async function addToCollection(url: string) {
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
  if (data.body.resultCode === 0) {
    getCollectionList();
  }
}

// 删除表情
const delCollection = async (
  rightClickItem: { id: number; url: string } | any
) => {
  showMenu.value = false;
  const query = {
    optype: 20,
    imageId: rightClickItem.id,
  };
  const data = await store.dispatch('postMsg', {
    query,
    cmd: 2037,
    encryption: 'Aoelailiao.Message.ImageOperateReq',
    auth: true,
  });
  Toast(t(data.body.resultString));
  if (data.body.resultCode === 0) {
    getCollectionList();
  }
};

// 发送表情
const sendCollection = async (item: { id: number; url: string }) => {
  const query = {
    msgInfo: {
      isGroupMsg: store.state.activeIsGroup ? 1 : 0,
      replyMsgId: store.state.replyMsg?.msgId ?? null,
      fromId: store.state.userInfo.uid,
      toId: store.state.activeUid,
      msgShowType: 1,
      isEncrypt: 0,
      msgContent: {
        msgContentType: 27,
        msgContent: 'emojiInfo',
        emojiInfo: {
          url: item.url,
        },
      },
    },
  };

  const data = await store.dispatch('postMsg', {
    query: query,
    cmd: 2001,
    encryption: 'Aoelailiao.Message.ClientSendMsgToServerReq',
    auth: true,
  });
  console.log(data);
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.bottom {
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  border-top: 1px solid #eaebea;
  .reply {
    width: 100%;
    height: 55px;
    padding: 12px 21px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    &-left {
      display: flex;
      align-items: center;
      width: 100%;
      .line {
        width: 1px;
        height: 30px;
        background: #0085ff;
        margin: 0 10px 0 15px;
      }
      .text {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span:nth-child(1) {
          font-size: 14px;
          font-weight: 400;
          color: #0085ff;
        }
        span:nth-child(2) {
          font-size: 14px;
          font-weight: 400;
          color: #050505;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .copyImg {
    position: absolute;
    width: 90%;
    height: 100px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
    left: 50%;
    transform: translate(-50%);
    bottom: 100%;
    background: #fff;
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    flex-wrap: wrap;
    overflow: auto;
    .copyImgBox {
      width: 100px;
      height: 100px;
      padding: 10px;
      box-sizing: border-box;
      .imgBox {
        position: relative;
        width: 100%;
        height: 100%;
        background: #eaebea;
        border-radius: 5px;
        padding: 5px;
        &.fileBox {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .size {
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        img {
          width: 100%;
          max-height: 100%;
        }
        .close {
          position: absolute;
          right: 5px;
          top: 5px;
          border-radius: 50%;
          width: 15px;
          overflow: hidden;
          height: 15px;
          background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          &::before {
            display: block;
            content: '';
            width: 80%;
            height: 2px;
            background: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          }
          &::after {
            display: block;
            content: '';
            width: 80%;
            height: 2px;
            background: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
          }
        }
      }
    }
  }
  .audioBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    height: 50px;
    .line {
      width: 100%;
      position: absolute;
      height: 5px;
      background: #ededed;
      top: -5px;
      left: 0;
      i {
        display: block;
        height: 100%;
        background: #0085ff;
      }
    }
    .left {
      display: flex;
      align-items: center;
      .time {
        margin-left: 20px;
        display: flex;
        align-items: center;
        span {
          font-size: 14px;
          color: #333;
          &.info {
            margin-left: 10px;
            color: #333;
          }
        }
      }
    }
  }
  .content {
    min-height: 50px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    box-sizing: border-box;
  }
  .box {
    width: 100%;
    border-top: 1px solid #eaebea;
    .expres {
      box-sizing: border-box;
      padding: 10px 0;
      height: 180px;
      overflow: auto;
      background: #f9f9f9;
      .item {
        display: inline-block;
        font-size: 12px;
        text-align: center;
        margin: 5px;
        position: relative;
        cursor: pointer;
        .img {
          width: 28px;
          height: 28px;
        }
        .preview {
          display: none;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          img {
            width: 200px;
            height: 200px;
          }
        }
        &:hover .preview {
          display: block;
        }
      }
      .add {
        width: 24px;
        height: 24px;
        border: 2px solid #999999;
        border-radius: 4px;
        position: relative;
        margin: 0 5px;
        display: inline-block;
        &::after {
          display: block;
          content: '';
          width: 80%;
          height: 2px;
          background: #999;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        &::before {
          display: block;
          content: '';
          height: 80%;
          width: 2px;
          background: #999;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .btn {
    height: 50px;
    border-top: 1px solid #eaebea;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .iconfont {
      margin: 0 7px;
      cursor: pointer;
    }
  }
}
.menu {
  position: fixed;
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
  padding: 5px;
  span {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    width: 55px;
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
.burnRead {
  width: 130px;
  height: 150px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  position: absolute;
  bottom: 100%;
  margin-bottom: 10px;
  right: 20px;
  box-sizing: border-box;
  .title {
    font-size: 12px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #050505;
    line-height: 18px;
    text-align: center;
    margin: 15px 0 10px;
  }
  .burnBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    .burnItem {
      width: 50px;
      height: 22px;
      border-radius: 4px;
      border: 1px solid #bdbdbd;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      cursor: pointer;
      &.active {
        color: #0085ff;
        border: 1px solid #0085ff;
      }
    }
  }
}
.at {
  width: 307px;
  max-height: 315px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  position: absolute;
  border-radius: 8px;
  bottom: 100%;
  margin-bottom: 10px;
  left: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  .table {
    padding: 5px 15px;
    cursor: pointer;
    img {
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }
    &:last-child {
      padding-bottom: 15px;
    }
    &:first-child {
      padding-top: 15px;
    }
  }
}
.boxOperation {
  position: absolute;
  width: 200px;
  height: 135px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  bottom: 100%;
  margin-bottom: 10px;
  left: 20px;
  padding: 15px 0;
  box-sizing: border-box;
  .child {
    display: flex;
    justify-content: space-between;
    .opeItem {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 15px;
      cursor: pointer;
      flex: 1;
      div {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
        margin-top: 3px;
      }
    }
  }
}
.itemLeft {
  display: flex;
  align-items: flex-end;
  flex: 1;
  position: relative;
  .iconfont {
    cursor: pointer;
    margin-right: 20px;
  }
  .input {
    flex: 1;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #000;
    line-height: 20px;
    letter-spacing: 0px;
    outline: none;
    word-break: break-all;
  }
}
.itemRight {
  display: flex;
  align-items: center;
  .iconfont {
    cursor: pointer;
    margin-left: 20px;
  }
  .send {
    font-size: 14px;
    margin-left: 20px;
    cursor: pointer;
    display: flex;
    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
