<template>
  <div class="setting">
    <NavigationBar title="设置">
      <template v-slot:right>
        <Iconfont @click="goTo('/Setting/edit')" name="iconfankui" size="18" />
      </template>
    </NavigationBar>
    <div style="flex: 1">
      <div class="user">
        <img :src="userInfo.icon" alt="" />
        <div class="userName">{{ userInfo.nickname }}</div>
        <div class="phone">
          <Iconfont name="iconshoujihaoma" size="10" color="#929292" />
          {{ userDetailInfo.phone }}
        </div>
        <div class="uid">
          <div class="icon">ID</div>
          {{ userInfo.imAccount }}
        </div>
      </div>
      <div class="list">
        <Table :title="t('切换语言')" @click="goTo('/Setting/changeLang')">
          <template v-slot:left>
            <Iconfont name="iconyuyan" size="20" color="#2B2C33" />
          </template>
        </Table>
        <Table :title="t('通知和声音')" @click="goTo('/Setting/notice')">
          <template v-slot:left>
            <Iconfont name="icontongzhi" size="20" color="#2B2C33" />
          </template>
        </Table>
        <Table :title="t('安全与隐私')" @click="goTo('/Setting/security')">
          <template v-slot:left>
            <Iconfont name="iconjiami" size="20" color="#2B2C33" />
          </template>
        </Table>
        <Table :title="t('意见反馈')" @click="goTo('/Setting/feedback')">
          <template v-slot:left>
            <Iconfont name="iconzhihangfankui" size="20" color="#2B2C33" />
          </template>
        </Table>
        <Table :title="t('关于MOMO')" @click="goLink('https://momo886.com')">
          <template v-slot:left>
            <Iconfont name="iconguanyu" size="20" color="#2B2C33" />
          </template>
        </Table>
        <Table :title="t('下载手机APP')" @click="goLink('http://momo886.com')">
          <template v-slot:left>
            <Iconfont name="iconshoujihaoma1" size="20" color="#2B2C33" />
          </template>
        </Table>
        <Table :title="t('退出登录')" @click="logOut">
          <template v-slot:left>
            <Iconfont name="icontuichu1" size="20" color="#2B2C33" />
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'setting',
});
</script>
<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue';
import Iconfont from '@/iconfont/index.vue';
import Table from '@/components/Table/index.vue';
import { useGoTo } from '@/hooks';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { key } from '@/store';
import { Dialog } from '@/plugin/Dialog';
const goTo = useGoTo(useRouter);
const { t } = useI18n();
const store = useStore(key);
const userDetailInfo = store.state.userDetailInfo;
const userInfo = store.state.userInfo;

const goLink = (url: string) => {
  window.open(url);
};

const logOut = () => {
  Dialog({
    title: t('退出登录') + '?',
    callBack: async () => {
      store.dispatch('logout');
      location.reload();
    },
  });
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.setting {
  .user {
    text-align: center;
    margin-top: 20px;
    img {
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
      border-radius: 50%;
    }
    .userName {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #2b2c33;
      line-height: 20px;
      letter-spacing: 0px;
    }
    .phone {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #929292;
      line-height: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0 3px;
      .iconfont {
        margin-right: 5px;
      }
    }
    .uid {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #929292;
      line-height: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        width: 14px;
        height: 14px;
        margin-right: 5px;
        border-style: solid;
        border-width: 1px;
        @include theme('border-color', main);
        @include theme('color', main);
        font-size: 12px;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1px;
      }
    }
  }
  .list {
    margin-top: 15px;
    .table {
      padding: 17px 13px;
      cursor: pointer;
      &:not(:last-child) {
        border-bottom: 1px solid #ededed;
      }
    }
  }
}
</style>
