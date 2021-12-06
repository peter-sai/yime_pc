<template>
  <div class="addContact">
    <NavigationBar title="添加联系人" />
    <div style="flex: 1">
      <div class="input">
        <Search
          v-model="query"
          :placeholder="t('YIME ID，昵称，手机号')"
          @enter="enter"
        />
      </div>
      <div>
        <Table
          :title="item.userInfo.nickname"
          hideMore
          v-for="item in list"
          :key="item.userInfo.uid"
        >
          <template v-slot:left>
            <img class="img" :src="item.userInfo.icon" alt="" />
          </template>
          <template v-slot:right>
            <span class="btn" @click="goWindow(item)">发起聊天</span>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
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

const { t } = useI18n();
const query = ref('');
const list: Ref<IUserDetailInfo[]> = ref([]);
const store = useStore(key);
// 点击确认按钮
const enter = async () => {
  showLoading();
  const res = {
    queryString: query.value,
  };

  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 1015,
    encryption: 'Aoelailiao.Login.UserQueryUserInfoReq',
    auth: true,
  });
  hideLoading();

  list.value = data.body.userDetailInfos;
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
