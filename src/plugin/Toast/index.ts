import { createApp } from 'vue';
import toastIndex from './index.vue';
import store from '../../store';

const Toast = (msg: string, time = 2000) => {
  let app: any = null;
  const option = {
    title: msg,
    time,
    destroy: () => {
      app && app.unmount();
    },
  };
  app = createApp(toastIndex, option);
  app.use(store);
  app.mount('#use');
};

export { Toast };
