import { createApp } from 'vue';
import toastIndex from './index.vue';

const loading = () => {
  let app: any = null;
  const showImg = (
    initialSlide: number,
    imgList: { msgId: number; imageUrl: string }[],
  ) => {
    hideImg();
    console.log(initialSlide, imgList);

    app = createApp(toastIndex, {
      initialSlide,
      imgList,
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
