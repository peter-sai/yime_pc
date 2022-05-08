<template>
  <div class="selectGroupMemberVideos">
    <NavigationBar title="选择群成员" hide-left disable-left>
      <template v-slot:left>
        <Iconfont
          class="pointer"
          @click="$emit('toggleBox')"
          name="iconfork"
          size="20"
        />
      </template>
    </NavigationBar>
    <div style="margin: 15px 10px">
      <Search :placeholder="t('搜索')" v-model="search" :width="60" />
    </div>

    <div class="main">
      <div class="content">
        <Errors :id="search ? '3' : '4'" v-if="!newList.length" />
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
      <div
        class="btn"
        :class="{
          active: newList.filter((e) => e.active).length,
        }"
        @click="submit"
      >
        {{ t('确定') }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  defineProps,
  PropType,
  defineEmits,
  Ref,
  computed,
} from 'vue';
import Iconfont from '../../../iconfont/index.vue';
import Search from '@/components/Search/index.vue';
import { Etag } from '../index.vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import { IContacts, IGroupInfo } from '@/types/user';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';
import { getTag } from '@/utils/utils';
import { GroupMediaAudio } from '../../../plugin/GroupAudio';
import Errors from '../../Errors/index.vue';
import Table from '@/components/Table/index.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'selectGroupMemberVideos',
});

// 获取群成员详情
async function getGroupMemberUserInfos(
  store: Store<initStore>,
  groupMemberUserInfos: Ref<IContacts[]>,
  props: Readonly<{
    groupDetailInfo?: IGroupInfo | undefined;
  }>
) {
  const groupMemberUids =
    props.groupDetailInfo?.groupMemberLists.memberUserInfos.map(
      (e) => e.memberUid
    );
  const res = await store.dispatch('postMsg', {
    query: { uid: groupMemberUids },
    cmd: 1115,
    encryption: 'Aoelailiao.Login.ClientGetUserInfoListReq',
    auth: true,
  });

  groupMemberUserInfos.value = (res.body.userInfo || [])
    .filter((e: any) => e.uid !== store.state.userInfo.uid)
    .map((e: any) => {
      e.isRoot = false;
      e.isAdmin = false;
      if (
        Number(e.uid) ===
        Number(props.groupDetailInfo?.groupMemberLists.rootUid)
      ) {
        e.isRoot = true;
      }
      if (
        props.groupDetailInfo?.groupMemberLists?.adminUidList?.includes(e.uid)
      ) {
        e.isAdmin = true;
      }
      return e;
    });
  groupMemberUserInfos.value.forEach((e: IContacts) => {
    e.name = (e.userAttachInfo && e.userAttachInfo.remarkName) || e.nickname;
    e.active = false;
    e.tag = getTag(e);
  });
  groupMemberUserInfos.value.sort(
    (a: IContacts, b: IContacts) => a.tag.charCodeAt(0) - b.tag.charCodeAt(0)
  );
}
</script>
<script setup lang="ts">
const emit = defineEmits(['toggleBox']);
const props = defineProps({
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
  mediaType: {
    type: Number,
  },
});
const { t } = useI18n();
const store = useStore(key);
const search = ref('');
const groupMemberUserInfos: Ref<IContacts[]> = ref([]);

const init = async () => {
  await getGroupMemberUserInfos(store, groupMemberUserInfos, props);
};
init();

const newList = computed(() =>
  groupMemberUserInfos.value.filter((e) =>
    e.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
  )
);

// 提交
const submit = () => {
  const activeList = newList.value.filter((e) => e.active);
  if (!activeList.length) return;
  const userIds = activeList.map((e) => e.uid.toString());

  // 群聊
  GroupMediaAudio({
    isCall: true,
    mediaType: props.mediaType,
    groupDetailInfo: props.groupDetailInfo,
    userIds,
  });
  emit('toggleBox');
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.selectGroupMemberVideos {
  .main {
    height: 100%;
    position: absolute;
    overflow: auto;
    bottom: 0;
    left: 0;
    right: 0;
    top: 110px;
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
