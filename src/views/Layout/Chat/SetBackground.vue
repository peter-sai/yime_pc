<template>
  <div class="SetBackground">
    <NavigationBar title="设置聊天背景" hide-left disable-left>
      <template v-slot:left>
        <Iconfont
          name="iconfork"
          size="20"
          @click="$emit('changeTag', Etag.UserInfo)"
        />
      </template>
    </NavigationBar>
    <div class="main">
      <Table title="设置聊天背景" @click="sendImg">
        <template v-slot:left>
          <Iconfont name="iconhuaban" size="15" />
        </template>
      </Table>
      <div class="btn" @click="reset">{{ t('恢复默认背景') }}</div>
    </div>
    <!-- 文件 和 图片选择 -->
    <input
      ref="changUserImg"
      type="file"
      hidden
      accept=".gif,.png,.jepg,.bmp,.jpg"
      multiple
    />
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  Ref,
  ref,
  defineEmits,
  onMounted,
  nextTick,
} from 'vue';
import Table from '@/components/Table/index.vue';
import Iconfont from '@/iconfont/index.vue';
import { Etag } from '../index.vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import { useSendImg } from '@/hooks/window';
export default defineComponent({
  name: 'SetBackground',
});
</script>
<script setup lang="ts">
import { key } from '@/store';
import { initOss } from '@/hooks/window';
import { IContacts, IGroupInfo } from '@/types/user';
import { getTag } from '@/utils/utils';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { Toast } from '@/plugin/Toast';
import { showLoading } from '@/plugin/Loading';
const emit = defineEmits(['toggleBox', 'changeTag']);

const { t } = useI18n();
const store = useStore(key);
const changUserImg: Ref<HTMLInputElement | null> = ref(null);

// 获取列表
const init = async () => {
  //
};
init();

// 回复默认
const reset = () => {
  clientsendbackgroundurltoserverreq('');
};

const clientsendbackgroundurltoserverreq = async (url: string) => {
  const query = {
    toId: store.state.activeUid,
    selectedBackgroundUrl: url,
  };
  const data = await store.dispatch('postMsg', {
    query,
    cmd: 2039,
    encryption: 'Aoelailiao.Message.ClientSendBackgroundUrlToServerReq',
    auth: true,
  });
  Toast(t(data.body.resultString));
  if (data.body.resultCode === 0) {
    emit('changeTag', Etag.UserInfo);
    const data = await store.dispatch('postMsg', {
      query: {
        toId: store.state.activeUid,
      },
      cmd: 2041,
      encryption: 'Aoelailiao.Message.ClientGetCurrentBackgroundUrlReq',
      auth: true,
    });
    store.commit('SET_CHATBG', data.body.backgroundUrl || '');
  }
};

onMounted(async () => {
  changUserImg.value!.addEventListener('change', async (e: any) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    changUserImg.value?.setAttribute('type', 'text');
    const typeList = ['gif', 'png', 'jpeg', 'jpg', 'bmp'];

    if (!typeList.find((e) => file.type.includes(e))) {
      return Toast(t('请上传jpeg，jpg，png，bmp，gif格式的图片'));
    }

    if (file.size > 5 * 1024 * 1024) return Toast('请上传小于5MB的图片');
    if (!store.state.client.userAgent) {
      await initOss(store);
    }
    try {
      showLoading();
      const info = (await store.state.client.put(file.name, file)) as {
        url: string;
      } | null;
      clientsendbackgroundurltoserverreq(info?.url);
    } catch (error) {
      console.log(error);
      Toast(t('上传失败'));
    }
  });
});

// 发送图片
const sendImg = () => {
  changUserImg.value?.click();
  changUserImg.value?.setAttribute('type', 'file');
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.SetBackground {
  height: 100%;
  display: flex;
  flex-direction: column;
  .userImg {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f0f0;
    display: inline-flex;
    align-items: center;
    color: #0085ff;
    font-size: 30px;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .main {
    height: 100%;
    position: relative;
    overflow: auto;
    .table {
      padding: 20px;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      cursor: pointer;
    }
    .btn {
      width: 90%;
      height: 44px;
      border-radius: 6px;
      border: 1px solid #bdbdbd;
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #929292;
      line-height: 18px;
      margin: 20px auto 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
