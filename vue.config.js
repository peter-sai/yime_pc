module.exports = {
  // 这个值也可以被设置为相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。
  publicPath: './',
  // 输出文件目录
  outputDir: 'build/vue-build',
  devServer: {
    port: 8000,
    // https: true,
    // proxy: 'http://18.167.158.191:3000',
    proxy: 'http://localhost:3000',
  },
  configureWebpack: {
    externals: {
      Recorder: 'Recorder',
    },
  },
  chainWebpack: (config) => {
    //设置标题  默认不设置的话是项目名字
    config.plugin('html').tap((args) => {
      args[0].title = 'YIME';
      return args;
    });
  },
};
