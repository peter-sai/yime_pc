<template>
  <div class="addGroup">
    <NavigationBar title="添加成员" right-text="确认" />
    <div style="flex: 1">
      <div class="content">
        <div class="item" v-for="(item, key) in list" :key="item.uid">
          <div v-if="item.tag && key === 0" class="tag">{{ item.tag }}</div>
          <div
            v-else-if="item.tag && list[key - 1].tag !== item.tag"
            class="tag"
          >
            {{ item.tag }}
          </div>
          <Table
            :title="item.name"
            hideMore
            @click="item.active = !item.active"
          >
            <template v-slot:left>
              <img :src="item.icon" alt="" />
            </template>
            <template v-slot:right>
              <Iconfont
                name="icondanxuankuang"
                v-if="item.active"
                size="14"
                color="#0085FF"
              />
              <Iconfont name="iconradio" v-else size="14" color="#BDBDBD" />
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'addGroup',
});
</script>
<script setup lang="ts">
import Table from '@/components/Table/index.vue';
import Iconfont from '../../iconfont/index.vue';
import { ref, Ref } from 'vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';
import { getTag } from '@/utils/utils';
import { IContacts } from '@/types/user';
const store = useStore(key);
const list: Ref<IContacts[]> = ref([]);

const init = async () => {
  list.value = await useGetContactList(store);
};

init();

async function useGetContactList(store: Store<initStore>) {
  let list = store.state.contact;

  if (!list.length) {
    const res = {};
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1009,
      encryption: 'Aoelailiao.Login.UserGetFriendsAndGroupsListReq',
      auth: true,
    });
    list = data.body.friendInfos;
    list.forEach((e: any) => {
      e.name = (e.userAttachInfo && e.userAttachInfo.remarkName) || e.nickname;
      e.tag = getTag(e);
    });
    list.sort((a: any, b: any) => a.tag.charCodeAt() - b.tag.charCodeAt());
    store.commit('SET_CONTACT', list);
  }
  return list;
}
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.addGroup {
  .content {
    padding: 8px 13px;
    .item {
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      .tag {
        font-size: 14px;
        padding: 5px 0;
        color: #0085ff;
        background: #f4f4f4;
        margin: 0 -16px;
        padding-left: 17px;
      }
      .table {
        padding: 9px 0;
        cursor: pointer;
      }
    }
  }
}
</style>
