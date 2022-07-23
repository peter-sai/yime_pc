<template>
  <div class="login">
    <!-- logo -->
    <div class="logo">
      <img :src="logo" alt="" srcset="" />
    </div>
    <!-- main -->
    <div class="main">
      <!-- button -->
      <div class="nav" v-if="btns.active !== 2">
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
        <InputGroup
          v-if="btns.active === 0 || btns.active === 2"
          :placeholder="t('请输入手机号')"
          v-model="query.phone"
        >
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
          v-if="btns.active === 1"
          :placeholder="t('请输入IM号')"
          v-model="query.im"
        ></InputGroup>
        <InputGroup
          v-if="btns.active === 2"
          :placeholder="t('请输入验证码')"
          v-model="query.verificationCode"
          @onGetCode="getCode"
        >
          <template v-slot:getCode>{{ codeMsg }}</template>
        </InputGroup>
        <InputGroup
          v-if="btns.active === 0"
          type="password"
          :placeholder="t('请输入密码')"
          v-model="query.password"
        ></InputGroup>
        <InputGroup
          v-if="btns.active === 1"
          type="password"
          :placeholder="t('请输入密码')"
          v-model="query.imPassword"
        ></InputGroup>
      </div>
      <div
        style="
          justify-content: space-between;
          display: flex;
          align-items: center;
        "
      >
        <!-- 记住密码 -->
        <div
          style="display: flex; align-items: center; margin-top: 20px"
          @click="changeRememberPwd"
          v-if="btns.active !== 2"
        >
          <Iconfont
            v-if="rememberPwd"
            name="icondanxuankuang"
            color="#0085FF"
            size="17"
          />
          <Iconfont v-else name="iconradio" color="#666" size="17" />
          <div class="rememberPwd">
            {{ t('记住密码') }}
          </div>
        </div>
        <div
          class="forgetPassword"
          @click="goTo('/ForgetPassword')"
          v-if="btns.active !== 2"
        >
          {{ t('忘记密码') }}?
        </div>
      </div>
      <!-- button -->
      <div class="button" @click="login" :class="{ isPwd: btns.active !== 0 }">
        {{ t('登录') }}
      </div>
      <div v-if="btns.active === 2" class="info" @click="btns.active = 0">
        {{ t('密码登录') }}
      </div>
      <div v-else class="info" @click="btns.active = 2">
        {{ t('验证码登录') }}
      </div>
      <!-- info -->
      <!-- <div class="info">{{ t("未注册请使用验证码登录") }}</div> -->
    </div>
    <Teleport to="body" v-if="showAuth">
      <div class="verificationBox">
        <div class="box"></div>
        <div class="verification">
          <i class="close" @click="closeAuth"></i>
          <div class="title">{{ t('安全验证') }}</div>
          <div class="content">
            <div class="info">
              {{ t('为了您的账号安全，请在已登录设备上确认本次登录操作') }}
            </div>
            <div class="time">{{ authTimeMsg }}</div>
            <div class="subInfo">{{ t('倒计时结束将取消登录') }}</div>
          </div>
          <div class="btn">
            <div @click="cancelLogin">
              {{ t('取消登录') }}
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <Teleport to="body" v-if="isShowSmsAuth">
      <div class="verificationBox">
        <div class="box"></div>
        <div class="smsVerification">
          <i class="close" @click="isShowSmsAuth = false"></i>
          <div class="title">{{ t('安全验证') }}</div>
          <div class="content">为了您的账号安全，请使用短信验证码登录</div>
          <div class="btn">
            <div
              @click="
                btns.active = 2;
                isShowSmsAuth = false;
              "
            >
              {{ t('短信验证码登录') }}
            </div>
            <div @click="isShowSmsAuth = false">{{ t('取消登录') }}</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  Ref,
  watch,
  watchEffect,
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
import returnCitySN from 'returnCitySN';

// 记住密码
const rememberPwd = ref(false);
const changeRememberPwd = () => {
  rememberPwd.value = !rememberPwd.value;
};

const isShowSmsAuth = ref(false);

const { t } = useI18n();
const store = useStore(key);

const goTo = useGoTo(useRouter);

// 导航按钮
const btns = reactive<ILoginBtns>({
  list: [
    { id: 0, name: t('手机登陆') },
    { id: 1, name: t('IM登录') },
  ],
  active: 0,
});
function changeBtnActive(item: ILoginBtnItem) {
  btns.active = item.id;
}

let rememberPwdInfo = {
  im: '',
  password: '',
  imPassword: '',
  phone: '',
};
try {
  const remember = getStorage('rememberPwd');
  if (remember) {
    rememberPwdInfo = JSON.parse(remember);
    rememberPwd.value = true;
  }
} catch (error) {
  //
}

// 参数
const query = reactive({
  phone: rememberPwdInfo?.phone || '',
  verificationCode: '',
  im: rememberPwdInfo?.im || '',
  imPassword: rememberPwdInfo?.imPassword || '',
  userName: '',
  password: rememberPwdInfo?.password || '',
});

type TQuery = typeof query;

// 验证码文案
let codeMsg = ref(t('获取验证码'));
let codeTime = ref(60);

// 区号
const areaCode = ref(86);
const langList = ['zh', 'tw', 'en'];
const langKey = store.state.lang === -1 ? getLang() : store.state.lang;
const lang = langList[langKey];
const list = reactive(code);
// 区号弹框
const showBox = ref(false);

// 点击登录之后启动验证倒计时
const authTimeMsg = ref('60s');
const authTime = ref(60);
const showAuth = ref(false);
const closeAuth = () => {
  showAuth.value = false;
};

// 点击获取验证码
const getCode = useGetCode(store, codeMsg, query, areaCode, codeTime, t);
// 获取验证码
function useGetCode(
  store: Store<initStore>,
  codeMsg: Ref<string>,
  query: TQuery,
  areaCode: Ref<number>,
  codeTime: Ref<number>,
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
        type: 1,
      };
      const data = await store.dispatch('postMsg', {
        query: res,
        cmd: 1001,
        encryption: 'Aoelailiao.Login.GetAuthCodeReq',
      });
      if (data.body.resultCode === 0) {
        codeMsg.value = codeTime.value + 's';
        timeout(codeTime, codeMsg, t('获取验证码'));
      }
      return Toast(t(data.body.resultString));
    }
  };
}
// timeout
const timeout = (time: Ref<number>, codeMsg: Ref<string>, info: string) => {
  setTimeout(() => {
    if (time.value > 0 && (showAuth.value || info === t('获取验证码'))) {
      timeout(time, codeMsg, info);
      time.value--;
      codeMsg.value = time.value + 's';
    } else {
      codeMsg.value = info;
      time.value = 60;
    }
  }, 1000);
};

watchEffect(() => {
  if (authTime.value <= 1) {
    cancelLogin();
  }
});

// 登录
const login = useLogin(goTo, store, query, areaCode, t);

// const map = {
//   0 允许登录,
//   1 拒绝登录,
//   2 超时,
//   3 出现错误,
//   4 需要短信验证
//   5 需要等待审核 (如果收到这个推送, 需要等待下一个推送返回最终结果)
//   6 无需审核, 直接登录
// }
const map = [
  '允许登录',
  '登录已撤销，为了账号安全，请尽快修改密码',
  // '拒绝登录',
  '超时',
  '出现错误',
  '需要短信验证',
  '需要等待审核',
  '无需审核',
];

watch(
  computed(() => store.state.msgInfo),
  async (data: any) => {
    if (data.cmd == 2183) {
      if (data.body.result !== 5) {
        showAuth.value = false;
        if (data.body?.result === 4) {
          isShowSmsAuth.value = true;
        } else {
          Toast(t(map[data.body.result]));
        }
      } else {
        showAuth.value = true;
      }
      if (data.body.result === 0 || data.body.result === 6) {
        const language = getStorage('language') || 0;
        showLoading();
        if (btns.active === 0) {
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
              devicePublicIp: returnCitySN.cip || '',
              deviceUuid: store.state.deviceUuid
            },
          };
          const data = await store.dispatch('postMsg', {
            query: res,
            cmd: 1005,
            encryption: 'Aoelailiao.Login.LoginReq',
          });
          useLoginCb(data, goTo, areaCode, query, store, t);
        } else if (btns.active === 2) {
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
              devicePublicIp: returnCitySN.cip || '',
              deviceUuid: store.state.deviceUuid
            },
          };
          const data = await store.dispatch('postMsg', {
            query: res,
            cmd: 1005,
            encryption: 'Aoelailiao.Login.LoginReq',
          });
          useLoginCb(data, goTo, areaCode, query, store, t);
        } else {
          const res = {
            loginInfo: {
              loginType: 9,
              loginId: query.im,
              loginPasswdToken: md5(query.imPassword),
            },
            clientLanguageType: language,
            equipmentInformation: {
              deviceBrand: 'web',
              releaseVersion: '2.0.0',
              devicePublicIp: returnCitySN.cip || '',
              deviceUuid: store.state.deviceUuid
            },
          };
          const data = await store.dispatch('postMsg', {
            query: res,
            cmd: 1005,
            encryption: 'Aoelailiao.Login.LoginReq',
          });
          useLoginCb(data, goTo, areaCode, query, store, t);
        }
      }
    }
  }
);

// 取消登录
const cancelLogin = async () => {
  const data = await store.dispatch('postMsg', {
    query: {},
    cmd: 2187,
    encryption: 'Aoelailiao.Login.CancelLoginAskReq',
  });
  if (data.body.resultCode !== 0) {
    return Toast(t(data.body.resultString));
  } else {
    showAuth.value = false;
  }
};

// 登录
function useLogin(
  goTo: (e: string) => void,
  store: Store<initStore>,
  query: any,
  areaCode: Ref<number>,
  t: (key: string) => string
) {
  return async () => {
    timeout(authTime, authTimeMsg, t('60s'));
    // showAuth.value = true;
    const language = getStorage('language') || 0;
    if (btns.active === 0) {
      if (!query.phone) {
        return Toast(t('请输入手机号'));
      }
      if (!query.password) {
        return Toast(t('请输入密码'));
      }

      if (rememberPwd.value) {
        const obj = {
          phone: query.phone,
          password: query.password,
        };
        setStorage('rememberPwd', JSON.stringify(obj));
      } else {
        setStorage('rememberPwd', undefined);
      }

      // 先调用2181 请求授权
      const authData = await store.dispatch('postMsg', {
        query: {
          account: '+' + areaCode.value + query.phone,
          loginType: 0,
          password: md5(query.password),
          equipmentInformation: {
            deviceBrand: 'web',
            releaseVersion: '2.0.0',
            devicePublicIp: returnCitySN.cip || '',
            deviceUuid: store.state.deviceUuid
          },
        },
        cmd: 2181,
        encryption: 'Aoelailiao.Login.BeforeLoginReq',
      });
      if (authData.body.resultCode !== 0) {
        showAuth.value = false;
        return Toast(t(authData.body.resultString));
      }

      // 密码登录
      // showLoading();
      // const res = {
      //   loginInfo: {
      //     loginType: 0,
      //     loginId: '+' + areaCode.value + query.phone,
      //     loginPasswdToken: md5(query.password),
      //   },
      //   clientLanguageType: language,
      //   equipmentInformation: {
      //     deviceBrand: 'web',
      //     releaseVersion: '2.0.0',
      //     devicePublicIp: returnCitySN.cip || '',
      //   },
      // };
      // const data = await store.dispatch('postMsg', {
      //   query: res,
      //   cmd: 1005,
      //   encryption: 'Aoelailiao.Login.LoginReq',
      // });
      // useLoginCb(data, goTo, areaCode, query, store, t);
    } else if (btns.active === 2) {
      // 验证码登录
      if (!query.phone) {
        return Toast(t('请输入手机号'));
      }
      if (!query.verificationCode) {
        return Toast(t('请输入验证码'));
      }

      // 先调用2181 请求授权
      const authData = await store.dispatch('postMsg', {
        query: {
          account: '+' + areaCode.value + query.phone,
          loginType: 5,
          equipmentInformation: {
            deviceBrand: 'web',
            releaseVersion: '2.0.0',
            devicePublicIp: returnCitySN.cip || '',
            deviceUuid: store.state.deviceUuid
          },
        },
        cmd: 2181,
        encryption: 'Aoelailiao.Login.BeforeLoginReq',
      });
      if (authData.body.resultCode !== 0) {
        showAuth.value = false;
        return Toast(t(authData.body.resultString));
      }

      // showLoading();
      // const res = {
      //   loginInfo: {
      //     loginType: 5,
      //     loginId: '+' + areaCode.value + query.phone,
      //     loginPasswdToken: query.verificationCode,
      //   },
      //   clientLanguageType: language,
      //   equipmentInformation: {
      //     deviceBrand: 'web',
      //     releaseVersion: '2.0.0',
      //     devicePublicIp: returnCitySN.cip || '',
      //   },
      // };
      // const data = await store.dispatch('postMsg', {
      //   query: res,
      //   cmd: 1005,
      //   encryption: 'Aoelailiao.Login.LoginReq',
      // });
      // useLoginCb(data, goTo, areaCode, query, store, t);
    } else {
      // IM登录
      if (!query.im) {
        return Toast(t('请输入IM号'));
      }
      if (!query.imPassword) {
        return Toast(t('请输入密码'));
      }
      if (rememberPwd.value) {
        const obj = {
          im: query.im,
          imPassword: query.imPassword,
        };
        setStorage('rememberPwd', JSON.stringify(obj));
      } else {
        setStorage('rememberPwd', undefined);
      }

      // 先调用2181 请求授权
      const authData = await store.dispatch('postMsg', {
        query: {
          account: query.im,
          loginType: 9,
          password: md5(query.imPassword),
          equipmentInformation: {
            deviceBrand: 'web',
            releaseVersion: '2.0.0',
            devicePublicIp: returnCitySN.cip || '',
            deviceUuid: store.state.deviceUuid
          },
        },
        cmd: 2181,
        encryption: 'Aoelailiao.Login.BeforeLoginReq',
      });
      if (authData.body.resultCode !== 0) {
        showAuth.value = false;
        return Toast(t(authData.body.resultString));
      }

      // showLoading();
      // const res = {
      //   loginInfo: {
      //     loginType: 9,
      //     loginId: query.im,
      //     loginPasswdToken: md5(query.imPassword),
      //   },
      //   clientLanguageType: language,
      //   equipmentInformation: {
      //     deviceBrand: 'web',
      //     releaseVersion: '2.0.0',
      //     devicePublicIp: returnCitySN.cip || '',
      //   },
      // };
      // const data = await store.dispatch('postMsg', {
      //   query: res,
      //   cmd: 1005,
      //   encryption: 'Aoelailiao.Login.LoginReq',
      // });
      // useLoginCb(data, goTo, areaCode, query, store, t);
    }
  };
}

async function useLoginCb(
  data: any,
  goTo: (e: string) => void,
  areaCode: Ref<number>,
  query: any,
  store: Store<initStore>,
  t: (key: string) => string
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
    .rememberPwd {
      color: #999999;
      font-size: 14px;
      cursor: pointer;
      margin-left: 5px;
      flex: 1;
    }
    .forgetPassword {
      color: #0085ff;
      font-size: 14px;
      margin-top: 20px;
      cursor: pointer;
      text-align: right;
      flex: 1;
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
.verificationBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  .box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #000000;
    opacity: 0.76;
  }
  .close {
    position: absolute;
    cursor: pointer;
    right: 20px;
    top: 20px;
    width: 10px;
    height: 10px;
    &::after {
      display: block;
      position: absolute;
      content: '';
      width: 100%;
      height: 2px;
      left: 50%;
      top: 50%;
      background: #000000;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::before {
      display: block;
      position: absolute;
      content: '';
      width: 100%;
      height: 2px;
      left: 50%;
      top: 50%;
      background: #000000;
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
  .title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
    margin-top: 32px;
  }
  .verification {
    width: 310px;
    height: 256px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    right: 50%;
    top: 50%;
    bottom: 50%;
    transform: translate(-50%, -50%);

    .content {
      margin: 15px 0 20px;
      padding: 0 16px;
      .time {
        font-size: 18px;
        font-weight: 400;
        color: #fa5151;
        line-height: 22px;
        text-align: center;
        margin-top: 17px;
      }
      .info {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
      }
      .subInfo {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        text-align: center;
        line-height: 22px;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      div {
        width: 222px;
        height: 32px;
        background: #fafafa;
        border: 1px solid #dddddd;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
  .smsVerification {
    width: 310px;
    height: 200px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    right: 50%;
    top: 50%;
    bottom: 50%;
    transform: translate(-50%, -50%);
    .content {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
      text-align: center;
      max-width: 70%;
      margin: 20px auto;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      div {
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
        width: 120px;
        height: 32px;
        background: #0085ff;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
        &:last-child {
          background: transparent;
          color: #666666;
          border: 1px solid #dddddd;
        }
      }
    }
  }
}
</style>
