<template>
  <div class="forgetPassword">
    <div class="boBack" @click="goBack">
      <Iconfont name="iconleft" size="15" />
      <span>{{ t('返回') }}</span>
    </div>
    <!-- logo -->
    <div class="logo">
      <img :src="logo" alt="" srcset="" />
    </div>
    <!-- main -->
    <div class="main">
      <!-- input -->
      <div class="input">
        <InputGroup :placeholder="t('请输入手机号')" v-model="query.phone">
          <template v-slot:phone>
            <div class="areaCode">
              <div class="value" @click="showBox = !showBox">
                <span>+{{ areaCode }}</span>
                <Iconfont name="iconright" size="10" class="iconfont" />
              </div>
              <div class="box" v-if="showBox">
                <div
                  class="boxItem"
                  :class="{ active: areaCode === item.code }"
                  v-for="item in list"
                  @click="
                    areaCode = item.code;
                    showBox = false;
                  "
                  :key="item.code"
                >
                  <div class="itemLeft">{{ item[lang] }}</div>
                  <div class="itemRight">+{{ item.code }}</div>
                </div>
              </div>
            </div>
          </template>
        </InputGroup>
        <InputGroup
          :placeholder="t('请输入验证码')"
          v-model="query.verificationCode"
          @onGetCode="getCode"
        >
          <template v-slot:getCode>{{ codeMsg }}</template>
        </InputGroup>
        <InputGroup
          type="password"
          :placeholder="t('请输入密码')"
          v-model="query.password"
        ></InputGroup>
        <InputGroup
          type="password"
          :placeholder="t('请确认密码')"
          v-model="query.confirmPwd"
        ></InputGroup>
      </div>
      <!-- button -->
      <div class="button" @click="submit">{{ t('确认') }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, Ref, ref } from 'vue';
export default defineComponent({
  name: 'ForgetPassword',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { useI18n } from 'vue-i18n';
import InputGroup from '@/components/InputGroup/index.vue';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';
import code from '@/config/code.json';

import { getLang, md5 } from '@/utils/utils';
import { Toast } from '@/plugin/Toast';
import { showLoading } from '@/plugin/Loading';
import { useRouter } from 'vue-router';
import { useGoBack } from '@/hooks';
import config from '../../config';
const logoPath = config.ELECTRON_NAME;
const logo = require(`@/assets/${logoPath}/logo.svg`);

const router = useRouter();
const store = useStore(key);
const { t } = useI18n();
// 参数
const query = reactive({
  phone: '',
  verificationCode: '',
  password: '',
  confirmPwd: '',
});

type TQuery = typeof query;

// 验证码文案
let codeMsg = ref(t('获取验证码'));
let time = ref(60);

// 区号弹框
const showBox = ref(false);
// 区号
const areaCode = ref(86);
const langList = ['zh', 'tw', 'en'];
const langKey = store.state.lang === -1 ? getLang() : store.state.lang;
const lang = langList[langKey];
const list = reactive(code);

const goBack = useGoBack(useRouter);

// 点击获取验证码
const getCode = useGetCode(store, codeMsg, query, areaCode, time, timeout, t);

// 获取验证码
function useGetCode(
  store: Store<initStore>,
  codeMsg: Ref<string>,
  query: TQuery,
  areaCode: Ref<number>,
  time: Ref<number>,
  timeout: any,
  t: any
) {
  return async () => {
    if (!query.phone) {
      return Toast(t('请输入手机号'));
    }
    if (codeMsg.value === t('获取验证码')) {
      showLoading();
      const res = {
        phone: '+' + areaCode.value + query.phone,
        type: 2,
      };
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 1001,
        encryption: 'Aoelailiao.Login.GetAuthCodeReq',
      });
      if (data.body.resultCode === 0) {
        codeMsg.value = time.value + 's';
        timeout();
      }
      return Toast(t(data.body.resultString));
    }
  };
}

// 确认
const submit = async () => {
  if (!query.phone) {
    return Toast(t('请输入手机号'));
  }
  if (!query.verificationCode) {
    return Toast(t('请输入验证码'));
  }
  if (!query.password) {
    return Toast(t('请输入密码'));
  }
  if (query.password !== query.confirmPwd) {
    return Toast(t('两次输入的密码不一致'));
  }
  showLoading();
  const res = {
    phone: '+' + areaCode.value + query.phone,
    type: 2,
    authCode: query.verificationCode,
    newPasswdMd5: md5(query.password),
  };
  const data = await store.dispatch('postMsg', {
    query: res,
    cmd: 1003,
    encryption: 'Aoelailiao.Login.AuthAuthCodeReq',
  });
  if (data.body.resultCode === 0) {
    router.replace({
      path: '/Login',
    });
  }
  return Toast(t(data.body.resultString));
};

// timeout
function timeout() {
  setTimeout(() => {
    if (time.value > 0) {
      timeout();
      time.value--;
      codeMsg.value = time.value + 's';
    } else {
      codeMsg.value = t('获取验证码');
      time.value = 60;
    }
  }, 1000);
}
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.forgetPassword {
  .boBack {
    display: flex;
    align-items: center;
    margin: 20px 25px;
    cursor: pointer;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
      line-height: 20px;
    }
  }
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
    width: 350px;
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
    .button {
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
      margin-top: 40px;
      margin-bottom: 10px;
      cursor: pointer;
      &.isPwd {
        margin-top: 20px;
      }
    }
    .forgetPassword {
      color: #0085ff;
      font-size: 14px;
      margin-top: 20px;
      cursor: pointer;
      text-align: right;
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
