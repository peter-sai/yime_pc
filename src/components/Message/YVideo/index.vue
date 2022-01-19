<template>
  <div class="mmsg">
    <div @click="$emit('click')">
      <img :src="userInfo?.icon" />
    </div>
    <ImBg @click="$emit('clickMsg')">
      <div class="imBgBox">
        <span
          >{{ data.sendShowMsg[0].msgText }}
          {{
            data.needShowTime === 0 ? formateTime(data.callTime) : null
          }}</span
        >
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
import { defineComponent, defineProps, PropType } from 'vue';
import { IVideoCallMsgInfo } from '@/types/msg';
export default defineComponent({
  name: 'YAudio',
});
</script>
<script lang="ts" setup>
defineProps({
  userInfo: {
    type: Object,
  },
  data: {
    type: Object as PropType<IVideoCallMsgInfo>,
    required: true,
  },
});

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
