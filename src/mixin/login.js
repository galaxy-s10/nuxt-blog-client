import { isMobile, hrefToTarget } from 'billd-utils';

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
      const url = (state) =>
        `${QQ_OAUTH_URL}client_id=${QQ_CLIENT_ID}&redirect_uri=${REDIRECT_URI}qq_login&scope=get_user_info,get_vip_info,get_vip_rich_info&state=${state}`;
      if (isMobile()) {
        const loginEnv = 'qqMobile';
        setLoginEnv(loginEnv);
        const res = url(window.btoa(JSON.stringify({ code: 200, loginEnv })));
        hrefToTarget(res);
      } else {
        const res = url(
          window.btoa(JSON.stringify({ code: 200, loginEnv: 'qqPc' }))
        );
        window.open(
          res,
          'qq_login_window',
          'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
        );
      }
    },
    githubLogin() {
      const url = (state) =>
        `${GITHUB_OAUTH_URL}client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}github_login&scope=user&state=${state}`;
      if (isMobile()) {
        const loginEnv = 'githubMobile';
        setLoginEnv(loginEnv);
        const res = url(window.btoa(JSON.stringify({ code: 200, loginEnv })));
        hrefToTarget(res);
      } else {
        const res = url(
          window.btoa(JSON.stringify({ code: 200, loginEnv: 'githubPc' }))
        );
        window.open(
          res,
          'github_login_window',
          'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
        );
      }
    },
  },
};
