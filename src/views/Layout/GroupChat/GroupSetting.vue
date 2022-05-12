<template>
  <div class="GroupSetting">
    <NavigationBar title="群设置" hide-left disable-left>
      <template v-slot:left>
        <Iconfont
          name="iconfork"
          size="20"
          @click="$emit('changeTag', Etag.GroupInfo)"
        />
      </template>
    </NavigationBar>
    <div class="main">
      <Table title="允许新成员查看历史消息" hide-more>
        <template v-slot:right>
          <Switch
            :beforeChange="beforeAllowMemberGetHisotyMsg"
            :switch="
              props?.groupDetailInfo?.groupAttachInfo?.allowMemberGetHisotyMsg
            "
          />
        </template>
      </Table>
      <Table title="群员隔离" hide-more>
        <template v-slot:right>
          <Switch
            :beforeChange="beforeGroupMemberSplit"
            :switch="props?.groupDetailInfo?.groupAttachInfo?.groupMemberSplit"
          />
        </template>
      </Table>
      <div class="btn" @click="dissolution">{{ t('解散群聊') }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  defineEmits,
  defineProps,
  PropType,
} from 'vue';
import Iconfont from '@/iconfont/index.vue';
import { Etag } from '../index.vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import Table from '@/components/Table/index.vue';
import Switch from '@/components/Switch/index.vue';
export default defineComponent({
  name: 'GroupSetting',
});
</script>
<script setup lang="ts">
import { key } from '@/store';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { IGroupInfo } from '@/types/user';
import { useBeforeSwitch } from '@/hooks/window';
import { Dialog } from '@/plugin/Dialog';
import { Toast } from '@/plugin/Toast';
import { IGroupListItem } from '@/types/group';

const props = defineProps({
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
});

const { t } = useI18n();
const store = useStore(key);

const beforeAllowMemberGetHisotyMsg = useBeforeSwitch(store, 1011, t);
const beforeGroupMemberSplit = useBeforeSwitch(store, 1007, t);

// 解散
const dissolution = async () => {
  Dialog({
    title: t('是否确定解散群聊?'),
    callBack: async () => {
      const query = {
        operateType: 3,
        groupInfo: { groupId: store.state.activeUid },
      };
      const data = await store.dispatch('postMsg', {
        query,
        cmd: 1027,
        encryption: 'Aoelailiao.Login.UserOperateGroupInfoReq',
        auth: true,
      });
      if (data.body.resultCode === 0) {
        const userInfo = store.state.userInfo;
        store.commit('SET_ACTIVEUID', null);
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
      }
      Toast(t(data.body.resultString));
    },
  });
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.GroupSetting {
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
    .table {
      padding: 20px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      &:first-child {
        border-top: 1px solid #eee;
      }
    }
    .btn {
      width: 90%;
      height: 44px;
      border-radius: 6px;
      border: 1px solid #bdbdbd;
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #fa5151;
      line-height: 18px;
      margin: 20px auto 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
