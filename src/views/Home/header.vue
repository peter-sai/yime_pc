<template>
  <div class="header">
    <Iconfont
      name="iconcaidan"
      size="20"
      color="#929292"
      @click="goTo('/setting')"
    />
    <div class="input">
      <Search placeholder="用户、群组与消息" />
    </div>
    <Iconfont
      name="iconsearch"
      size="20"
      color="#929292"
      @click="showBox = !showBox"
    />
    <div class="box" v-if="showBox">
      <div class="item" @click="goTo('/Home/addContact')">
        <Iconfont name="iconyaoqinghaoyoubeifen" size="15" />
        <span>添加好友</span>
      </div>
      <div class="item" @click="goTo('/Home/addGroup')">
        <Iconfont name="iconyaoqinghaoyou" size="12" />
        <span>新建群聊</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'header',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import Search from '@/components/Search/index.vue';
import { useGoTo } from '@/hooks/router';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const goTo = useGoTo(useRouter);
const showBox = ref(false);
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.header {
  display: flex;
  align-items: center;
  padding: 17px 13px;
  position: relative;
  .box {
    position: absolute;
    width: 106px;
    background: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0px 0px 26px 0px rgba(0, 0, 0, 0.2);
    z-index: 99;
    padding: 13px 5px;
    box-sizing: border-box;
    top: 75%;
    right: 13px;
    .item {
      display: flex;
      cursor: pointer;
      align-items: center;
      padding: 6px 8px;
      &:hover {
        background: #eee;
      }
      span {
        color: #000000;
        font-size: 14px;
        margin-left: 8px;
      }
    }
  }
  .iconfont {
    cursor: pointer;
  }
  .input {
    flex: 1;
  }
}
</style>
