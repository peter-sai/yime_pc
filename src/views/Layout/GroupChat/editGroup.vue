<template>
  <div class="editGroup">
    <NavigationBar
      :title="t('群资料')"
      disable-left
      @left-click="$emit('changeTag', Etag.GroupInfo)"
    />
    <div style="flex: 1">
      <div class="header">
        <!-- <img src="../../../../public/img/notice.svg" alt="" /> -->
        <div class="userImg">
          <img
            v-if="groupDetailInfo?.groupIcon"
            :src="groupDetailInfo?.groupIcon"
            alt=""
          />
          <span v-else>{{
            groupDetailInfo?.groupName
              ? groupDetailInfo?.groupName.substr(0, 1).toLocaleUpperCase()
              : ''
          }}</span>
        </div>
      </div>
      <div class="main">
        <div class="info">{{ t('群聊名称') }}</div>
        <div class="input">
          <input
            type="text"
            :placeholder="t('请输入新的群名称')"
            v-model="groupName"
          />
        </div>
        <div class="info">{{ t('群公告') }}</div>
        <div class="input">
          <textarea
            :placeholder="t('请输入群公告内容')"
            v-model="notice"
          ></textarea>
        </div>
      </div>
      <div class="btn" @click="submit">{{ t('保存') }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineEmits, PropType } from 'vue';
export default defineComponent({
  name: 'editGroup',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import { Etag } from '../index.vue';
import { useUserOperateGroupInfo } from '@/hooks/window';
import { useStore } from 'vuex';
import { key } from '@/store';
import { ref, defineProps } from 'vue';
import { Toast } from '@/plugin/Toast';
import { useI18n } from 'vue-i18n';
import { IGroupInfo } from '@/types/user';
const emit = defineEmits(['changeTag', 'toggleBox']);
const props = defineProps({
  groupDetailInfo: {
    type: Object as PropType<IGroupInfo>,
  },
});
const store = useStore(key);
const notice = ref(props.groupDetailInfo?.groupNoticeInfo.groupNoticeContent);
const groupName = ref(props.groupDetailInfo?.groupName);
const { t } = useI18n();

const userOperateGroupInfo = useUserOperateGroupInfo(store);

const submit = async () => {
  if (!groupName.value && !notice.value) return Toast(t('请输入'));
  if (groupName.value !== props.groupDetailInfo?.groupName && groupName.value) {
    try {
      // 群名
      const query1 = {
        groupName: groupName.value,
        groupId: store.state.activeUid,
      };
      const data = await userOperateGroupInfo(11, query1);

      if (data.body.resultCode === 0) {
        const uid = data.body?.groupInfo?.groupId || store.state.activeUid;
        const item = store.state.msgList[uid];
        item.groupDetailInfo = data.body.groupInfo;
        store.commit('SET_MSGLISTITEM', { res: item, uid: uid });
      }
      Toast(t(data.body.resultString));
    } catch (error) {
      console.log(error);
    }
  }

  if (
    notice.value !==
      props.groupDetailInfo?.groupNoticeInfo.groupNoticeContent &&
    notice.value
  ) {
    try {
      // 公告
      const query = {
        groupId: store.state.activeUid,
        groupNoticeInfo: {
          groupNoticeContent: notice.value,
          updateTime: Date.now(),
          editorUid: store.state.userInfo.uid,
        },
      };
      const data = await userOperateGroupInfo(12, query);
      if (data.body.resultCode === 0) {
        const uid = data.body?.groupInfo?.groupId || store.state.activeUid;
        const item = store.state.msgList[uid];
        item.groupDetailInfo = data.body.groupInfo;
        store.commit('SET_MSGLISTITEM', { res: item, uid: uid });
      }
      Toast(t(data.body.resultString));
    } catch (error) {
      console.log(error);
    }
  }
  emit('toggleBox');
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.editGroup {
  .header {
    text-align: center;
    margin: 20px 0;
    .userImg {
      margin: 0 0 8px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #f0f0f0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      span {
        color: #0085ff;
        font-size: 32px;
      }
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
  .main {
    .info {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #2b2c33;
      line-height: 17px;
      width: 320px;
      height: 30px;
      background: #f0f1f4;
      display: flex;
      align-items: center;
      padding: 0 20px;
    }
    .input {
      padding: 15px 20px;
      input {
        padding: 0 15px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border: 1px solid #bdbdbd;
        font-size: 16px;
        color: #000;
        box-sizing: border-box;
        border-radius: 6px;
      }
      textarea {
        padding: 13px 15px;
        border: 1px solid #bdbdbd;
        font-size: 16px;
        color: #000;
        box-sizing: border-box;
        border-radius: 6px;
        width: 100%;
        height: 180px;
      }
    }
  }
  .btn {
    width: 280px;
    height: 34px;
    background: #0085ff;
    border-radius: 6px;
    font-size: 14px;
    font-family: SourceHanSansCN, SourceHanSansCN-Regular;
    font-weight: 400;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto 0;
    cursor: pointer;
  }
}
</style>
