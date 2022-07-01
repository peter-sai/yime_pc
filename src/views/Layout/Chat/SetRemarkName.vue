<template>
  <div class="SetBackground">
    <NavigationBar :title="t('修改备注')" hide-left disable-left>
      <template v-slot:left>
        <Iconfont
          name="iconfork"
          size="20"
          @click="$emit('changeTag', Etag.UserInfo)"
        />
      </template>
    </NavigationBar>
    <div class="title">{{t('备注')}}</div>
    <div class="main">
      <div class="input">
        <input type="text" :placeholder="t('请输入备注')" v-model="remarkName" />
      </div>
      <div class="btn" @click="submit">{{t('确认')}}</div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  Ref,
  ref,
  defineEmits,
  onMounted,
  nextTick,
} from 'vue';
import Iconfont from '@/iconfont/index.vue';
import { Etag } from '../index.vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
export default defineComponent({
  name: 'SetRemarkName',
});
</script>
<script setup lang="ts">
import { key } from '@/store';
import { getTag } from '@/utils/utils';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { Toast } from '@/plugin/Toast';
import { useToggleFriend } from '@/hooks/window';
const emit = defineEmits(['toggleBox', 'changeTag']);

const { t } = useI18n();
const store = useStore(key);
const remarkName = ref('');

const submit = async () => {
  if(remarkName.value.length < 1 || remarkName.value.length > 20){
    Toast(t('好友备注长度不合法'));
    return;
  }
  const res = {
    operateType: 11,
    userInfo: {
      uid: store.state.activeUid,
    },
    remarkName: remarkName.value
  };
  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 1025,
    encryption: 'Aoelailiao.Login.UserOperateFriendShipReq',
    auth: true,
  });

  Toast(t(data.body.resultString));
  const index:any = store.state.contact.findIndex((item:any) => item.uid == store.state.activeUid)
  if(index == -1){
    await useToggleFriend(store, t, {uid: store.state.activeUid} as any)(true)
  }

  if(store.state.msgList[store.state.activeUid!]?.userDetailInfo){
    store.state.msgList[store.state.activeUid!].userDetailInfo.userInfo.userAttachInfo.remarkName = remarkName.value
  }
  
  if(store.state.contact[index!]){
    (store.state.contact[index!] as any).userAttachInfo.remarkName = remarkName.value
  }
  emit('changeTag', Etag.UserInfo);
}

onMounted(async () => {
  const data:any = store.state.contact.find((item:any) => item.uid == store.state.activeUid)
  console.log(store.state.contact)
  if(data){
    remarkName.value = data.userAttachInfo?.remarkName
  }else{
    const res = {
      uid: store.state.activeUid,
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1011,
      encryption: 'Aoelailiao.Login.ClientGetUserInfoReq',
      auth: true,
    });
    remarkName.value = data.body.userDetailInfo.userInfo.userAttachInfo?.remarkName
  }
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.SetBackground {
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
  .title, input{
    font-size: 12px;
    font-weight: 400;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  }
  .title {
    padding-left: 20px;
    width: 320px;
    line-height: 30px;
    color: #2B2C33;
    background: #F0F1F4;
  }
  .main {
    height: 100%;
    position: relative;
    overflow: auto;
    .input {
      margin: 13px auto 0;
      width: 280px;
      height: 40px;
      input {
          padding: 0 13px;
          width: 100%;
          height: 100%;
          border-radius: 6px;
          border: 1px solid #BDBDBD;
          box-sizing: border-box;
          @include theme('color', main);
          &::-webkit-input-placeholder {
            font-size: 12px;
          }
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
      color: #FFFFFF;
      line-height: 18px;
      margin: 32px auto 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: #0085FF;
    }
  }
}
</style>
