<template>
  <div class="commonGroup">
    <NavigationBar
      title="共同群聊"
      disable-left
      @left-click="$emit('changeTag', Etag.UserInfo)"
    />
    <div style="flex: 1">
      <Table
        :title="item.groupName"
        hide-more
        v-for="item in commonGroup"
        :key="item.groupId"
        @click="setGroupWindow(item)"
      >
        <template v-slot:left>
          <div class="userImg">
            <img v-if="item.groupIcon" :src="item.groupIcon" alt="" />
            <span v-else>{{
              item ? item.groupName.substr(0, 1).toLocaleUpperCase() : ''
            }}</span>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineEmits } from 'vue';
export default defineComponent({
  name: 'commonGroup',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import { Etag } from './index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { ref, Ref } from 'vue';
import { IGroupInfo } from '@/types/user';
const emit = defineEmits(['changeTag', 'toggleBox']);
const store = useStore(key);
const commonGroup: Ref<IGroupInfo[]> = ref([]) as Ref<IGroupInfo[]>;

// 进入聊天
const setGroupWindow = (e: IGroupInfo) => {
  store.commit('SET_ACTIVEUID', e.groupId);
  store.commit('SET_ACTIVEISGROUP', true);
  emit('toggleBox');
};

async function init() {
  // 获取共同群聊
  const data = await store.dispatch('postMsg', {
    query: { uid: store.state.activeUid },
    cmd: 1179,
    encryption: 'Aoelailiao.Login.GetCommonGroupReq',
    auth: true,
  });
  console.log(data);

  if (data.body.resultCode === 0) {
    commonGroup.value = data.body.commonGroupInfos;
  }
}
init();
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.commonGroup {
  .table {
    border-bottom: 1px solid #eaebea;
    padding: 17px 20px;
    .userImg {
      span {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        color: #0085ff;
        font-size: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
      }
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
  }
}
</style>
