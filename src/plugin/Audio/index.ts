import { createApp } from 'vue';
import dialogApp from './index.vue';
import store, { key } from '@/store';
import router from '@/router/index';
import i18n from '@/lang/index';

let app: any = null;
const MediaAudio = (props: any) => {
  const option = {
    ...props,
    destroy: () => {
      app && app.unmount();
    },
  };
  app = createApp(dialogApp, option);
  app.use(store, key);
  app.use(router);
  app.use(i18n);
  app.mount('#media');
};

const hidePush = () => {
  app && app.unmount();
};

export { MediaAudio, hidePush };
