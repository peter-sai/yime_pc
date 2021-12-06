import request from '../config/axios';

// 获取配置信息
export const getConfig = () => {
  return request({
    url: '/getConfig.json',
    method: 'get',
  });
};

// 获取阿里云存储信息
export const getOssInfo = () => {
  return request({
    url: '/api/upLoadInfo',
    method: 'get',
  });
};

// 获取token
export const getToken = (params: any) => {
  return request({
    url: '/api/getToken',
    method: 'get',
    params,
  });
};
