<template>
  <div class="login-cpt-wrap">
    <el-dropdown
      v-if="isLogin"
      trigger="hover"
    >
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
                :disabled="frontendData.allow_qq_login.value !== '1'"
                @click="qqLogin"
              >
                QQ登录
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                type="text"
                :disabled="frontendData.allow_github_login.value !== '1'"
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
    <el-dropdown
      v-else
      trigger="hover"
    >
      <div class="el-dropdown-link">
        <img
          v-if="userInfo"
          :src="userInfo.avatar"
          class="avatar"
          alt=""
        />
        <a v-else>登录<i class="el-icon-arrow-down el-icon--right"></i></a>
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

import { loginMixin } from '@/mixin/login';

export default {
  components: {},
  mixins: [loginMixin],
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
            this.$newmessage('注册成功！', 'success');
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
      // 头部高度为60px
      const height = 60;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop < height;
    },
  },
};
</script>

<style>
@media screen and (max-width: 990px) {
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
  display: flex;
  align-items: center;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }
}
.qq-login {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
