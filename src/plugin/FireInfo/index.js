import { createApp } from 'vue';
import fireInfo from './index.vue';
import store from '../../store';
import router from '../../router/index.ts';
import i18n from '@/lang/index.ts';

let app = null;
const FireInfo = (props = {}, time = 3000) => {
  const query = {
    ...props,
    destroy: () => {
      app.unmount();
    },
  };
  app = createApp(fireInfo, query);
  app.use(store);
  app.use(i18n);
  app.use(router);
  app.mount('#use');
};

const hideFireInfo = () => {
  app.unmount();
};

export { FireInfo, hideFireInfo };
