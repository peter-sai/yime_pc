import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store';
import './style/reset.css';
import VueI18n from '@/lang';
import './router/permission';

document.documentElement.style.fontSize = '16px';

createApp(App).use(store, key).use(router).use(VueI18n).mount('#app');
