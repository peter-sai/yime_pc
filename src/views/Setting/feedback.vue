<template>
  <div class="feedback">
    <NavigationBar title="意见反馈" right-text="提交" @rigth-click="submit" />
    <div style="flex: 1" class="introduction">
      <textarea :placeholder="t('请输入')" v-model="query.msg"></textarea>
      <div class="box">
        <div v-if="!imgUrl" class="plus" @click="upLoad"></div>
        <div class="img" v-else @click="upLoad">
          <img :src="imgUrl" alt="" />
        </div>
      </div>
    </div>
    <input ref="changUserImg" type="file" hidden accept="image/*,video/*" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'feedback',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import { ref, onMounted, onBeforeUnmount, Ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';
import { useGoBack } from '@/hooks';
import { useRouter } from 'vue-router';
const imgUrl = ref('');
const changUserImg: Ref<any> = ref(null);
const store = useStore(key);
const { t } = useI18n();

const goBack = useGoBack(useRouter);

// 参数
const query = reactive({
  msg: '',
});

const upLoad = () => {
  changUserImg.value!.click();
};

onMounted(async () => {
  changUserImg.value!.addEventListener('change', cbImg);
});

onBeforeUnmount(() => {
  changUserImg.value.removeEventListener('change', cbImg);
});

const cbImg = async (e: any) => {
  const file = e.target.files[0];
  let info: any = await store.state.client.put(file.name, file);
  imgUrl.value = info.url;
};

// 提交
const submit = async () => {
  if (!query.msg) {
    return Toast(t('请输入内容'));
  }
  showLoading();
  const res = {
    feedbackContent: query.msg,
    feedbackImages: [imgUrl.value],
  };

  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 1187,
    encryption: 'Aoelailiao.Login.UserCommitFeedBackReq',
    auth: true,
  });
  if (data.body.resultCode === 0) {
    goBack();
  }
  return Toast(t(data.body.resultString));
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.feedback {
  textarea {
    font-size: 14px;
    padding: 10px;
    box-sizing: border-box;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #929292;
    line-height: 17px;
    width: 100%;
    height: 130px;
    border: 1px solid #eaebea;
  }
  .introduction {
    padding: 17px 13px;
    .box {
      position: relative;
      margin-top: 30px;
      .plus {
        position: relative;
        width: 44px;
        height: 44px;
        border: 1px solid #d1d1d1;
        bottom: 16px;
        left: 0;
        &::after {
          @include pseudoClass;
          width: 25px;
          height: 3px;
          background: #b0b3bf;
        }
        &::before {
          @include pseudoClass;
          height: 25px;
          width: 3px;
          background: #b0b3bf;
        }
      }
      .img {
        position: relative;
        width: 44px;
        height: 44px;
        border: 1px solid #d1d1d1;
        bottom: 16px;
        left: 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .img {
    .icon {
      position: relative;
      width: 38px;
      height: 38px;
      border: 1px solid #979797;
      border-radius: 3px;
      &::before {
        display: block;
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 70%;
        width: 1px;
        background: #979797;
      }
      &::after {
        display: block;
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        height: 1px;
        background: #979797;
      }
    }
  }
}
</style>
