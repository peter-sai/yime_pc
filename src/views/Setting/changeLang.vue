<template>
  <div class="changeLang">
    <NavigationBar
      title="切换语言"
      :right-text="t('确认')"
      @rigthClick="rigthClick"
    />
    <div style="flex: 1">
      <Table
        v-for="item in language.list"
        :key="item.id"
        :title="item.name"
        @click="changeLang(item)"
        hide-more
      >
        <template v-slot:right v-if="item.id === language.active">
          <Iconfont name="icondagou" size="11" color="#0085FF" />
        </template>
      </Table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import Iconfont from '@/iconfont/index.vue';
import { getLang } from '@/utils/utils';
import { Store } from 'vuex';
import store, { initStore } from '@/store';
import i18n from '@/lang';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';
import { useGoBack } from '@/hooks';
import { useRouter } from 'vue-router';
import { hideLoading, showLoading } from '@/plugin/Loading';
export default defineComponent({
  name: 'changeLang',
});

// 切换语言
function useChangeLang(store: Store<initStore>) {
  const language = reactive({
    active: store.state.lang,
    list: [
      { id: -1, name: '跟随系统' },
      { id: 0, name: '简体中文', locale: 'zh' },
      { id: 1, name: '繁體中文', locale: 'zhHant' },
      { id: 2, name: 'English', locale: 'en' },
    ],
  });
  const changeLang = (item: ILang) => {
    language.active = item.id;
  };

  return { language, changeLang };
}

interface ILang {
  id: number;
  name: string;
  locale?: string;
}
</script>
<script setup lang="ts">
const { language, changeLang } = useChangeLang(store);
const { t } = useI18n();
const goBack = useGoBack(useRouter);
const rigthClick = async () => {
  const activeId = language.active !== -1 ? language.active : getLang();
  const item = language.list.find((e) => e.id === activeId);
  try {
    showLoading();
    const data = await store.dispatch('postMsg', {
      query: {
        clientLanguageType: activeId,
      },
      cmd: 1191,
      encryption: 'Aoelailiao.Login.UserUpdateClientLanguageReq',
      auth: true,
    });
    Toast(t(data.body.resultString));
    if (data.body.resultCode === 0) {
      i18n.global.locale = item.locale!;
      store.commit('SET_LANG', language.active);
      goBack();
    }
  } catch (error) {
    console.log(error);
  }
  hideLoading();
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.changeLang {
  .table {
    padding: 17px 13px;
    border-bottom: 1px solid #eaebea;
    cursor: pointer;
  }
}
</style>
