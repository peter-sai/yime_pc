import axios from 'axios';

const request = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? '' : 'http://18.166.162.101:3000',
  // baseURL: process.env.NODE_ENV === 'development' ? '' : 'https://web.yime.app',
  timeout: 20000,
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default request;
