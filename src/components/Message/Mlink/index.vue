<template>
  <div class="mmsg" @contextmenu="contextmenu">
    <div style="flex: 1">
      <div class="box">
        <Sending v-if="sending" />
        <div class="imgBgBox" @click="go">
          <div class="url">
            {{ url }}
          </div>
          <div class="host">
            <Iconfont
              class="copyLink"
              :class="urlClass"
              :data-clipboard-text="url"
              name="iconfuzhi"
              size="14"
              color="#fff"
            />
            <span class="span">{{ url }}</span>
          </div>
        </div>
      </div>
      <IsRead :isRead="isRead" />
    </div>
  </div>
</template>
<script lang="ts">
import Sending from '@/components/Sending/index.vue';
import Iconfont from '@/iconfont/index.vue';
import ClipboardJS from 'clipboard';
import { Toast } from '@/plugin/Toast';
import IsRead from '@/components/IsRead/index.vue';
import { useI18n } from 'vue-i18n';
import {
  onUnmounted,
  onMounted,
  defineComponent,
  defineProps,
  defineEmits,
} from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
export default defineComponent({
  name: 'MLink',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  sending: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: '',
  },
});
const { t } = useI18n();
const store = useStore(key);
// 复制
let clipboard: any = null;
const urlClass = 'copy' + new Date().getTime().toString();
onMounted(() => {
  clipboard = new ClipboardJS(`.${urlClass}`);
  clipboard.on('success', () => {
    Toast(t('复制成功'));
  });
});
onUnmounted(() => {
  clipboard.destroy();
});

const host = props.url.split('/')[0];

const go = async (e: any) => {
  const data = await store.dispatch('postMsg', {
    query: {
      encodeString: props.url,
    },
    cmd: 1023,
    encryption: 'Aoelailiao.Login.UserDecodeConentReq',
    auth: true,
  });

  if (data.body.resultCode === 0) {
    const decodeResultInfo = data.body.decodeResultInfo;
    if (decodeResultInfo.jumpType === 3 || decodeResultInfo.jumpType === 0) {
      // 外部链接
      const classList = ['url', 'imgBgBox', 'span', 'host'];
      classList.forEach((v) => {
        if (Array.from(e.target.classList).includes(v)) {
          if (props.url.includes('http')) {
            window.open(props.url);
          } else {
            window.open(`http://${props.url}`);
          }
          return;
        }
      });
    } else if (decodeResultInfo.jumpType === 1) {
      // 用户资料
      const userId = decodeResultInfo.userId;
      // 单聊
      store.commit('SET_ACTIVEUID', userId);
      store.commit('SET_ACTIVEISGROUP', false);
    } else if (decodeResultInfo.jumpType === 2) {
      // 群资料
      const groupId = decodeResultInfo.groupId;

      store.commit('SET_ACTIVEUID', groupId);
      store.commit('SET_ACTIVEISGROUP', true);
    }
  } else {
    return Toast(data.body.resultString);
  }
};

const emit = defineEmits(['menuClick']);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.mmsg {
  text-align: right;
  .copyLink {
    cursor: pointer;
  }
  .box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .sending {
      margin-right: 10px;
    }
  }
  .userImg {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    margin-left: 10px;
  }
  .imBg {
    text-align: left;
  }
  .imgBgBox {
    padding: 10px 15px;
    background: #0085ff;
    display: flex;
    font-size: 16px;
    color: #333333;
    border-radius: 0px 14px 14px 14px;
    border-radius: 14px 0px 14px 14px;
    width: 200px;
    height: 60px;
    flex-direction: column;
    justify-content: space-between;
    .url {
      font-size: 16px;
      color: #fff;
      text-align: left;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
        white-space: nowrap;
        color: #fff;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-left: 20px;
      }
    }
  }
}
</style>
