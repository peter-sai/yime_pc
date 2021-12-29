<template>
  <div class="pswp__preloader__icn sending">
    <div class="bg"></div>
    <div class="pswp__preloader__cut">
      <div class="pswp__preloader__donut"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SendIng',
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.pswp__preloader__icn {
  opacity: 0.75;
  width: 18px;
  height: 18px;
  -webkit-animation: clockwise 500ms linear infinite;
  animation: clockwise 500ms linear infinite;
}
.bg {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: absolute;
  border-style: solid;
  border-width: 2px;
  border-color: #f0f1f4;
  top: 0;
  left: 0;
  box-sizing: border-box;
}
/* The idea of animating inner circle is based on Polymer loading indicator by Keanu Lee https://blog.keanulee.com/2014/10/20/the-tale-of-three-spinners.html */
.pswp__preloader__cut {
  position: relative;
  width: 12px;
  height: 24px;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
}
.pswp__preloader__donut {
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border-style: solid;
  border-width: 2px;
  border-color: #cccccc;
  @include theme('', send);
  border-radius: 50%;
  border-left-color: transparent;
  border-bottom-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  background: none;
  margin: 0;
  -webkit-animation: donut-rotate 1000ms cubic-bezier(0.4, 0, 0.22, 1) infinite;
  animation: donut-rotate 1000ms cubic-bezier(0.4, 0, 0.22, 1) infinite;
}

@-webkit-keyframes clockwise {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes clockwise {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes donut-rotate {
  0% {
    -webkit-transform: rotate(0);
  }
  50% {
    -webkit-transform: rotate(-140deg);
  }
  100% {
    -webkit-transform: rotate(0);
  }
}
@keyframes donut-rotate {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(-140deg);
  }
  100% {
    transform: rotate(0);
  }
}
</style>
