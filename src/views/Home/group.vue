<template>
  <div class="group">
    <NavigationBar title="群组" />
    <div style="flex: 1">
      <Table
        :title="item.groupName"
        :class="{ active: activeUid === item.groupId }"
        hideMore
        v-for="item in list"
        @click="setGroupWindow(item)"
        :key="item.groupId"
      >
        <template v-slot:left>
          <div class="userImg">
            <img v-if="item.groupIcon" :src="item.groupIcon" alt="" />
            <span v-else>{{
              item ? item.groupName.substr(0, 1).toLocaleUpperCase() : ''
            }}</span>
          </div>
        </template>
        <template v-slot:right>
          <span class="span" v-if="item.root">{{ t('我的') }}</span>
          <span class="span" v-else-if="item.admin">{{ t('我管理的') }}</span>
        </template>
      </Table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'group',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { ref, Ref, computed } from 'vue';
import { IGroupListItem } from '@/types/group';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const activeUid = computed(() => store.state.activeUid);
const store = useStore(key);
const userInfo = store.state.userInfo;

const list: Ref<IGroupListItem[]> = ref([]);
const init = async () => {
  const data = await store.dispatch('postMsg', {
    query: {},
    cmd: 1009,
    encryption: 'Aoelailiao.Login.UserGetFriendsAndGroupsListReq',
    auth: true,
  });
  store.commit('SET_GROUPINFOS', data.body.groupInfos);
  data.body.groupInfos.forEach((e: IGroupListItem) => {
    if (e.groupMemberLists.rootUid === Number(userInfo.uid)) {
      e.root = true;
    }
    if (e.groupMemberLists.adminUidList.includes(Number(userInfo.uid))) {
      e.admin = true;
    }
  });
  list.value = data.body.groupInfos;
};

init();

// 点击进去聊天
const setGroupWindow = (e: IGroupListItem) => {
  store.commit('SET_ACTIVEUID', e.groupId);
  store.commit('SET_ACTIVEISGROUP', true);
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.group {
  display: flex;
  flex: 1;
  flex-direction: column;
  .table {
    padding: 17px 13px;
    position: relative;
    cursor: pointer;
    &.active {
      background: rgba(0, 132, 255, 0.1);
    }
    &::after {
      @include tableBottomLine;
    }
    .span {
      font-size: 12px;
      color: #0085ff;
    }
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
        width: 46px;
        height: 46px;
        border-radius: 50%;
      }
    }
  }
  .img {
    width: 30px;
    height: 30px;
  }
}
</style>
