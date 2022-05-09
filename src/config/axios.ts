import axios from 'axios';
import config from '../config';

const request = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : config.HOST,
  // baseURL: process.env.NODE_ENV === 'development' ? '' : 'https://web.yime.app',
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
