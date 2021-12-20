<template>
  <div class="groupWindow">
    <!-- 群 -->
    <GroupChatHeader
      :title="groupDetailInfo.groupName"
      :subTitle="
        groupDetailInfo.groupMemberLists
          ? groupDetailInfo.groupMemberLists.memberUserInfos.length.toString()
          : ''
      "
      :icon="groupDetailInfo.groupIcon"
      @toggleBox="toggleBox"
      @changeTag="changeTag"
    />

    <Bottom />
    <!-- 弹框 -->
    <div>
      <transition name="fade">
        <div v-if="showBox" class="box" @click.stop="showBox = false" />
      </transition>
      <!-- 群资料 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.GroupInfo" class="boxContent">
          <GroupInfo
            :groupDetailInfo="groupDetailInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
          />
        </div>
      </transition>
      <!-- 编辑群资料 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.EditGroup" class="boxContent">
          <EditGroup
            :groupDetailInfo="groupDetailInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
          />
        </div>
      </transition>
      <!-- 编辑群资料 -->
      <transition name="fade-transform1" mode="out-in">
        <div v-if="showBox && tag === Etag.AddGroupType" class="boxContent">
          <AddGroupType
            :groupDetailInfo="groupDetailInfo"
            @toggleBox="toggleBox"
            @changeTag="changeTag"
          />
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { initStore, key } from '@/store';
import { IGroupInfo } from '@/types/user';
import { defineComponent, ref, Ref, defineEmits } from 'vue';
import { Store, useStore } from 'vuex';
import GroupChatHeader from './header.vue';
import GroupInfo from '../Layout/groupInfo.vue';
import EditGroup from '../Layout/editGroup.vue';
import AddGroupType from '../Layout/addGroupType.vue';
import Bottom from '../Layout/bottom.vue';
import { Etag } from '../Layout/index.vue';
export default defineComponent({
  name: 'groupWindow',
});

async function getGroupInfo(
  store: Store<initStore>,
  groupDetailInfo: Ref<IGroupInfo>,
) {
  const data = await store.dispatch('postMsg', {
    query: {
      groupId: store.state.activeUid,
    },
    cmd: 1029,
    encryption: 'Aoelailiao.Login.ClientGetGroupInfoReq',
    auth: true,
  });
  groupDetailInfo.value = data.body?.groupDetailInfo || {};
}
</script>
<script setup lang="ts">
defineEmits(['toggleBox', 'changeTag']);
// 是否显示右侧
const showBox = ref(false);
const toggleBox = () => {
  showBox.value = !showBox.value;
};
// 右侧显示的内容
const tag = ref<Etag>(Etag['UserInfo']);
const changeTag = (val: Etag) => {
  tag.value = val;
};

const groupDetailInfo: Ref<IGroupInfo> = ref({}) as Ref<IGroupInfo>;
const store = useStore(key);
async function init() {
  await getGroupInfo(store, groupDetailInfo);
}
init();
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.groupWindow {
  .box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .boxContent {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 320px;
    background: #fff;
  }
}
</style>
