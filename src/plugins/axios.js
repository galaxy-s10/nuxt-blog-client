import axios from 'axios';
import { Message } from 'element-ui';

import { isBrowser } from '@/utils';
export default function ({ $axios, store }, inject) {
  // const axios = $axios
  let baseURL = '/';
  if (process.env.NODE_ENV === 'development') {
    baseURL = !isBrowser() ? 'http://localhost:3300' : '/api/';
  } else {
    baseURL = !isBrowser() ? 'http://localhost:3200' : '/prodapi/';
  }
  const service = axios.create({
    baseURL,
    timeout: 5000,
  });

  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      const token = store.state.user.token;
      if (store.state.user.token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  // 响应拦截
  service.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (error.response && error.response.status) {
        const whiteList = ['400', '401', '403']; // 这三个状态码是后端会返回的
        if (!whiteList.includes(`${error.response.status}`)) {
          // 网关超时504
          Message({
            message: error.message,
            type: 'error',
          });
          return Promise.reject(error);
        }
        if (error.response.status === 400) {
          // 400错误不返回data
          Message({
            message: error.response.data.message,
            type: 'error',
          });
          return Promise.reject(error.response.data);
        }
        if (error.response.status === 401) {
          Message({
            message: error.response.data.message,
            type: 'error',
          });
          store.commit('user/logout');
          return Promise.reject(error.response.data);
        }
        if (error.response.status === 403) {
          Message({
            message: error.response.data.message,
            type: 'error',
          });
          return Promise.reject(error.response.data);
        }
      } else {
        if (error.response) {
          Message({
            message: error.response.message,
            type: 'error',
          });
          return Promise.reject(error.response);
        }
        Message({
          message: error.message,
          type: 'error',
        });
        return Promise.reject(error);
      }
    }
  );
  inject('myaxios', service);
}
