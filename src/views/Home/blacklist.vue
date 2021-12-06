<template>
  <div class="blacklist">
    <NavigationBar title="黑名单" />
    <div style="flex: 1">
      <Table
        v-for="(item, key) in list"
        :key="item.uid"
        :title="
          (item.userAttachInfo && item.userAttachInfo.remarkName) ||
          item.nickname
        "
        hideMore
      >
        <template v-slot:left>
          <img :src="item.icon" alt="" />
        </template>
        <template v-slot:right>
          <span @click.stop="remove(item, key)">{{ t('移出') }}</span>
        </template>
      </Table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'blacklist',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import { hideLoading, showLoading } from '@/plugin/Loading';
import { useStore } from 'vuex';
import { key } from '@/store';
import { ref, Ref } from 'vue';
import { IUserInfo } from '@/types/user';
import { useI18n } from 'vue-i18n';
import { Toast } from '@/plugin/Toast';
const { t } = useI18n();
const store = useStore(key);
const list: Ref<IUserInfo[]> = ref([]);
// 初始化获取黑名单列表
const init = async () => {
  showLoading();
  try {
    const res = {
      operateType: 1,
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1039,
      encryption: 'Aoelailiao.Login.UserOperateBlackListReq',
      auth: true,
    });

    if (data.body.userBlacklistInfo.blacklistUidLists.length) {
      const res1 = {
        uid: data.body.userBlacklistInfo.blacklistUidLists,
      };
      const data1 = await store.dispatch('postMsg', {
        query: res1,
        cmd: 1115,
        encryption: 'Aoelailiao.Login.ClientGetUserInfoListReq',
        auth: true,
      });
      list.value = data1.body.userInfo;
      console.log(list.value);
    }
  } catch (error) {
    console.log(error);
  }
  hideLoading();
};

init();

// 移除
const remove = async (e: IUserInfo, k: number) => {
  showLoading();
  try {
    const res = {
      operateType: 3,
      operateUid: e.uid,
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1039,
      encryption: 'Aoelailiao.Login.UserOperateBlackListReq',
      auth: true,
    });
    if (data.body.resultCode === 0) {
      list.value.splice(k, 1);
    }
    Toast(t(data.body.resultString));
  } catch (error) {
    console.log(error);
  }
  hideLoading();
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.blacklist {
  display: flex;
  flex: 1;
  flex-direction: column;
  .table {
    padding: 17px 13px;
    position: relative;
    &:not(:last-child)::after {
      @include tableBottomLine;
    }
    img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
    }
    span {
      font-size: 12px;
      color: #ff3432;
      cursor: pointer;
    }
  }
  .img {
    width: 30px;
    height: 30px;
  }
  .btn {
    cursor: pointer;
    font-size: 12px;
    width: 42px;
    color: #2b2c33;
    height: 20px;
    border: 1px solid #2b2c33;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
