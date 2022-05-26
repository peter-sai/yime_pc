<template>
  <div class="mmsg">
    <div
      style="
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
      "
    >
      <div class="box">
        <Sending v-if="sending" />
        <ImgBg v-bind="$attrs" isMe :fired="fired">
          <Fire
            :isBurn="isBurn"
            :fired="fired"
            :left="`-20px`"
            :top="`-15px`"
          />
          <Reply :replyMsg="replyMsg" :userInfo="replyUserInfo" isMe />
          <!-- <slot /> -->
          <p style="font-size: 14px" v-html="str" />
        </ImgBg>
      </div>
      <IsRead :isRead="isRead" />
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineProps,
  PropType,
  ref,
  useSlots,
  watch,
} from 'vue';
import ImgBg from '../ImgBg/index.vue';
import Fire from '../Fire/index.vue';
import Reply from '../Reply/index.vue';
import Sending from '@/components/Sending/index.vue';
import IsRead from '@/components/IsRead/index.vue';
import { IMsgInfo } from '@/types/msg';
import { IUserInfo } from '@/types/user';

export default defineComponent({
  name: 'Mmsg',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  sending: {
    type: Boolean,
    default: false,
  },
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
  search: {
    type: String,
  },
  replyUserInfo: {
    type: Object as PropType<IUserInfo>,
  },
  replyMsg: {
    type: Object as PropType<IMsgInfo>,
  },
});

const slots: any = useSlots();

const children = slots.default()[0].children;
const str = ref(children);

watch(
  () => props.search,
  (val) => {
    if (val) {
      str.value = children.replaceAll(
        val,
        `<span
                  style="color: #f00; font-size: 1rem"
                  >${val}</span
                >`
      );
    } else {
      str.value = children;
    }
  }
);
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.mmsg {
  text-align: right;
  .line {
    width: 100%;
    height: 1px;
    background: #ffffff;
    opacity: 0.2;
    margin: 5px 0;
  }
  .box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    max-width: 70%;

    .sending {
      margin-right: 10px;
    }
  }
  .userImg {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    margin-left: 10px;
  }
  .imBg {
    text-align: left;
  }
}
</style>
