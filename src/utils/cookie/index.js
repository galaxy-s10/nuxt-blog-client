import cookies from 'js-cookie';

import { cookieKey } from '@/constant';

export const getLoginEnv = () => {
  return cookies.get(cookieKey.loginEnv);
};

export const setLoginEnv = (val) => {
  cookies.set(cookieKey.loginEnv, val, {
    domain: process.env.NODE_ENV === 'development' ? undefined : '.hsslive.cn',
  });
};

export const clearLoginEnv = () => {
  cookies.remove(cookieKey.loginEnv);
};
