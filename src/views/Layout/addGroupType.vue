<template>
  <div class="addGroupType">
    <NavigationBar
      title="加群方式"
      disable-left
      @left-click="$emit('changeTag', Etag.GroupInfo)"
      right-text="确认"
      @rigth-click="submit"
    />
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
import { defineComponent, defineEmits, PropType } from 'vue';
import { Etag } from './index.vue';
import { reactive, defineProps } from 'vue';
import Table from '@/components/Table/index.vue';
import Iconfont from '@/iconfont/index.vue';
import { useBeforeSwitch } from '@/hooks/window';
export default defineComponent({
  name: 'addGroupType',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';
import { IGroupInfo } from '@/types/user';
const props = defineProps({
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
});
const store = useStore(key);
const { t } = useI18n();

const emit = defineEmits(['changeTag']);

const list = reactive({
  active: props.groupDetailInfo?.groupAttachInfo.groupInviteState || 0,
  list: [
    { id: 0, name: '允许任何人加群' },
    { id: 1, name: '仅限邀请入群' },
    { id: 2, name: '不允许任何人加群' },
  ],
});

// 设置进群权限
const invitationInGroup = useBeforeSwitch(store, 1014, t, false);

const submit = async () => {
  await invitationInGroup(list.active);
  emit('changeTag', Etag.GroupInfo);
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.addGroupType {
  .table {
    padding: 17px 13px;
    border-bottom: 1px solid #eaebea;
    cursor: pointer;
  }
}
</style>
