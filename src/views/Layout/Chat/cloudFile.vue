<template>
  <div class="cloudFile">
    <NavigationBar
      title="云文件"
      disable-left
      @left-click="$emit('changeTag', Etag.UserInfo)"
    />
    <div style="position: absolute; left: 0; right: 0; bottom: 0; top: 50px">
      <Error v-if="!list.length" id="4" />
      <a
        :href="item.msgContent.fileInfo.fileUrl"
        :a="item.msgContent.fileInfo"
        download
        class="listItem"
        v-for="item in list"
        :key="item.msgTime"
      >
        <TableDouble
          :title="item.msgContent.fileInfo.fileName"
          :subTitle="getSize(item.msgContent.fileInfo.fileSize)"
        >
          <template v-slot:userImg>
            <Iconfont
              size="44"
              :name="getSuffix(item.msgContent.fileInfo.fileName)"
              class="userImg"
            />
          </template>
        </TableDouble>
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineEmits, ref, Ref } from 'vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import Iconfont from '@/iconfont/index.vue';
import TableDouble from '@/components/TableDouble/index.vue';
import { Etag } from '../index.vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { IFileInfo, IMsgInfo } from '@/types/msg';
import { getSize, getSuffix } from '@/utils/utils';
import Error from '@/views/Errors/index.vue';
export default defineComponent({
  name: 'cloudFile',
});
</script>
<script setup lang="ts">
defineEmits(['changeTag']);

const list: Ref<IMsgInfo<IFileInfo>[]> = ref([]);
const store = useStore(key);

const init = async () => {
  const data = await store.dispatch('postMsg', {
    query: {
      isGroupMsg: 0, //0--单聊信息,1--群聊信息
      objectId: store.state.userUid, //对方uid或者群id
      // msg_id_min = 3;//消息起始ID
      // msgNum: 50, //想要获取的聊天记录条数，默认为20
    },
    cmd: 2059,
    encryption: 'Aoelailiao.Message.UserGetFileListInfoReq',
    auth: true,
  });
  list.value = (data.body.msgInfos || []).sort(
    (a: IMsgInfo<IFileInfo>, b: IMsgInfo<IFileInfo>) => a.msgTime > b.msgTime
  );
};

init();
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.cloudFile {
  .listItem {
    text-decoration: none;
  }
  .tableDouble {
    padding: 17px 0;
    position: relative;
    border-bottom: 1px solid #ededed;
  }
}
</style>
