import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store';
import './style/reset.css';
import VueI18n from '@/lang';
import './router/permission';
window.onerror = (e) => {
  console.log(e);
};

document.documentElement.style.fontSize = '16px';

const app = createApp(App).use(store, key).use(router).use(VueI18n);
app.config.warnHandler = function (msg, vm, trace) {
  // `trace` 是组件的继承关系追踪
  console.log(msg);
  return true;
};
app.mount('#app');
