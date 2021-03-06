import { createApp } from 'vue';
import dialogApp from './index.vue';
import store from '@/store';
import router from '@/router/index';
import i18n from '@/lang/index';

let app: any = null;
const Dialog = (props: { title: string; callBack: () => Promise<void>; btnClass?: string[];}) => {
  const option = {
    ...props,
    destroy: () => {
      app && app.unmount();
    },
  };
  app = createApp(dialogApp, option);
  app.use(store);
  app.use(router);
  app.use(i18n);
  app.mount('#use');
};

const hidePush = () => {
  app && app.unmount();
};

export { Dialog, hidePush };
