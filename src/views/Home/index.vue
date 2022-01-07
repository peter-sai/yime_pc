<template>
  <div class="home">
    <div class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <div class="footer">
      <div class="left" @click="goTo('/Home/Message')">
        <Iconfont
          name="iconliaotianjilu"
          size="25"
          :color="router.path === '/Home/Message' ? '#0085FF' : '#9E9E9E'"
        />
      </div>
      <div class="right" @click="goTo('/Home/contacts')">
        <Iconfont
          name="iconlianxiren"
          size="25"
          :color="
            list.find((e) => router.path.includes(e)) ? '#0085FF' : '#9E9E9E'
          "
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
export default defineComponent({
  name: 'home',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { useRoute, useRouter } from 'vue-router';
import { useGoTo } from '@/hooks';

const router = useRoute();

const goTo = useGoTo(useRouter);

const list = ['contacts', 'addContact', 'group', 'blacklist'];

// const key = computed(() => router.path);
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.home {
  display: flex;
  flex-direction: column;
  height: 100%;
  .main {
    overflow: auto;
    flex: 1;
    padding-bottom: 50px;
    // display: flex;
  }
  .footer {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 300px;
    height: 50px;
    border-top: 1px solid #eaebea;
    background: #ffffff;
    .left {
      flex: 1;
      display: flex;
      justify-content: center;
      border-right: 1px solid #eaebea;
      cursor: pointer;
    }
    .right {
      flex: 1;
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
  }
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-300px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-300px);
}
</style>
