<template>
  <div class="changeLang">
    <NavigationBar title="切换语言" right-text="确认" />
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
  name: 'changeLang',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import Iconfont from '@/iconfont/index.vue';
const list = reactive({
  active: 0,
  list: [
    { id: 0, name: '跟随系统' },
    { id: 1, name: '简体中文' },
    { id: 2, name: '繁体中文' },
    { id: 3, name: 'English' },
  ],
});
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
