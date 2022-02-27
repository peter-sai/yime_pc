import { createApp } from 'vue';
import toastIndex from './index.vue';

const loading = () => {
  let app: any = null;
  const showLoading = (msg?: string) => {
    hideLoading();
    app = createApp(toastIndex, { title: msg });
    app.mount('#use');
    setTimeout(() => {
      hideLoading();
    }, 8000);
  };

  const hideLoading = () => {
    app && app.unmount();
  };
  return { showLoading, hideLoading };
};

const { showLoading, hideLoading } = loading();

export { showLoading, hideLoading };
