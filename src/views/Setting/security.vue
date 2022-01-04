<template>
  <div class="security">
    <NavigationBar title="安全与隐私" />
    <div style="flex: 1">
      <Table title="找到我的方式" @click="goTo('/Setting/findMe')" />
      <Table title="邀请我进群" @click="goTo('/Setting/invitation')">
        <template v-slot:right>
          <span class="type">{{ getWhoCanInviteMeGroup() }}</span>
        </template>
      </Table>
      <Table title="拒绝陌生人消息" hide-more>
        <template v-slot:right>
          <Switch
            :beforeChange="refuseStrangerMessage"
            :switch="Boolean(switchSettingInfo.refuseStrangerMessage)"
          />
        </template>
      </Table>
      <Table title="已读未读消息设置" hide-more>
        <template v-slot:right>
          <Switch
            :beforeChange="readMessageState"
            :switch="!switchSettingInfo.readMessageState"
          />
        </template>
      </Table>
      <div class="info">开启后，对方将显示你的消息读取状态</div>
      <div class="btn" @click="cancellation">注销账号</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Dialog } from '@/plugin/Dialog';
export default defineComponent({
  name: 'security',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import Switch from '@/components/Switch/index.vue';
import { useGoTo } from '@/hooks';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { key } from '@/store';
import { computed } from 'vue';
import { showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';
const store = useStore(key);
const goTo = useGoTo(useRouter);
const switchSettingInfo = computed(() => store.state.switchSettingInfo);
const { t } = useI18n();
const router = useRouter();

function useToggle(type: number) {
  return async (e: boolean) => {
    // showLoading();
    const res = {
      type,
      state: e ? 0 : 1,
    };
    if (type === 20) {
      res.state = !e ? 0 : 1;
    }
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 2043,
      encryption: 'Aoelailiao.Message.SetUpSystemSwitchReq',
      auth: true,
    });
    return new Promise((resovle, reject) => {
      if (data.body.resultCode === 0) {
        resovle(true);
      } else {
        reject();
      }
      Toast(t(data.body.resultString));
    });
  };
}

const refuseStrangerMessage = useToggle(20);
const readMessageState = useToggle(17);

// 获取谁能拉我进群
function getWhoCanInviteMeGroup() {
  switch (Number(switchSettingInfo.value.whoCanInviteMeGroup || 0)) {
    case 0:
      return t('所有人');
    case 1:
      return t('仅好友');
    case 2:
      return t('没有人');
    default:
      return t('所有人');
  }
}

// 注销弹框
const cancellation = () => {
  Dialog({
    title: '确认要注销账号吗？',
    callBack: async () => {
      showLoading();
      const res = {};
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 1183,
        encryption: 'Aoelailiao.Login.DestroyUserAccountReq',
        auth: true,
      });
      if (data.body.resultCode === 0) {
        store.dispatch('logout');
        router.replace('/login');
      }
      return Toast(data.body.resultString);
    },
  });
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.security {
  .table {
    padding: 17px 13px;
    cursor: pointer;
    border-bottom: 1px solid #eaebea;
    .type {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #929292;
    }
  }
  .info {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #929292;
    margin: 10px 13px 30px;
  }
  .btn {
    cursor: pointer;
    font-size: 14px;
    font-family: SourceHanSansCN, SourceHanSansCN-Regular;
    font-weight: 400;
    color: #fa5151;
    height: 34px;
    border: 1px solid #bdbdbd;
    border-radius: 6px;
    margin: 0 13px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
