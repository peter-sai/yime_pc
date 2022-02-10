<template>
  <div class="register">
    <!-- logo -->
    <div class="logo">
      <img :src="logo" alt="" srcset="" />
    </div>
    <!-- main -->
    <div class="main">
      <!-- input -->
      <div class="input">
        <InputGroup
          type="text"
          :placeholder="t('请输入账号')"
          v-model="query.nickname"
        ></InputGroup>
        <InputGroup
          type="password"
          :placeholder="t('请输入6-15位新密码')"
          v-model="query.password"
        ></InputGroup>
        <InputGroup
          type="password"
          :placeholder="t('请确认密码')"
          v-model="query.confirmPwd"
        ></InputGroup>
      </div>
      <!-- button -->
      <div class="button" @click="reg">注册并登录</div>
      <div class="agreementInfo">
        <Iconfont
          v-if="agreement"
          name="iconfuxuankuangactive"
          class="select"
          size="15"
          color="prominent"
          @click="toggleSelect"
        />
        <Iconfont
          v-else
          name="iconfuxuankuang"
          class="select"
          size="15"
          color="sub"
          @click="toggleSelect"
        />
        {{ t('本人接受') }}
        <span @click="goTo('agreement')" class="agreement">{{
          t('《DUOLIAO协议》')
        }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Register',
});
</script>
<script setup lang="ts">
import InputGroup from '@/components/InputGroup/index.vue';
import logo from '@/assets/logo.svg';
import Iconfont from '@/iconfont/index.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { reactive, ref, Ref } from 'vue';
import { useGoTo } from '@/hooks';
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router';
import { Toast } from '@/plugin/Toast';
import { md5 } from '@/utils/utils';
import { saveData } from '@/api/app';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';

const store = useStore(key);
const route = useRoute();

// 参数
const query = reactive({
  nickname: '',
  password: '',
  confirmPwd: '',
});

type Tquery = typeof query;

// 切换协议
const agreement = ref(false);
const toggleSelect = () => {
  agreement.value = !agreement.value;
};

const goTo = useGoTo(useRouter);

// 注册
const reg = useReg(goTo, store, query, agreement, route, t);

// 注册
function useReg(
  goTo: (e: string) => void,
  store: Store<initStore>,
  query: Tquery,
  agreement: Ref<boolean>,
  route: RouteLocationNormalizedLoaded,
  t: any,
) {
  return async () => {
    if (!query.nickname) {
      return Toast(t('请输入昵称'));
    }
    if (!query.password) {
      return Toast(t('请输入密码'));
    }
    if (query.password !== query.confirmPwd) {
      return Toast(t('两次输入的密码不一致'));
    }
    if (!agreement.value) {
      return Toast(t('请同意协议'));
    }
    const res = {
      registerInfo: {
        nickname: query.nickname,
        password: md5(query.password),
      },
      loginInfo: {
        loginType: 7,
        loginId: route.query.loginId,
        loginPasswdToken: route.query.loginPasswdToken,
      },
      equipmentInformation: {
        deviceBrand: 'web',
        releaseVersion: '2.0.0',
      },
    };
    const data = await store.dispatch('postMsg', {
      query: res,
      cmd: 1005,
      encryption: 'Aoelailiao.Login.LoginReq',
    });

    if (data.body.resultCode === 0) {
      // 保存数据到本地
      saveData(data, store);

      return goTo('/Home/Message');
    }
    return Toast(t(data.body.resultString));
  };
}
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.register {
  .logo {
    width: 120px;
    margin: 76px auto 36px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .main {
    margin: 0 auto;
    width: 300px;
    .nav {
      display: flex;
      justify-content: center;
      .btn {
        font-size: 16px;
        color: #999999;
        margin: 0 15px;
        position: relative;
        cursor: pointer;
        &.active {
          color: #0085ff;
          &::after {
            position: absolute;
            width: 20px;
            height: 3px;
            display: block;
            content: '';
            left: 50%;
            margin-left: -10px;
            bottom: -9px;
            background: #0085ff;
          }
        }
      }
    }
    .input {
      .areaCode {
        display: flex;
        align-items: center;
        position: relative;
        .value {
          display: flex;
          align-items: center;
          cursor: pointer;
          span {
            font-size: 16px;
          }
          .iconfont {
            margin-left: 10px;
            transform: rotate(90deg);
          }
        }
        .box {
          position: absolute;
          width: 302px;
          height: 248px;
          background: #ffffff;
          border: 1px solid #eaeaea;
          left: 0;
          top: 100%;
          padding: 12px 12px;
          overflow: auto;
          .boxItem {
            height: 30px;
            padding: 0 18px;
            line-height: 30px;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            &.active {
              background: #f7f7f7;
              border-radius: 2px;
            }
            .itemLeft {
              font-size: 14px;
            }
            .itemRight {
              font-size: 14px;
            }
          }
        }
      }
    }
    .agreementInfo {
      color: #333;
      font-size: 12px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont {
        cursor: pointer;
      }
      .select {
        margin-right: 5px;
      }
      .agreement {
        font-size: 12px;
        color: #0085ff;
      }
    }
    .button {
      width: 299px;
      height: 40px;
      background: #0085ff;
      border-radius: 4px;
      display: flex;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      line-height: 40px;
      letter-spacing: 1px;
      align-items: center;
      justify-content: center;
      margin-top: 35px;
      margin-bottom: 10px;
      cursor: pointer;
    }
    .info {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      letter-spacing: 1px;
      text-align: center;
    }
  }
}
</style>
