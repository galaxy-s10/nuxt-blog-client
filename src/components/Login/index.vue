<template>
  <div class="login-cpt-wrap">
    <el-dropdown v-if="isLogin" trigger="hover">
      <div class="el-dropdown-link">
        <a>登录</a>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <template v-if="frontendData">
          <div>
            <!-- <el-dropdown-item>
              <el-button
                type="text"
                :disabled="frontendData.frontend_register === 2"
                @click="dialogtwo = true"
              >
                注册
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                type="text"
                :disabled="frontendData.frontend_login === 2"
                @click="dialogVisible = true"
              >
                登录
              </el-button>
            </el-dropdown-item> -->
            <el-dropdown-item>
              <el-button
                type="text"
                :disabled="frontendData.frontend_qq_login === 2"
                @click="qqLogin"
              >
                QQ登录
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                type="text"
                :disabled="frontendData.frontend_github_login === 2"
                @click="githubLogin"
              >
                GitHub登录
              </el-button>
            </el-dropdown-item>
          </div>
        </template>
        <el-dropdown-item v-else>未开启</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown v-else trigger="hover">
      <div class="el-dropdown-link">
        <a>{{ userInfo ? userInfo.username : '登录' }}</a>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span @click="logout()">登出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

import {
  GITHUB_OAUTH_URL,
  QQ_OAUTH_URL,
  REDIRECT_URI,
  QQ_CLIENT_ID,
  GITHUB_CLIENT_ID,
} from '@/constant';
export default {
  components: {},
  data() {
    return {
      username: '',
      password: '',
      visible: true,
      dialogVisible: false,
      dialogtwo: false,
    };
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData;
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    isLogin() {
      if (!this.$store.state.user.userInfo) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {
    window.removeEventListener('scroll', this.headershow);
  },
  methods: {
    ...mapActions({
      getFrontendData: 'app/getFrontendData',
      userLogin: 'user/login',
      getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
      userLogout: 'user/logout',
    }),
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
    async register() {
      if (this.username === '' || this.password === '') {
        this.$newmessage('请输入完整！', 'error');
      } else {
        try {
          // 正则匹配用户名，格式要求：8-16位；只允许大小写字母、数字、下划线
          const usernameReg = /[0-9a-zA-Z_]{6,12}$/g;
          if (!usernameReg.test(this.username)) {
            throw new Error('格式要求：8-16位；只允许大小写字母、数字、下划线');
          }
          // 正则匹配密码，格式要求：8-16位；只允许大小写字母、数字、下划线；且不能全是大小写字母/数字/下划线
          const pwdReg =
            /^(?![0-9]+$)(?![a-zA-Z]+$)(?![_]+$)[0-9a-zA-Z_]{8,16}$/g;
          if (!pwdReg.test(this.password)) {
            throw new Error(
              '密码格式要求：8-16位；只允许大小写字母、数字、下划线；且不能全是大小写字母/数字/下划线'
            );
          }
        } catch (error) {
          this.$newmessage(error, 'error');
          return;
        }
        await this.$myaxios
          .post('user/register', {
            username: this.username,
            password: this.password,
          })
          .then((res) => {
            this.$newmessage('注册成功!', 'success');
            let timer = null;
            timer = setTimeout(() => {
              this.dialogtwo = false;
              clearTimeout(timer);
            }, 500);
          })
          .catch((error) => {
            this.$newmessage(error.message, 'error');
          });
      }
    },
    login() {
      if (this.username === '' || this.password === '') {
        this.$newmessage('请输入完整！', 'error');
      } else {
        this.userLogin({ username: this.username, password: this.password })
          .then((res) => {
            this.$newmessage(res.message, 'success');
            this.dialogVisible = false;
            this.getUserInfo();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    logout() {
      this.userLogout();
    },
    async querySearchAsync(keyWord, cb) {
      if (keyWord) {
        await this.$store.dispatch('user/findarticle', { keyWord });
        // cb(this.$store.state.article.search);
        let timer = null;
        timer = setTimeout(() => {
          cb(this.$store.state.article.search);
          clearTimeout(timer);
        }, 300);
      } else {
        let timer = null;
        timer = setTimeout(() => {
          // eslint-disable-next-line node/no-callback-literal
          cb([]);
          clearTimeout(timer);
        }, 300);
      }
    },
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop < height;
    },
  },
};
</script>

<style>
@media screen and (max-width: 992px) {
  .dialog .el-dialog {
    width: 50% !important;
  }
}
@media screen and (max-width: 540px) {
  .dialog .el-dialog {
    width: 80% !important;
  }
}
</style>

<style lang="scss" scoped>
.login-cpt-wrap {
}
.qq-login {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
