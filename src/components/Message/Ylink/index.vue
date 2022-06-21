<template>
  <div class="mmsg" @contextmenu="contextmenu">
    <div @click="$emit('click')">
      <img v-if="userInfo?.icon" :src="userInfo?.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <div class="imgBgBox" @click="goLink">
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
          color="#333"
        />
        <span class="span">{{ url }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Iconfont from '@/iconfont/index.vue';
import ClipboardJS from 'clipboard';
import {
  onUnmounted,
  onMounted,
  defineComponent,
  defineProps,
  defineEmits,
} from 'vue';
import { Toast } from '@/plugin/Toast';
import { useGoTo } from '@/hooks/index';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { getTag } from '@/utils/utils';
import { key } from '@/store';
export default defineComponent({
  name: 'MLink',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  userInfo: {
    type: Object,
  },
  url: {
    type: String,
    default: '',
  },
  groupDetailInfo: {
    type: Object,
  },
});

const store = useStore(key);
const { t } = useI18n();
const goTo = useGoTo(useRouter);
const urlClass = 'copy' + new Date().getTime().toString();
// 复制
let clipboard: any = null;
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

const goLink = async (e: any) => {
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

const emit = defineEmits(['menuClick', 'click']);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.mmsg {
  display: flex;
  .copyLink {
    cursor: pointer;
  }
  .imgBgBox {
    padding: 10px 15px;
    background: #f3f3f6;
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
      color: #333333;
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
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 20px;
      }
    }
  }
  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
