//语言
import { createI18n } from 'vue-i18n'; //引入vue-i18n组件
import zh from './zh';
import en from './en';
import zhHant from './zh-Hant';
import { getStorage } from '@/utils/utils';

const key =
  Number(getStorage('lang') || -1) === -1
    ? getLang()
    : Number(getStorage('lang'));

const def = key;
const language = ['zh', 'zhHant', 'en'];

//注册i8n实例并引入语言文件
const i18n = createI18n({
  locale: language[def], //默认显示的语言
  messages: {
    zh: zh, //引入语言文件
    zhHant: zhHant,
    en: en,
  },
});

function getLang() {
  const lang = window.navigator.language;
  const langToLower = lang.toLocaleLowerCase();
  if (langToLower.includes('en')) {
    return 2;
  } else if (langToLower.includes('tw') || langToLower.includes('zh-tw')) {
    return 1;
  } else if (langToLower.includes('zh') || langToLower.includes('zh-cn')) {
    return 0;
  } else {
    return 2;
  }
}

export default i18n; //将i18n暴露出去，在main.js中引入挂载
