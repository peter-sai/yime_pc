import { createApp } from 'vue';
import dialog from './index.vue';
import store from '@/store';
import router from '@/router/index.ts';
import i18n from '@/lang/index.ts';

let app = null;
const ShowVideo = (props) => {
  const option = {
    ...props,
    destroy: () => {
      app.unmount();
    },
  };
  app = createApp(dialog, option);
  app.use(store);
  app.use(router);
  app.use(i18n);
  app.mount('#use');
};

const HideVideo = () => {
  app.unmount();
};

export { ShowVideo, HideVideo };
