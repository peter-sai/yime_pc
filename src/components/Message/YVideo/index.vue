<template>
  <div class="mmsg">
    <div @click.stop="$emit('click')">
      <img v-if="userInfo?.icon" :src="userInfo?.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <ImBg v-bind="$attrs">
      <div class="imBgBox" @click.stop="$emit('call')">
        <div>
          <span v-if="data.callTime"
            >{{ t(filterData[0].msgText) + time(data.callTime) }}
          </span>
          <span v-else>{{ t(filterData[0].msgText) }} </span>
          {{ data.needShowTime === 0 ? formateTime(data.callTime) : null }}
        </div>
        <div>
          <Iconfont
            v-if="Number(data.videoType) === 1"
            name="iconvioce_refuse"
            size="20"
            color="main"
          />
          <Iconfont v-else name="iconvideo_refuse" size="20" color="main" />
        </div>
      </div>
    </ImBg>
  </div>
</template>

<script lang="ts">
import ImBg from '../ImgBg/index.vue';
import Iconfont from '@/iconfont/index.vue';
import {
  computed,
  defineComponent,
  defineProps,
  PropType,
  defineEmits,
} from 'vue';
import { IVideoCallMsgInfo } from '@/types/msg';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'YAudio',
});
</script>
<script lang="ts" setup>
defineEmits(['click', 'call']);
const props = defineProps({
  userInfo: {
    type: Object,
  },
  data: {
    type: Object as PropType<IVideoCallMsgInfo>,
    required: true,
  },
});

const { t } = useI18n();

const store = useStore(key);
const filterData = computed(() =>
  props.data.sendShowMsg.filter((e) =>
    e.userIds.includes(store.state.userInfo.uid)
  )
);

const time = (num: number) => {
  const m = parseInt((num / 60).toString());
  const s = num - m * 60;
  return ` ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} `;
};

// 格式化时间
const formateTime = (s: number) => {
  const minutes = parseInt((s / 60).toString()).toString();
  const seconds = (s - 60 * Number(minutes)).toString();
  return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};
</script>
<style lang="scss" scoped>
@import '@/style/theme/index.scss';
.mmsg {
  display: flex;
  .imBgBox {
    display: flex;
    .time {
      font-size: 16px;
    }
    span {
      font-size: 16px;
      @include theme(color, main);
      margin-right: 10px;
    }
  }
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    margin-left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
