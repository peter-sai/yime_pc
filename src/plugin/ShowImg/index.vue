<template>
  <div class="showImg">
    <div style="width: 100%; height: 100%">
      <!-- Swiper -->
      <div class="swiper-container gallery-top">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in imgList" :key="item.msgId">
            <div
              class="img"
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
            ></div>
          </div>
        </div>
        <!-- Add Arrows -->
        <div class="swiper-button-next swiper-button-white"></div>
        <div class="swiper-button-prev swiper-button-white"></div>
      </div>
      <div class="swiper-container gallery-thumbs">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in imgList" :key="item.msgId">
            <!-- <img :src="item.imageUrl" alt="" /> -->
            <div
              class="img"
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      class="img"
      :style="{
        background: `url(${src}) no-repeat  center`,
        backgroundSize: 'contain',
      }"
    ></div> -->
    <div class="close" @click="close"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps, onMounted, PropType } from 'vue';
export default defineComponent({
  name: 'ShowImg',
});
</script>
<script lang="ts" setup>
const props = defineProps({
  initialSlide: {
    type: Number,
  },
  imgList: {
    type: Array as PropType<{ msgId: number; imageUrl: string }[]>,
  },
  destroy: {
    type: Function,
  },
});
const close = () => {
  props.destroy && props.destroy();
};

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    close();
  }
});

onMounted(() => {
  // eslint-disable-next-line no-undef
  var galleryThumbs = new Swiper('.gallery-thumbs', {
    spaceBetween: 10,
    slidesPerView: 4,
    initialSlide: props.initialSlide,
    freeMode: true,
    keyboard: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  });
  // eslint-disable-next-line no-undef
  new Swiper('.gallery-top', {
    spaceBetween: 10,
    initialSlide: props.initialSlide,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    keyboard: true,
    thumbs: {
      swiper: galleryThumbs,
    },
  });
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.showImg {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba($color: #000000, $alpha: 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 30px;
    cursor: pointer;
    height: 30px;
    z-index: 99;
    &::after {
      width: 100%;
      display: block;
      content: '';
      height: 2px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::before {
      display: block;
      content: '';
      width: 100%;
      height: 2px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
  .img {
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    img {
      height: 100%;
      width: 100%;
    }
  }
}

.swiper-container {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
}
.swiper-slide {
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gallery-top {
  height: 80%;
  width: 100%;
}
.gallery-thumbs {
  height: 20%;
  box-sizing: border-box;
  padding: 10px 0;
  background: #000;
}
.gallery-thumbs .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.6;
}
.gallery-thumbs .swiper-slide-thumb-active {
  opacity: 1;
  border: 1px solid #eee;
}
.swiper-button-next,
.swiper-button-prev {
  background: #000;
  padding: 20px 10px;
}
img {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: auto;
}
</style>
