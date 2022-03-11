<template>
  <div class="login">
    <!-- logo -->
    <div class="logo">
      <img :src="logo" alt="" srcset="" />
    </div>
    <!-- main -->
    <div class="main">
      <!-- button -->
      <div class="nav">
        <div
          class="btn"
          :class="{ active: item.id === btns.active }"
          @click="changeBtnActive(item)"
          v-for="item in btns.list"
          :key="item.id"
        >
          {{ item.name }}
        </div>
      </div>
      <!-- input -->
      <div class="input">
        <InputGroup :placeholder="t('请输入手机号')" v-model="query.phone">
          <template v-slot:phone>
            <div class="areaCode">
              <div class="value" @click.stop="showBox = !showBox">
                <span>+{{ areaCode }}</span>
                <Iconfont name="iconright" size="10" class="iconfont" />
              </div>
              <div class="box" v-if="showBox">
                <div
                  class="boxItem"
                  :class="{ active: areaCode === item.code }"
                  v-for="item in list"
                  @click.stop="
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
          v-if="btns.active === 0"
          :placeholder="t('请输入验证码')"
          v-model="query.verificationCode"
          @onGetCode="getCode"
        >
          <template v-slot:getCode>{{ codeMsg }}</template>
        </InputGroup>
        <InputGroup
          v-else
          type="password"
          :placeholder="t('请输入密码')"
          v-model="query.password"
        ></InputGroup>
      </div>
      <!-- 忘记密码 -->
      <div
        class="forgetPassword"
        @click="goTo('/ForgetPassword')"
        v-if="btns.active !== 0"
      >
        {{ t('忘记密码') }}?
      </div>
      <!-- button -->
      <div class="button" @click="login" :class="{ isPwd: btns.active !== 0 }">
        {{ t('登录') }}
      </div>
      <!-- info -->
      <div class="info">{{ t('未注册请使用验证码登录') }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  Ref,
} from 'vue';
export default defineComponent({
  name: 'login',
});
</script>
<script setup lang="ts">
import logo from '@/assets/logo.svg';
import { ILoginBtnItem, ILoginBtns } from '../../types/login';
import InputGroup from '@/components/InputGroup/index.vue';
import code from '@/config/code.json';
import { useI18n } from 'vue-i18n';
import { Store, useStore } from 'vuex';
import { initStore, key } from '@/store';
import { getLang, getStorage, md5, setStorage } from '@/utils/utils';
import Iconfont from '@/iconfont/index.vue';
import { Toast } from '@/plugin/Toast/index';
import { Toast as Toast1 } from '@/plugin/Toast1/index';
import { hideLoading, showLoading } from '@/plugin/Loading/index';
import { useGoTo } from '@/hooks';
import { useRouter } from 'vue-router';
import { saveData } from '@/api/app';
import { initRonyun } from '@/App.vue';
import { getRoam, mergeData } from '../../hooks/window';

const { t } = useI18n();
const store = useStore(key);

const goTo = useGoTo(useRouter);

// 导航按钮
const btns = reactive<ILoginBtns>({
  list: [
    { id: 0, name: t('验证码登录') },
    { id: 1, name: t('密码登录') },
  ],
  active: 0,
});
function changeBtnActive(item: ILoginBtnItem) {
  btns.active = item.id;
}

// 参数
const query = reactive({
  phone: '',
  verificationCode: '',
  userName: '',
  password: '',
});

type TQuery = typeof query;

// 验证码文案
let codeMsg = ref(t('获取验证码'));
let time = ref(60);

// 区号
const areaCode = ref(86);
const langList = ['zh', 'tw', 'en'];
const langKey = store.state.lang === -1 ? getLang() : store.state.lang;
const lang = langList[langKey];
const list = reactive(code);
// 区号弹框
const showBox = ref(false);

// 点击获取验证码
const getCode = useGetCode(store, codeMsg, query, areaCode, time, t);
// 获取验证码
function useGetCode(
  store: Store<initStore>,
  codeMsg: Ref<string>,
  query: TQuery,
  areaCode: Ref<number>,
  time: Ref<number>,
  t: any,
) {
  return async () => {
    if (!query.phone) {
      return Toast(t('请输入手机号'));
    }
    if (codeMsg.value === t('获取验证码')) {
      showLoading();
      const res = {
        phone: '+' + areaCode.value + query.phone,
        type: 1,
      };
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 1001,
        encryption: 'Aoelailiao.Login.GetAuthCodeReq',
      });
      if (data.body.resultCode === 0) {
        codeMsg.value = time.value + 's';
        timeout(time, codeMsg);
      }
      return Toast(t(data.body.resultString));
    }
  };
}
// timeout
const timeout = (time: Ref<number>, codeMsg: Ref<string>) => {
  setTimeout(() => {
    if (time.value > 0) {
      timeout(time, codeMsg);
      time.value--;
      codeMsg.value = time.value + 's';
    } else {
      codeMsg.value = t('获取验证码');
      time.value = 60;
    }
  }, 1000);
};

// 登录
const login = useLogin(goTo, store, query, areaCode, t);

// 登录
function useLogin(
  goTo: (e: string) => void,
  store: Store<initStore>,
  query: any,
  areaCode: Ref<number>,
  t: (key: string) => string,
) {
  return async () => {
    const language = getStorage('language') || 0;
    if (btns.active === 1) {
      if (!query.phone) {
        return Toast(t('请输入手机号'));
      }
      if (!query.password) {
        return Toast(t('请输入密码'));
      }
      // 密码登录
      showLoading();
      const res = {
        loginInfo: {
          loginType: 0,
          loginId: '+' + areaCode.value + query.phone,
          loginPasswdToken: md5(query.password),
        },
        clientLanguageType: language,
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
      useLoginCb(data, goTo, areaCode, query, store, t);
    } else {
      // 验证码登录
      if (!query.phone) {
        return Toast(t('请输入手机号'));
      }
      if (!query.verificationCode) {
        return Toast(t('请输入验证码'));
      }

      showLoading();

      const res = {
        loginInfo: {
          loginType: 5,
          loginId: '+' + areaCode.value + query.phone,
          loginPasswdToken: query.verificationCode,
        },
        clientLanguageType: language,
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
      useLoginCb(data, goTo, areaCode, query, store, t);
    }
  };
}

async function useLoginCb(
  data: any,
  goTo: (e: string) => void,
  areaCode: Ref<number>,
  query: any,
  store: Store<initStore>,
  t: (key: string) => string,
) {
  // 手机号码未注册 跳转到 注册页面
  if (data.body.resultCode === 1201) {
    hideLoading();
    return goTo({
      path: '/Register',
      query: {
        loginId: '+' + areaCode.value + query.phone,
        loginPasswdToken: query.verificationCode,
      },
    });
  }
  if (data.body.resultCode === 0) {
    // showLoading(t('获取取数据中'));
    Toast1(t('登录成功正在获取数据'));
    // 设置切换账号
    const userList = JSON.parse(getStorage('userList')) || {};
    // 保存数据到本地
    saveData(data, store);

    // 刷新本地保存的用户列表token
    if (userList[data.body.userInfo.uid]) {
      const userLoginToken = data.body.userLoginToken;
      const obj = {
        byteLength: userLoginToken.byteLength,
        byteOffset: userLoginToken.byteOffset,
        uint8Array: userLoginToken.toString(),
        buffer: new Uint8Array(userLoginToken.buffer).toString(),
      };
      userList[data.body.userInfo.uid].token = JSON.stringify(obj);
      setStorage('userList', JSON.stringify(userList));
    }
    store.dispatch('init');
    try {
      // 初始化融云
      await initRonyun(store);
    } catch (error) {
      console.log(error);
    }
    // 获取漫游数据合并数据
    const roamList = await getRoam(store);
    await mergeData([], store, roamList);
    hideLoading();
    return goTo('/Home/Message');
  }
  return Toast(t(data.body.resultString));
}

const bodyClickCb = () => {
  showBox.value = false;
};

onMounted(() => {
  document.body.addEventListener('click', bodyClickCb);
});
onUnmounted(() => {
  document.body.removeEventListener('click', bodyClickCb);
});
</script>
<style lang="scss" scoped>
.login {
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
      margin-bottom: 25px;
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
