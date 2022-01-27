<template>
  <div class="mmsg" @contextmenu="contextmenu">
    <div>
      <img :src="userInfo?.icon" />
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

const store = useStore();
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

const goLink = (e: any) => {
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
};

const emit = defineEmits(['menuClick']);

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
    }
    .host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
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
