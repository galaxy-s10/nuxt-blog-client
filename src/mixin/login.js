import { isMobile, hrefToTarget } from 'billd-utils';

import {
  GITHUB_CLIENT_ID,
  GITHUB_OAUTH_URL,
  QQ_CLIENT_ID,
  QQ_OAUTH_URL,
  REDIRECT_URI,
} from '@/constant';

export const loginMixin = {
  methods: {
    qqLogin() {
      const url = (state) =>
        `${QQ_OAUTH_URL}client_id=${QQ_CLIENT_ID}&redirect_uri=${REDIRECT_URI}qq_login&scope=get_user_info,get_vip_info,get_vip_rich_info&state=${state}`;
      // if (isMobile()) {
      const res = url(
        window.btoa(JSON.stringify({ code: 200, env: 'qqMobile' }))
      );
      hrefToTarget(res);
      // } else {
      //   const res = url(
      //     window.btoa(JSON.stringify({ code: 200, env: 'qqPc' }))
      //   );
      //   window.open(
      //     res,
      //     'qq_login_window',
      //     'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
      //   );
      // }
    },
    githubLogin() {
      const url = (state) =>
        `${GITHUB_OAUTH_URL}client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}github_login&scope=user&state=${state}`;
      if (isMobile()) {
        const res = url(
          window.btoa(JSON.stringify({ code: 200, env: 'githubMobile' }))
        );
        hrefToTarget(res);
      } else {
        const res = url(
          window.btoa(JSON.stringify({ code: 200, env: 'githubPc' }))
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
