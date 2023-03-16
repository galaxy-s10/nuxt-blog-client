import axios from 'axios';
import { isBrowser } from 'billd-utils';
import { Message } from 'element-ui';

import { Api } from '@/api';
import { ERROR_HTTP_CODE } from '@/constant';

export default function ({ $axios, store }, inject) {
  let baseURL = '/';
  let env = 'prod'; // prod,beta,dev

  if (process.env.NODE_ENV === 'development') {
    env = 'beta';
  } else if (process.env.NODE_ENV === 'production') {
    env = 'prod';
  } else {
    env = 'beta';
  }

  switch (env) {
    case 'prod':
      baseURL = `https://api.hsslive.cn/prodapi/`; // 调用线上的接口
      break;
    case 'dev':
      if (isBrowser()) {
        baseURL = '/api/'; // 客户端运行的时候，调用本地的/api，让其代理到实际的url
      } else {
        baseURL = 'http://localhost:3300'; // 服务端运行的时候直接代理到实际的url
      }
      break;
    case 'beta':
      baseURL = `https://api.hsslive.cn/betaapi/`; // 调用线上的接口
      break;
  }

  const service = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true, // 允许跨域携带cookie信息
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
        const errdata = error.response.data;
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
            message: errdata.message,
            type: 'error',
          });
        }
        if (error.response.status === 401) {
          Message({
            message: errdata.message,
            type: 'error',
          });
          store.commit('user/logout');
        }
        if (error.response.status === 403) {
          Message({
            message: errdata.message,
            type: 'error',
          });
        }
        if (
          errdata.errorCode === ERROR_HTTP_CODE.banIp ||
          errdata.errorCode === ERROR_HTTP_CODE.adminDisableUser
        ) {
          store.commit('app/setApiError', errdata);
        }
        return Promise.reject(errdata);
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
  // inject('myaxios', axios);
  inject('myaxios', new Api(service));
}
