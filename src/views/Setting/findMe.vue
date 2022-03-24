<template>
  <div class="findMe">
    <NavigationBar title="找到我的方式" />
    <div style="flex: 1">
      <div class="info">{{ t('可通过以下方式找到我') }}</div>
      <div>
        <Table title="手机号" hide-more>
          <template v-slot:right>
            <Switch
              :beforeChange="findMePhone"
              :switch="!switchSettingInfo.findMePhone"
            />
          </template>
        </Table>
        <Table title="IM号" hide-more>
          <template v-slot:right>
            <Switch
              :beforeChange="findMeImAccount"
              :switch="!switchSettingInfo.findMeImAccount"
            />
          </template>
        </Table>
        <Table title="昵称" hide-more>
          <template v-slot:right>
            <Switch
              :beforeChange="findMeNickname"
              :switch="!switchSettingInfo.findMeNickname"
            />
          </template>
        </Table>
        <Table title="分享链接" hide-more>
          <template v-slot:right>
            <Switch
              :beforeChange="findMeShareLink"
              :switch="!switchSettingInfo.findMeShareLink"
            />
          </template>
        </Table>
        <div class="msg">
          {{ t('关闭后，其他用户将不能通过上述信息找到你') }}
        </div>
      </div>
      <div class="info">{{ t('可通过以下方式私聊我') }}</div>
      <div>
        <Table title="群聊" hide-more>
          <template v-slot:right>
            <Switch
              :beforeChange="findMeGroup"
              :switch="!switchSettingInfo.findMeGroup"
            />
          </template>
        </Table>
        <Table title="推荐" hide-more>
          <template v-slot:right>
            <Switch
              :beforeChange="findMeRecommend"
              :switch="!switchSettingInfo.findMeRecommend"
            />
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
  name: 'findMe',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import Switch from '@/components/Switch/index.vue';
import { showLoading } from '@/plugin/Loading';
import { useStore } from 'vuex';
import { key } from '@/store';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';

const store = useStore(key);
const { t } = useI18n();

const switchSettingInfo = computed(() => store.state.switchSettingInfo);

function useToggle(type: number) {
  return async (val: boolean) => {
    showLoading();
    const res = {
      type,
      state: val ? 0 : 1,
    };

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

const findMePhone = useToggle(11);
const findMeImAccount = useToggle(12);
const findMeNickname = useToggle(13);
const findMeShareLink = useToggle(18);
const findMeGroup = useToggle(14);
const findMeRecommend = useToggle(15);
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.findMe {
  .info {
    height: 30px;
    background: #f0f1f4;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #2b2c33;
    line-height: 30px;
    padding-left: 13px;
  }
  .msg {
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #929292;
    display: flex;
    justify-content: center;
    padding: 17px 13px;
    align-items: center;
  }
  .table {
    padding: 17px 13px;
    border-bottom: 1px solid #eaebea;
  }
}
</style>
