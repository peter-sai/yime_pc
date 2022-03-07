import { createApp } from 'vue';
import toastIndex from './index.vue';

const loading = () => {
  let app: any = null;
  const showImg = (msg?: string) => {
    hideImg();
    app = createApp(toastIndex, {
      src: msg,
      destroy: () => {
        app && app.unmount();
      },
    });
    app.mount('#use');
  };

  const hideImg = () => {
    app && app.unmount();
  };
  return { showImg, hideImg };
};

const { showImg, hideImg } = loading();

export { showImg, hideImg };
