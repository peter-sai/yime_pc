import { createApp } from 'vue';
import toastIndex from './index.vue';

let time: any = null;
const loading = () => {
  let app: any = null;
  const showLoading = (msg?: string) => {
    hideLoading();
    app = createApp(toastIndex, { title: msg });
    app.mount('#use');
    time = setTimeout(() => {
      hideLoading();
    }, 8000);
  };

  const hideLoading = () => {
    app && app.unmount();
    if (time) {
      clearTimeout(time);
      time = null;
    }
  };
  return { showLoading, hideLoading };
};

const { showLoading, hideLoading } = loading();

export { showLoading, hideLoading };
