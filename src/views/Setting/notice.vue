<template>
  <div class="notice">
    <NavigationBar title="声音" />
    <div style="flex: 1">
      <Table title="声音" hide-more>
        <template v-slot:right>
          <Switch
            :beforeChange="pokeSound"
            :switch="Boolean(switchSettingInfo.pokeSound)"
          />
        </template>
      </Table>
      <Table title="系统通知" hide-more>
        <template v-slot:right>
          <Switch
            :beforeChange="newMessage"
            :switch="Boolean(switchSettingInfo.newMessage)"
          />
        </template>
      </Table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'notice',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import Switch from '@/components/Switch/index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { computed } from 'vue';
import { showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';
const store = useStore(key);
const switchSettingInfo = computed(() => store.state.switchSettingInfo);
const { t } = useI18n();

function useToggle(type: number) {
  return async (e: boolean) => {
    const res = {
      type,
      state: !e ? 0 : 1,
    };

    showLoading();
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

const pokeSound = useToggle(5);
const newMessage = useToggle(3);
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.notice {
  .table {
    padding: 17px 13px;
    border-bottom: 1px solid #eaebea;
  }
}
</style>
