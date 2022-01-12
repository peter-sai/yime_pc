<template>
  <div class="midea">
    <div class="miniSize">
      <Iconfont name="iconnarrow_icon" size="20" color="#fff" />
    </div>
    <div class="call">
      <div class="img">
        <Iconfont
          style="display: inline-block"
          name="iconlianxiren"
          size="75"
        />
      </div>
      <div class="userName">秃头程序员</div>
      <div class="status">连接中…</div>
    </div>
    <div class="btn">
      <div class="item">
        <img src="../../assets/img/video.png" alt="" />
        <span>摄像头</span>
      </div>
      <div class="item">
        <img src="../../assets/img/audio.png" alt="" />
        <span>静音</span>
      </div>
      <div class="item" @click="close">
        <Iconfont name="iconvideo_icon1" size="44" />
        <span>挂断</span>
      </div>
      <div class="item">
        <Iconfont name="iconvideo_icon7" size="44" />
        <span>接听</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineProps, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'Midea',
});
</script>
<script lang="ts" setup>
import Iconfont from '../../iconfont/index.vue';
const props = defineProps({
  title: {
    type: String,
  },
  callBack: {
    type: Function,
  },
  destroy: {
    type: Function,
  },
});

const { t } = useI18n();
const close = () => {
  props.destroy && props.destroy();
};
const submit = async () => {
  //
};
</script>

<style lang="scss" scoped>
@import '@/style/base.scss';
.midea {
  width: 548px;
  height: 426px;
  background: linear-gradient(134deg, #98783e 0%, #996437 100%);
  box-shadow: 0px 0px 60px 0px rgba(0, 0, 0, 0.19);
  border-radius: 15px;
  margin: 0 auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .miniSize {
    position: absolute;
    left: 30px;
    top: 25px;
  }
  .call {
    text-align: center;
    margin-top: 50px;
    .userName {
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 33px;
      margin: 10px 0 5px;
    }
    .status {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
    }
  }
  .btn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    width: 200px;
    flex-wrap: wrap;
    .item {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 25px;
      cursor: pointer;
      img {
        width: 44px;
        height: 44px;
      }
      span {
        font-size: 12px;
        color: #e0d1c3;
        margin-top: 10px;
      }
    }
  }
}
</style>
