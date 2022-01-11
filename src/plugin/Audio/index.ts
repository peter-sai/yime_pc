import { createApp } from 'vue';
import dialogApp from './index.vue';
import store from '@/store';
import router from '@/router/index';
import i18n from '@/lang/index';

let app: any = null;
const MediaAudio = (props: any) => {
  const option = {
    ...props,
    destroy: () => {
      app.unmount();
    },
  };
  app = createApp(dialogApp, option);
  app.use(store);
  app.use(router);
  app.use(i18n);
  app.mount('#media');
};

const hidePush = () => {
  app.unmount();
};

export { MediaAudio, hidePush };
