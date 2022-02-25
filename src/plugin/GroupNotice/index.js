import { createApp } from 'vue';
import groupNotic from './index.vue';
import store from '../../store';
import router from '../../router/index.ts';
import i18n from '@/lang/index.ts';

let app = null;
const GroupNotic = (props) => {
  const option = {
    ...props,
    destroy: () => {
      app && app.unmount();
    },
  };
  app = createApp(groupNotic, option);
  app.use(i18n);
  app.use(store);
  app.use(router);
  app.mount('#use');
};

const hideGroupNotic = () => {
  app && app.unmount();
};

export { GroupNotic, hideGroupNotic };
