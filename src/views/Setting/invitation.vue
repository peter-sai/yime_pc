<template>
  <div class="invitation">
    <NavigationBar title="邀请我进群" right-text="确认" @rigth-click="submit" />
    <div style="flex: 1">
      <Table
        v-for="item in list.list"
        :key="item.id"
        :title="item.name"
        @click="list.active = item.id"
        hide-more
      >
        <template v-slot:right v-if="item.id === list.active">
          <Iconfont name="icondagou" size="11" color="#0085FF" />
        </template>
      </Table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  name: 'invitation',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import Iconfont from '@/iconfont/index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { computed } from 'vue';
import { Toast } from '@/plugin/Toast';
import { useGoBack } from '@/hooks';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const goBack = useGoBack(useRouter);
const store = useStore(key);
const switchSettingInfo = computed(() => store.state.switchSettingInfo);

const list = reactive({
  active: switchSettingInfo.value.whoCanInviteMeGroup || 0,
  list: [
    { id: 0, name: '所有人' },
    { id: 1, name: '仅好友' },
    { id: 2, name: '没有人' },
  ],
});

// 切换
const submit = async () => {
  const item = list.list.find((e) => e.id === list.active)!;
  const res = {
    type: 19,
    state: item.id,
  };
  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 2043,
    encryption: 'Aoelailiao.Message.SetUpSystemSwitchReq',
    auth: true,
  });

  if (data.body.resultCode === 0) {
    Toast(t(data.body.resultString));
    goBack();
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.invitation {
  .table {
    padding: 17px 13px;
    border-bottom: 1px solid #eaebea;
    cursor: pointer;
  }
}
</style>
