<template>
  <div class="errorContainer">
    <img class="img" :src="`img/light/${item.img}.svg`" alt="" />
    <div class="info">{{ item.title }}</div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  props: {
    id: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const route = useRoute();
    const item = reactive({
      title: '',
      img: '',
    });
    switch (route.params.id || String(props.id)) {
      case '1':
        item.title = t('网络连接断开');
        item.img = 'netError';
        break;
      case '2':
        item.title = t('暂无消息');
        item.img = 'noMsg';
        break;
      case '3':
        item.title = t('没有搜索结果');
        item.img = 'noSearchResult';
        break;
      case '4':
        item.title = t('这里空空如也');
        item.img = 'noData';
        break;
      default:
        break;
    }
    return { item };
  },
};
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.errorContainer {
  overflow: hidden;
  @include container;
  position: absolute;
  top: 0;
  padding: 0 25px;
  text-align: center;
  .img {
    width: 200px;
    margin-top: 100px;
  }
  .info {
    text-align: center;
    font-size: 16px;
    color: #bdbdbd;
    margin-top: 30px;
  }
}
</style>
