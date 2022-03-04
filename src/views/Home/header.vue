<template>
  <div class="header">
    <Iconfont
      name="iconcaidan"
      size="20"
      color="#929292"
      @click="goTo('/setting')"
    />
    <div class="input">
      <Search v-model="val" :placeholder="t('用户、群组与消息')" />
    </div>
    <div class="iconsearch">
      <Iconfont name="iconsearch" size="20" color="#929292" />
      <div class="box">
        <div class="item" @click="goTo('/Home/addContact')">
          <Iconfont name="iconyaoqinghaoyoubeifen" size="15" />
          <span>{{ t('添加好友') }}</span>
        </div>
        <div class="item" @click="goTo('/Home/addGroup')">
          <Iconfont name="iconyaoqinghaoyou" size="12" />
          <span>{{ t('新建群聊') }}</span>
        </div>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="searchBg" v-if="showSearch">
      <div class="tabBox">
        <div
          class="tabItem"
          @click="active = 0"
          :class="{ active: active === 0 }"
        >
          <span>{{ t('联系人') }}</span>
        </div>
        <div
          class="tabItem"
          @click="active = 1"
          :class="{ active: active === 1 }"
        >
          <span>{{ t('群组') }}</span>
        </div>
      </div>
      <div class="list">
        <div v-if="active === 0">
          <Errors v-if="!contactsList.length" id="2" />
          <TableDouble
            v-for="item in contactsList"
            :key="item.id"
            @click="goToWindow(item)"
          >
            <template v-slot:title>
              <div class="title">
                <span>{{
                  item.userDetailInfo?.userInfo?.nickname || item.nickname
                }}</span>
              </div>
            </template>
            <template v-slot:subTitle>
              <span class="subTitle">{{ getType(item) }}</span>
            </template>
            <template v-slot:userImg>
              <div class="userImg">
                <img :src="item?.userDetailInfo?.userInfo?.icon || item.icon" />
              </div>
            </template>
          </TableDouble>
        </div>
        <div v-else>
          <Errors v-if="!groupList.length" id="2" />
          <TableDouble
            v-for="item in groupList"
            :key="item?.id"
            @click="goToWindow(item)"
          >
            <template v-slot:title>
              <div class="title">
                <span>
                  {{ item?.groupDetailInfo?.groupName || item?.groupName }}
                </span>
              </div>
            </template>
            <template v-slot:subTitle>
              <span class="subTitle">{{ getType(item) }}</span>
            </template>
            <template v-slot:userImg>
              <div class="userImg">
                {{
                  item?.groupDetailInfo?.groupName
                    ? item?.groupDetailInfo?.groupName
                        .substr(0, 1)
                        .toLocaleUpperCase()
                    : item?.groupName.substr(0, 1).toLocaleUpperCase()
                }}
              </div>
            </template>
          </TableDouble>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  Ref,
  watch,
} from 'vue';
import TableDouble from '@/components/TableDouble/index.vue';
import Errors from '../Errors/index.vue';

export default defineComponent({
  name: 'header',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import Search from '@/components/Search/index.vue';
import { useGoTo } from '@/hooks/router';
import { useRouter } from 'vue-router';
import { ref, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { key } from '@/store';
import { IMsgInfo, ImsgItem, TMsgContent } from '@/types/msg';
import { switchMsg } from '@/hooks/window';
import { IGroupInfo, IUserInfo } from '@/types/user';
import { IGroupListItem } from '@/types/group';
import { getTag } from '@/utils/utils';
const emit = defineEmits(['isSearch']);
const goTo = useGoTo(useRouter);
const showBox = ref(false);
const { t } = useI18n();
const val = ref('');
const active = ref(0);
const store = useStore(key);
const list = computed(() => store.state.msgList);
// 群组
const groupInfos = computed(() => store.state.groupInfos);
// 个人
const contact = computed(() => store.state.contact);
const userInfo = store.state.userInfo;
const contactsList: Ref<ImsgItem[]> = ref([]);
const groupList: Ref<ImsgItem[]> = ref([]);
const showSearch = ref(false);
onMounted(() => {
  emit('isSearch', false);
});

const getType = (item: ImsgItem) => {
  const lastMsg = item.msg;
  if (lastMsg) {
    if (lastMsg.isGroupMsg) {
      return switchMsg(lastMsg, t, store, {} as IUserInfo, [], item);
    } else {
      return switchMsg(lastMsg, t, store, item?.userDetailInfo?.userInfo || {});
    }
  }
};

const toggleShowSearch = (res: boolean) => {
  showSearch.value = res;
  emit('isSearch', res);
};

const goToWindow = (item: ImsgItem) => {
  console.log(item);

  if (item.isGroup || item.groupState) {
    // 群聊
    store.commit('SET_ACTIVEUID', item.groupId || item.id);
    store.commit('SET_ACTIVEISGROUP', true);
  } else {
    // 单聊
    store.commit('SET_ACTIVEUID', item.uid || item.id);
    store.commit('SET_ACTIVEISGROUP', false);
  }
  // item.unReadNum = 0;
  // store.commit('SET_MSGLISTITEM', { res: item });
};

watch(val, (res) => {
  contactsList.value = [];
  groupList.value = [];
  toggleShowSearch(false);
  if (!res) return;
  toggleShowSearch(true);
  for (const [key, val] of Object.entries(list.value)) {
    // 存放搜索到的内容
    const filterContactsList: IMsgInfo<string>[] = [];
    const fliterGroupList: IMsgInfo<string>[] = [];
    (val.readList || []).forEach((e: IMsgInfo<string>) => {
      // 过滤消息类型
      if (
        e.type === 'stringContent' &&
        e.msgShowType === 1 &&
        e.msgContent.stringContent.toLocaleLowerCase().includes(res)
      ) {
        if (val.isGroup) {
          fliterGroupList.push(e);
        } else {
          filterContactsList.push(e);
        }
      }
    });
    if (filterContactsList.length) {
      val.msg = filterContactsList.sort((a, b) => b.msgId - a.msgId)[
        filterContactsList.length - 1
      ];
      contactsList.value.push(val);
    }
    if (fliterGroupList.length) {
      val.msg = fliterGroupList.sort((a, b) => b.msgId - a.msgId)[
        fliterGroupList.length - 1
      ];
      groupList.value.push(val);
    }
  }
  // 整合群组和个人
  groupInfos.value.forEach((e: IGroupInfo) => {
    if (
      e.groupName.toLocaleLowerCase().includes(res.toLocaleLowerCase()) &&
      groupList.value.every((v) => v.id !== e.groupId)
    ) {
      groupList.value.push(e);
    }
  });
  contact.value.forEach((e: IUserInfo) => {
    if (
      e.nickname.toLocaleLowerCase().includes(res.toLocaleLowerCase()) &&
      contactsList.value.every((v) => v.id !== e.uid)
    ) {
      contactsList.value.push(e);
    }
  });
});

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

      data.body.groupInfos.forEach((e: IGroupListItem) => {
        if (e.groupMemberLists.rootUid === Number(userInfo.uid)) {
          e.root = true;
        }
        if (e.groupMemberLists.adminUidList.includes(Number(userInfo.uid))) {
          e.admin = true;
        }
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
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.iconsearch:hover .box {
  display: block;
}
.header {
  display: flex;
  align-items: center;
  padding: 17px 13px;
  position: relative;
  .box {
    display: none;
    position: absolute;
    background: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0px 0px 26px 0px rgba(0, 0, 0, 0.2);
    z-index: 99;
    padding: 13px 5px;
    box-sizing: border-box;
    top: 40px;
    right: 13px;
    .item {
      display: flex;
      cursor: pointer;
      align-items: center;
      padding: 6px 8px;
      &:hover {
        background: #eee;
      }
      span {
        color: #000000;
        font-size: 14px;
        margin-left: 8px;
      }
    }
  }
  .iconfont {
    cursor: pointer;
  }
  .input {
    flex: 1;
  }
}
.searchBg {
  position: fixed;
  background: #fff;
  left: 0;
  width: 300px;
  top: 50px;
  bottom: 50px;
  padding-bottom: 50px;
  z-index: 99;
  .list {
    height: 100%;
    overflow-x: hidden;
  }
  .tabBox {
    display: flex;
    padding: 8px 0;
    position: relative;
    z-index: 99;
    .tabItem {
      flex: 1;
      text-align: center;
      &:first-child {
        border-right: 1px solid #929292;
      }
      &.active {
        span {
          border-bottom: 1px solid #0a0a0a;
          padding-bottom: 5px;
          color: #0a0a0a;
        }
      }
      span {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #929292;
        line-height: 18px;
        cursor: pointer;
      }
    }
  }
}
.tableDouble {
  padding: 17px 13px;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  width: 300px;
  .title {
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      line-height: 16px;
      color: #333;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .iconfont {
      margin-left: 10px;
    }
  }
  .subTitle {
    font-size: 14px;
    color: #999;
    line-height: 18px;
    width: 150px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &.at {
      color: #e6a66a;
    }
  }
  &::after {
    @include tableBottomLine;
  }
  .userImg {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f0f0;
    display: inline-flex;
    align-items: center;
    color: #0085ff;
    font-size: 30px;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
