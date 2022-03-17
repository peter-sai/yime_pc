import request from '../config/axios';
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

// 获取config
export const yimechat = () => {
  const host =
    process.env.NODE_ENV === 'development' ? '' : 'https://api.yimechat.com';
  return request({
    url: host + '/getConfig30300.json',
    method: 'get',
  });
};

// 获取token
export const upload = (host: string, data: any) => {
  const newHost = process.env.NODE_ENV === 'development' ? '' : host;
  return request({
    url: newHost + '/group1/upload',
    method: 'post',
    data,
  });
};
