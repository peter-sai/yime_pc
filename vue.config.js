module.exports = {
  // 这个值也可以被设置为相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。
  publicPath: './',
  // 输出文件目录
  outputDir: 'build/vue-build',
  productionSourceMap: false,
  devServer: {
    port: 8000,
    // https: true,
    // proxy: 'http://18.167.158.191:3000',
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 目标地址
        ws: true, // 是否代理websockets
        changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL
        pathRewrite: {
          '^/api': '/api',
        },
      },
      '/group1': {
        target: 'https://www.momo886.com', // 目标地址
        ws: true, // 是否代理websockets
        changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL
        pathRewrite: {
          '^/group1': '/group1',
        },
      },
      '/getConfig30300.json': {
        target: 'https://api.yimechat.com', // 目标地址
        ws: true, // 是否代理websockets
        changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL
        pathRewrite: {
          '^/getConfig30300.json': '/getConfig30300.json',
        },
      },
    },
  },
  configureWebpack: {
    externals: {
      Recorder: 'Recorder',
      ClipboardItem: 'ClipboardItem',
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
