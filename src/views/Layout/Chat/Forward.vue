<template>
  <div class="Forward">
    <NavigationBar title="转发" hide-left disable-left>
      <template v-slot:left>
        <Iconfont
          name="iconfork"
          size="20"
          @click="$emit('changeTag', Etag.UserInfo)"
        />
      </template>
    </NavigationBar>
    <div style="margin: 15px 10px">
      <Search :placeholder="t('搜索')" v-model="search" :width="60" />
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
          <Table :title="item.name" hideMore @click="toggleActive(item)">
            <template v-slot:left v-if="item.groupId">
              <img v-if="item.groupIcon" :src="item.groupIcon" alt="" />
              <span class="userImg" v-else>
                {{
                  item.groupName
                    ? item.groupName.substr(0, 1).toLocaleUpperCase()
                    : ''
                }}
              </span>
            </template>
            <template v-slot:left v-else>
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
        确定
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, Ref, ref, defineEmits } from 'vue';
import Table from '@/components/Table/index.vue';
import Iconfont from '@/iconfont/index.vue';
import Search from '@/components/Search/index.vue';
import { Etag } from '../index.vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
export default defineComponent({
  name: 'Forward',
});
</script>
<script setup lang="ts">
import { key } from '@/store';
import { IContacts, IGroupInfo } from '@/types/user';
import { getTag } from '@/utils/utils';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { Toast } from '@/plugin/Toast';
const emit = defineEmits(['toggleBox', 'changeTag']);

const { t } = useI18n();
const store = useStore(key);
const list: Ref<IContacts[]> = ref([]);
const activeUid = store.state.activeUid;
const userId = store.state.userUid;
const search = ref('');
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
    const friendInfos = data.body.friendInfos.filter(
      (e: IContacts) => Number(e.uid) !== Number(activeUid),
    );

    list.value = friendInfos.concat(data.body.groupInfos || []);

    list.value.forEach((e: any) => {
      e.name =
        (e.userAttachInfo && e.userAttachInfo.remarkName) ||
        e.nickname ||
        e.groupName;
      e.tag = getTag(e);
      e.active = false;
    });
    list.value.sort((a, b) => a.tag.charCodeAt(0) - b.tag.charCodeAt(0));
  } catch (error) {
    console.log(error);
  }
};
init();

const newList = computed(() =>
  list.value.filter((e) => e?.name?.includes(search.value)),
);

// 切换选中状态
const toggleActive = (item: IContacts) => {
  if (Number(item.uid) === Number(userId)) return;
  item.active = !item.active;
};

// 确定
const submit = async () => {
  const activeList = newList.value.filter((e) => e.active);

  if (!activeList.length) return;
  const forwardMsg = activeList.map((e) => {
    return {
      isGroupMsg: e.uid ? 0 : 1,
      toId: e.uid || e.groupId,
    };
  });
  const res = {
    forwardType: 1,
    forwardMsgIds: [store.state.forwardMsgId],
    forwardMsg,
  };
  console.log(res);

  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 2055,
    encryption: 'Aoelailiao.Message.UserForwardMsgInfoReq',
    auth: true,
  });

  if (data.body.resultCode === 0) {
    emit('toggleBox');
  }
  Toast(t(data.body.resultString));
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.Forward {
  height: 100%;
  display: flex;
  flex-direction: column;
  .userImg {
    width: 30px;
    height: 30px;
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
