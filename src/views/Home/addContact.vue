<template>
  <div class="addContact">
    <NavigationBar title="添加联系人" />
    <div class="input">
      <Search
        v-model="query"
        :placeholder="t('DUOLIAO ID，昵称，手机号')"
        @enter="enter"
      />
    </div>
    <Error v-if="!list.length && isShowResult" id="3" />
    <Table
      :title="item.userInfo.nickname"
      hideMore
      v-for="item in list"
      :key="item.userInfo.uid"
    >
      <template v-slot:left>
        <Iconfont
          v-if="item.userInfo.isBotUser"
          style="display: inline-block"
          name="iconbianzu16"
          size="30"
          color="#A8B5BE"
        />
        <img
          class="img"
          v-else-if="item.userInfo.icon"
          :src="item.userInfo.icon"
          alt=""
        />
        <Iconfont
          v-else
          name="iconlianxiren"
          style="display: inline-block"
          size="30"
          color="#A8B5BE"
        />
      </template>
      <template v-slot:right>
        <span class="btn" @click="goWindow(item)">{{ t('发起聊天') }}</span>
      </template>
    </Table>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Error from '../Errors/index.vue';
export default defineComponent({
  name: 'addContact',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Search from '@/components/Search/index.vue';
import Table from '@/components/Table/index.vue';
import { hideLoading, showLoading } from '@/plugin/Loading';
import { useStore } from 'vuex';
import { key } from '@/store';
import { ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IUserDetailInfo } from '@/types/user';
import { Toast } from '@/plugin/Toast';
import Iconfont from '../../iconfont/index.vue';

const { t } = useI18n();
const query = ref('');
const list: Ref<IUserDetailInfo[]> = ref([]);
const store = useStore(key);
const isShowResult = ref(false);
// 点击确认按钮
const enter = async () => {
  showLoading();
  const res = {
    queryString: query.value,
  };
  try {
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1015,
      encryption: 'Aoelailiao.Login.UserQueryUserInfoReq',
      auth: true,
    });
    hideLoading();

    list.value = data.body.userDetailInfos || [];
    if (data.body.resultCode !== 0) {
      return Toast(data.body.resultString);
    }
  } catch (error) {
    console.log(error);
  } finally {
    isShowResult.value = true;
  }
};

const goWindow = (e: IUserDetailInfo) => {
  store.commit('SET_ACTIVEUID', e.userInfo.uid);
  store.commit('SET_ACTIVEISGROUP', false);
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.addContact {
  display: flex;
  width: 100%;
  flex-direction: column;
  .errorContainer {
    z-index: 9;
  }
  .input {
    position: relative;
    z-index: 99;
  }
  .table {
    padding: 17px 13px;
    position: relative;
    &::after {
      @include tableBottomLine;
    }
  }
  .img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .btn {
    cursor: pointer;
    font-size: 12px;
    width: 65px;
    color: #0085ff;
    height: 20px;
    border: 1px solid #0085ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
