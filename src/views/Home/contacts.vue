<template>
  <div style="flex: 1">
    <ContactsHeader @isSearch="changeIsSearch" />
    <div class="contacts">
      <Table
        @click="goTo('/Home/addContact')"
        :title="t('添加联系人')"
        hideMore
      >
        <template v-slot:left>
          <img :src="addContact" alt="" />
        </template>
      </Table>
      <Table :title="t('群组')" hideMore @click="goTo('/Home/group')">
        <template v-slot:left>
          <img :src="group" alt="" />
        </template>
      </Table>
      <Table :title="t('黑名单')" hideMore @click="goTo('/Home/blacklist')">
        <template v-slot:left>
          <img :src="blacklist" alt="" />
        </template>
      </Table>
    </div>
    <div class="content" v-if="!isSearch">
      <div
        class="item"
        v-for="(item, key) in list"
        :key="item.uid"
        :class="{ active: activeUid === item.uid }"
      >
        <div v-if="item.tag && key === 0" class="tag">{{ item.tag }}</div>
        <div v-else-if="item.tag && list[key - 1].tag !== item.tag" class="tag">
          {{ item.tag }}
        </div>
        <Table :title="item.name" hideMore @click="setWindow(item)">
          <template v-slot:left>
            <img v-if="item.icon" :src="item.icon" alt="" />
            <Iconfont v-else name="iconlianxiren" size="30" color="#A8B5BE" />
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Table from '@/components/Table/index.vue';
import Iconfont from '@/iconfont/index.vue';
import group from '@/assets/img/group.svg';
import addContact from '@/assets/img/addContact.svg';
import blacklist from '@/assets/img/blacklist.svg';
import { useI18n } from 'vue-i18n';
import { useGoTo } from '@/hooks/index';
import { useRouter } from 'vue-router';
import ContactsHeader from './header.vue';
import { ref, Ref, computed } from 'vue';
import { useStore } from 'vuex';
import { getTag } from '@/utils/utils';
import { key } from '@/store';
import { IContacts } from '@/types/user';
export default defineComponent({
  name: 'contacts',
});
</script>
<script setup lang="ts">
const { t } = useI18n();
const store = useStore(key);
const goTo = useGoTo(useRouter);
const list: Ref<IContacts[]> = computed(() => store.state.contact);

const activeUid = computed(() => store.state.activeUid);

const isSearch = ref(false);

const changeIsSearch = (res: boolean) => {
  isSearch.value = res;
};

// 获取列表
const init = async () => {
  try {
    const storeList = store.state.contact;
    if (!storeList.length) {
      const data = await store.dispatch('postMsg', {
        query: {},
        cmd: 1009,
        encryption: 'Aoelailiao.Login.UserGetFriendsAndGroupsListReq',
        auth: true,
      });

      store.commit('SET_GROUPINFOS', data.body.groupInfos);
      const list = data.body.friendInfos;
      list.forEach((e: any) => {
        e.name =
          (e.userAttachInfo && e.userAttachInfo.remarkName) || e.nickname;
        e.tag = getTag(e);
      });
      list.sort((a: any, b: any) => a.tag.charCodeAt(0) - b.tag.charCodeAt(0));
      store.commit('SET_CONTACT', list);
    }
  } catch (error) {
    console.log(error);
  }
};

init();

// 进入聊天
const setWindow = (e: IContacts) => {
  store.commit('SET_ACTIVEUID', e.uid);
  store.commit('SET_ACTIVEISGROUP', false);
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.header {
  display: flex;
  align-items: center;
  padding: 17px 13px;
  .iconfont {
    cursor: pointer;
  }
  .input {
    flex: 1;
  }
}
.contacts {
  .table {
    padding: 10px 13px;
    position: relative;
    cursor: pointer;
    &:not(:last-child)::after {
      @include tableBottomLine;
    }
  }
}
.content {
  padding: 8px 0;
  padding-bottom: 50px;
  .item {
    padding: 0 13px;
    &.active {
      background: rgba(0, 132, 255, 0.1);
    }
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
</style>
