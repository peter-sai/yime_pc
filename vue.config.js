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
        target: 'http://18.167.158.191:3000', // 目标地址
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
      args[0].title = 'DUOLIAO';
      return args;
    });
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          //win相关配置
          target: [
            {
              target: 'nsis', //利用nsis制作安装程序
              arch: [
                'x64', //64位
                'ia32', //32位
              ],
            },
          ],
        },
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: 'DUOLIAO', // 图标名称
        },
      },
    },
  },
};
