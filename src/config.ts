export interface IConfigItem {
  VUE_APP_BASEURL: string;
  ELECTRON_NAME: string;
  NODE_ENV: string;
  HOST: string;
}

export interface IConfig {
  dev: IConfigItem;
  yime: IConfigItem;
  duoliao: IConfigItem;
  momo: IConfigItem;
}

const config: IConfig = {
  dev: {
    VUE_APP_BASEURL: 'wss://ws-test.yime.vip',
    ELECTRON_NAME: 'YIME',
    NODE_ENV: 'development',
    HOST: 'http://16.163.55.202:3000',
  },
  yime: {
    VUE_APP_BASEURL: 'wss://ws.yime.vip',
    ELECTRON_NAME: 'YIME',
    NODE_ENV: 'production',
    HOST: 'http://16.163.55.202:3000',
  },
  duoliao: {
    VUE_APP_BASEURL: 'ws://18.167.158.191:8003',
    ELECTRON_NAME: 'DUOLIAO',
    NODE_ENV: 'production',
    HOST: 'http://18.167.158.191:3000',
  },
  momo: {
    VUE_APP_BASEURL: 'ws://ws.mm089.com',
    ELECTRON_NAME: 'MOMO',
    NODE_ENV: 'production',
    HOST: 'http://18.166.162.101:3000',
  },
};

export type TConfig = 'yime';

const item: TConfig = process.env.VUE_APP_MODE as TConfig;

export default config[item];
