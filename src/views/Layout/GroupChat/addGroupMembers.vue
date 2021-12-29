<template>
  <div class="addGroupMembers">
    <NavigationBar
      title="添加群成员"
      disable-left
      @left-click="$emit('changeTag', Etag.GroupInfo)"
    />
    <div style="margin: 15px 10px">
      <Search placeholder="搜索好友" v-model="search" :width="60" />
    </div>
    <div class="main">
      <div class="content">
        <div class="item" v-for="(item, key) in newList" :key="item.uid">
          <div v-if="item.tag && key === 0" class="tag">{{ item.tag }}</div>
          <div
            v-else-if="item.tag && newList[key - 1].tag !== item.tag"
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
      <div
        class="btn"
        :class="{
          active: newList.filter((e) => e.active).length,
        }"
        @click="submit"
      >
        确定
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  Ref,
  ref,
  defineProps,
  PropType,
} from 'vue';
import Search from '@/components/Search/index.vue';
import Iconfont from '@/iconfont/index.vue';
import Table from '@/components/Table/index.vue';
import { Etag } from '../index.vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import { IContacts, IGroupInfo } from '@/types/user';
import { useUserOperateGroupInfo } from '@/hooks/window';
import { useStore } from 'vuex';
import { key } from '@/store';
import { getTag } from '@/utils/utils';
import { showLoading } from '@/plugin/Loading';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'addGroupMembers',
});
</script>
<script setup lang="ts">
const search = ref('');
const list: Ref<IContacts[]> = ref([]);
const store = useStore(key);
const { t } = useI18n();
const props = defineProps({
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
});

const newList = computed(() =>
  list.value.filter((e) => e.name.includes(search.value)),
);
// 获取列表
const init = async () => {
  try {
    const res = {};
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1009,
      encryption: 'Aoelailiao.Login.UserGetFriendsAndGroupsListReq',
      auth: true,
    });

    const memberUserInfos =
      props.groupDetailInfo?.groupMemberLists.memberUserInfos.map(
        (e) => e.memberUid,
      ) || [];

    list.value = data.body.friendInfos.filter(
      (e: IContacts) => !memberUserInfos.includes(e.uid),
    );
    list.value.forEach((e: IContacts) => {
      e.name = (e.userAttachInfo && e.userAttachInfo.remarkName) || e.nickname;
      e.active = false;
      e.tag = getTag(e);
    });
    list.value.sort((a, b) => a.tag.charCodeAt(0) - b.tag.charCodeAt(0));
  } catch (error) {
    console.log(error);
  }
};
init();

const userOperateGroupInfo = useUserOperateGroupInfo(store);

const submit = async () => {
  const selectList = list.value
    .filter((e) => e.active)
    .map((e) => {
      return {
        memberUid: e.uid,
      };
    });
  const query = {
    groupId: store.state.activeUid,
    groupMemberLists: {
      memberUserInfos: selectList,
    },
  };
  showLoading();

  const data = await userOperateGroupInfo(4, query);
  Toast(t(data.body.resultString));
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.addGroupMembers {
  height: 100%;
  display: flex;
  flex-direction: column;
  .main {
    height: 100%;
    position: relative;
    overflow: auto;
    .content {
      box-sizing: border-box;
      padding: 8px 13px;
      padding-bottom: 70px;
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
          margin: 0 -13px;
          padding-left: 17px;
        }
        .table {
          cursor: pointer;
          padding: 9px 0;
        }
      }
    }
    .btn {
      font-size: 14px;
      position: fixed;
      bottom: 0;
      right: 0;
      font-family: SourceHanSansCN, SourceHanSansCN-Medium;
      font-weight: 500;
      color: #ffffff;
      width: 320px;
      height: 50px;
      background: #aaa;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        background: #0085ff;
        cursor: pointer;
      }
    }
  }
}
</style>
