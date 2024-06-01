import { hrefToTarget, isMobile } from 'billd-utils';

import {
  GITHUB_CLIENT_ID,
  GITHUB_OAUTH_URL,
  QQ_CLIENT_ID,
  QQ_OAUTH_URL,
  REDIRECT_URI,
} from '@/constant';
import { setLoginEnv } from '@/utils/cookie';

export const loginMixin = {
  methods: {
    qqLogin() {
      const isDev = process.env.NODE_ENV === 'development';
      const url = (state) =>
        `${QQ_OAUTH_URL}client_id=${QQ_CLIENT_ID}&redirect_uri=${REDIRECT_URI}qq_login&scope=get_user_info,get_vip_info,get_vip_rich_info&state=${state}`;
      let loginEnv = JSON.stringify({
        isMobile: false,
        isAdmin: false,
        env: 'qq',
        isDev,
      });
      if (isMobile()) {
        loginEnv = JSON.stringify({
          ...JSON.parse(loginEnv),
          isMobile: true,
        });
        setLoginEnv(loginEnv);
        hrefToTarget(url(window.btoa(loginEnv)));
      } else {
        setLoginEnv(loginEnv);
        window.open(
          url(window.btoa(loginEnv)),
          'qq_login_window',
          'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
        );
      }
    },
    githubLogin() {
      const isDev = process.env.NODE_ENV === 'development';
      const url = (state) =>
        `${GITHUB_OAUTH_URL}client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}github_login&scope=user&state=${state}`;
      let loginEnv = JSON.stringify({
        isMobile: false,
        isAdmin: false,
        env: 'github',
        isDev,
      });
      if (isMobile()) {
        loginEnv = JSON.stringify({
          ...JSON.parse(loginEnv),
          isMobile: true,
        });
        setLoginEnv(loginEnv);
        hrefToTarget(url(window.btoa(loginEnv)));
      } else {
        setLoginEnv(loginEnv);
        window.open(
          url(window.btoa(loginEnv)),
          'github_login_window',
          'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
        );
      }
    },
  },
};
