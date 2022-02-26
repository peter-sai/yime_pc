import { createApp } from 'vue';
import toastIndex from './index.vue';

const loading = () => {
  let app: any = null;
  const showLoading = (msg?: string) => {
    app = createApp(toastIndex, { title: msg });
    app.mount('#use');
  };

  const hideLoading = () => {
    app && app.unmount();
  };
  return { showLoading, hideLoading };
};

const { showLoading, hideLoading } = loading();

export { showLoading, hideLoading };
