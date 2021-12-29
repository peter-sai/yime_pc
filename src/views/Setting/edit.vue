<template>
  <div class="settingEdit">
    <NavigationBar title="编辑资料" />
    <div style="flex: 1">
      <div class="userImg" @click="changeImg">
        <img :src="query.icon || userInfo.icon" alt="" />
        <div class="bg" />
        <Iconfont name="iconxiangji" size="20" color="#fff" />
      </div>
      <div class="group">
        <div class="title">IM号</div>
        <div class="input">
          <input type="text" v-model="query.id" placeholder="请输入您的IM号" />
        </div>
      </div>
      <div class="group">
        <div class="title">昵称</div>
        <div class="input">
          <input
            type="text"
            v-model="query.nickName"
            placeholder="请输入您的昵称"
          />
        </div>
      </div>
      <div class="group">
        <div class="title">简介</div>
        <div class="input noborder">
          <textarea
            placeholder="请输入您的简介"
            v-model="query.introduction"
          ></textarea>
        </div>
      </div>
      <div class="btn" @click="submit">保存</div>
    </div>
    <input ref="changUserImg" type="file" hidden accept="image/*" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'settingEdit',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Iconfont from '../../iconfont/index.vue';
import { reactive, computed, ref, Ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { upDateUser } from '@/api/user';
import { useGoBack } from '@/hooks';
import { useRouter } from 'vue-router';

const store = useStore(key);
let userInfo = computed(() => store.state.userInfo);
const userDetailInfo = store.state.userDetailInfo;
const changUserImg: Ref<any> = ref(null);
const goBack = useGoBack(useRouter);

const query = reactive({
  id: userInfo.value.uid,
  nickName: userInfo.value.nickname,
  introduction: userDetailInfo.userSign,
  icon: userInfo.value.icon,
});

onMounted(() => {
  changUserImg.value.addEventListener('change', cb);
});

// 卸载
onBeforeUnmount(() => {
  changUserImg.value.removeEventListener('change', cb);
});

// 选择图片之后的回调函数
const cb = async (e: any) => {
  const file = e.target.files[0];
  try {
    let info: any = await store.state.client.put(file.name, file);
    query.icon = info.url;
  } catch (error) {
    console.log(error);
  }
};

// 切换头像
const changeImg = () => {
  changUserImg.value.click();
};

const submit = async () => {
  interface IItemInfo {
    itemNo: number;
    itemValue: string;
  }
  showLoading();
  const res: {
    itemInfos: IItemInfo[];
  } = {
    itemInfos: [],
  };
  if (query.icon) {
    res.itemInfos.push({
      itemNo: 1,
      itemValue: query.icon,
    });
  }
  if (query.id && query.id !== userInfo.value.uid) {
    res.itemInfos.push({
      itemNo: 7,
      itemValue: query.id.toString(),
    });
  }
  if (query.nickName) {
    res.itemInfos.push({
      itemNo: 2,
      itemValue: query.nickName,
    });
  }
  if (query.introduction) {
    res.itemInfos.push({
      itemNo: 6,
      itemValue: query.introduction,
    });
  }
  if (!res.itemInfos.length) {
    return Toast('请输入内容');
  }

  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 1013,
    encryption: 'Aoelailiao.Login.UserSetItemReq',
    auth: true,
  });
  if (data.body.resultCode === 0) {
    await upDateUser(store);
    goBack();
  }
  return Toast(data.body.resultString, 2000);
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.settingEdit {
  .userImg {
    width: 60px;
    height: 60px;
    margin: 20px auto;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .iconfont {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0.5;
      background: #000000;
    }
  }
  .group {
    padding: 17px 13px;
    .title {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #2b2c33;
      line-height: 17px;
      margin-bottom: 10px;
    }
    .input {
      border-bottom: 1px solid #eaebea;
      padding: 5px 0;
      &.noborder {
        border: none;
      }
      input {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #929292;
        line-height: 17px;
      }
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
    }
  }
  .btn {
    height: 34px;
    background: #0085ff;
    border-radius: 6px;
    font-size: 14px;
    font-family: SourceHanSansCN, SourceHanSansCN-Regular;
    font-weight: 400;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 25px 13px 0;
  }
}
</style>
