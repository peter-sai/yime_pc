<template>
  <div class="mmsg">
    <div style="flex: 1">
      <ImBg v-bind="$attrs" isMe style="display: inline-block">
        <div class="imBgBox" @click="$emit('call')">
          <span
            >{{ t(filterData[0].msgText)
            }}{{
              data.needShowTime === 0 ? formateTime(data.callTime) : null
            }}</span
          >
          <div>
            <Iconfont
              v-if="Number(data.videoType) === 1"
              name="iconvioce_refuse"
              size="20"
              color="white"
            />
            <Iconfont v-else name="iconvideo_refuse" size="20" color="white" />
          </div>
        </div>
      </ImBg>
      <IsRead :isRead="isRead" />
    </div>
  </div>
</template>
<script lang="ts">
import ImBg from '../ImgBg/index.vue';
import Iconfont from '@/iconfont/index.vue';
import IsRead from '@/components/IsRead/index.vue';
import {
  defineComponent,
  defineProps,
  PropType,
  defineEmits,
  computed,
} from 'vue';
import { IVideoCallMsgInfo } from '@/types/msg';
import { useStore } from 'vuex';
import { key } from '@/store';
import { Toast } from '@/plugin/Toast';
import { MediaAudio } from '@/plugin/Audio';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'MVideo',
});
</script>
<script lang="ts" setup>
defineEmits(['call']);
const { t } = useI18n();
const props = defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<IVideoCallMsgInfo>,
    required: true,
  },
});

const store = useStore(key);
const filterData = computed(() =>
  props.data.sendShowMsg.filter((e) =>
    e.userIds.includes(store.state.userInfo.uid)
  )
);

const formateTime = (s: number) => {
  const minutes = parseInt((s / 60).toString()).toString();
  const seconds = (s - 60 * Number(minutes)).toString();
  return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.mmsg {
  text-align: right;
  display: flex;
  .imBgBox {
    display: flex;
    width: 100%;
    .time {
      font-size: 16px;
    }
    span {
      font-size: 16px;
      @include theme(color, white);
      margin-right: 10px;
    }
  }
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
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
