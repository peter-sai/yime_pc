module.exports = {
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    // https: true,
    // proxy: 'http://18.167.158.191:3000',
    proxy: 'http://localhost:3000',
    port: 8080,
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
