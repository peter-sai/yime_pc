<template>
  <div class="mmsg">
    <div style="flex: 1">
      <div class="imgBgBox me" v-if="replyMsg?.msgId">
        <Reply :replyMsg="replyMsg" :userInfo="replyUserInfo" isMe />
        <div
          class="fileBg"
          @contextmenu="contextmenu"
          @click="$emit('download')"
        >
          <Fire
            :isBurn="isBurn"
            :fired="fired"
            :left="`-33px`"
            :top="`-120px`"
          />
          <div class="left">
            <div class="title">{{ item?.fileName }}</div>
            <div class="size">{{ size }}</div>
          </div>
          <div class="right">
            <Iconfont :name="name" size="44" />
          </div>
        </div>
      </div>
      <div
        class="fileBg"
        v-else
        @contextmenu="contextmenu"
        @click="$emit('download')"
      >
        <Fire :isBurn="isBurn" :fired="fired" :left="`-23px`" :top="`-48px`" />
        <div class="left">
          <div class="title">{{ item?.fileName }}</div>
          <div class="size">{{ size }}</div>
        </div>
        <div class="right">
          <Iconfont :name="name" size="44" />
        </div>
      </div>
      <IsRead :isRead="isRead" />
    </div>
    <!-- <img :src="userImg" /> -->
  </div>
</template>
<script lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { getSize } from '@/utils/utils';
import { ref, defineComponent, defineProps, PropType, defineEmits } from 'vue';
import IsRead from '@/components/IsRead/index.vue';
import Fire from '../Fire/index.vue';
import Reply from '../Reply/index.vue';
import { IFileInfo } from '@/types/msg';
import { IMsgInfo } from '@/types/msg';
import { IUserInfo } from '@/types/user';
defineComponent({
  name: 'MFile',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as PropType<IFileInfo>,
  },
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
  replyUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  replyMsg: {
    type: Object as PropType<IMsgInfo>,
  },
});

const name = ref('iconWORD');
const res = props.item!.fileName.split('.');
if (res.length > 1) {
  const suffix = res[1];
  if (suffix.toLocaleLowerCase().includes('doc')) {
    name.value = 'iconWORD';
  } else if (suffix.toLocaleLowerCase().includes('xls')) {
    name.value = 'iconexcel';
  } else if (suffix.toLocaleLowerCase().includes('pdf')) {
    name.value = 'iconpdf';
  } else {
    name.value = 'iconwenjian';
  }
}

const size = getSize(props.item!.fileSize);

const emit = defineEmits(['menuClick', 'download']);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit('menuClick', e);
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.mmsg {
  text-align: right;
  display: flex;
  .fileBg {
    text-align: left;
    background: #f4f6ff;
    display: flex;
    justify-content: space-between;
    width: 222px;
    height: 88px;
    margin: 0 0 0 auto;
    padding: 12px;
    box-sizing: border-box;
    align-items: center;
    border-radius: 14px 0px 14px 14px;
    .left {
      .title {
        width: 140px;
        height: 44px;
        font-size: 16px;
        color: #333;
        line-height: 22px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
      }
      .size {
        font-size: 12px;
        color: #666;
        line-height: 17px;
        margin-top: 5px;
      }
    }
  }
  .isRead {
    font-size: 12px;
    color: #b3b3b3;
    margin-top: 5px;
    img {
      width: 12px;
    }
  }
}
.imgBgBox {
  padding: 10px;
  background: #f3f3f6;
  display: inline-block;
  font-size: 16px;
  color: #333333;
  border-radius: 0px 14px 14px 14px;
  word-break: break-all;
  // display: inline-flex;
  align-items: center;
  &.me {
    border-radius: 14px 0px 14px 14px;
    color: #fff;
    background: #0085ff;
  }
}
</style>
