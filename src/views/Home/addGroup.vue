<template>
  <div class="addGroup">
    <NavigationBar
      title="添加群成员"
      right-text="确认"
      @rigth-click="submit"
      :rightTextDef="filterList.length <= 1"
    />
    <div class="content">
      <div class="item" v-for="(item, key) in list" :key="item.uid">
        <div v-if="item.tag && key === 0" class="tag">{{ item.tag }}</div>
        <div v-else-if="item.tag && list[key - 1].tag !== item.tag" class="tag">
          {{ item.tag }}
        </div>
        <Table :title="item.name" hideMore @click="item.active = !item.active">
          <template v-slot:left>
            <img v-if="item.icon" :src="item.icon" alt="" />
            <Iconfont v-else name="iconlianxiren" size="30" color="#A8B5BE" />
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
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { cloneDeep } from 'lodash';
import Table from '@/components/Table/index.vue';
import Iconfont from '../../iconfont/index.vue';
import { ref, Ref } from 'vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';
import { getTag } from '@/utils/utils';
import { IContacts } from '@/types/user';
import { hideLoading, showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';
import { useGoBack } from '@/hooks';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'addGroup',
});
</script>
<script setup lang="ts">
const store = useStore(key);
const list: Ref<IContacts[]> = ref([]);
const goBack = useGoBack(useRouter);

const { t } = useI18n();

const init = async () => {
  list.value = await useGetContactList(store);
};

const filterList = computed(() => list.value.filter((e) => e.active));

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
  return [...list].map((e: any) => cloneDeep(e));
}

// 确定
const submit = async () => {
  if (filterList.value.length <= 1) {
    return;
  }
  const memberUserInfos = filterList.value.map((e) => {
    return {
      memberUid: e.uid,
    };
  });
  memberUserInfos.unshift({
    memberUid: store.state.userInfo.uid,
  });
  showLoading();
  // 创建群
  const data = await store.dispatch('postMsg', {
    query: {
      operateType: 1,
      groupInfo: {
        groupMemberLists: {
          rootUid: store.state.userInfo.uid,
          memberUserInfos,
        },
      },
    },
    cmd: 1027,
    encryption: 'Aoelailiao.Login.UserOperateGroupInfoReq',
    auth: true,
  });
  hideLoading();
  Toast(t(data.body.resultString));
  if (data.body.resultCode === 0) {
    // 群聊
    store.commit('SET_ACTIVEUID', data.body.groupInfo.groupId);
    store.commit('SET_ACTIVEISGROUP', true);
    goBack();
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.addGroup {
  .content {
    padding: 8px 13px;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 50px;
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
