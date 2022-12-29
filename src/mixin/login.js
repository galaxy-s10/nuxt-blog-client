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
      const url =
        `${QQ_OAUTH_URL}client_id=${QQ_CLIENT_ID}&redirect_uri=${REDIRECT_URI}qq_login` +
        `&state=99&scope=get_user_info,get_vip_info,get_vip_rich_info`;
      window.open(
        url,
        'qq_login_window',
        'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
      );
    },
    githubLogin() {
      const url =
        `${GITHUB_OAUTH_URL}client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}github_login` +
        `&scope=user`;
      window.open(
        url,
        'github_login_window',
        'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
      );
    },
  },
};
