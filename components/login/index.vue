<template>
  <div>
    <div class="login">
      <el-dropdown v-if="isLogin" trigger="click">
        <div class="el-dropdown-link" style="color: #53a8ff">
          <a>登录</a>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu v-if="frontendData" slot="dropdown">
          <el-dropdown-item>
            <el-button
              type="text"
              :disabled="frontendData.frontend_register === -1"
              @click="dialogtwo = true"
              >注册</el-button
            >
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button
              type="text"
              :disabled="frontendData.frontend_login === -1"
              @click="dialogVisible = true"
              >登录</el-button
            >
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button
              type="text"
              :disabled="frontendData.frontend_qq_login === -1"
              @click="qqLogin"
              >QQ登录</el-button
            >
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button
              type="text"
              :disabled="frontendData.frontend_github_login === -1"
              @click="githubLogin"
              >GitHub登录</el-button
            >
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown v-else trigger="click">
        <div class="el-dropdown-link" style="color: #53a8ff">
          <a>{{ name }}</a>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="logout()">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="dialog">
      <el-dialog
        title="登录"
        :modal-append-to-body="false"
        :visible.sync="dialogVisible"
        width="30%"
      >
        账号：
        <el-input v-model="username" placeholder="请输入账号"></el-input>密码：
        <el-input
          v-model="password"
          placeholder="请输入密码"
          show-password
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="login">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog">
      <el-dialog
        title="注册"
        :modal-append-to-body="false"
        :visible.sync="dialogtwo"
        width="30%"
      >
        账号：
        <el-input v-model="username" placeholder="请输入账号"></el-input>密码：
        <el-input
          v-model="password"
          placeholder="请输入密码"
          show-password
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogtwo = false">取消</el-button>
          <el-button type="primary" @click="register()">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import {
  githubOauthUrl,
  qqOauthUrl,
  redirectUri,
  qqClientId,
  githubClientId,
} from '@/constant'
export default {
  components: {},
  data() {
    return {
      username: '',
      password: '',
      state: '',
      visible: true,
      title: '首页',
      dialogVisible: false,
      dialogtwo: false,
      iframeSrc: null,
    }
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData.frontend
    },
    name() {
      if (this.$store.state.user.name) {
        return this.$store.state.user.name
      } else {
        return '登录'
      }
    },
    isLogin() {
      if (!this.$store.state.user.name) {
        return true
      } else {
        return false
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      userLogin: 'user/login',
      getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
      userLogout: 'user/logout',
    }),
    qqLogin() {
      const url =
        qqOauthUrl +
        'client_id=' +
        qqClientId +
        '&redirect_uri=' +
        redirectUri +
        'qq_login' +
        '&state=99&scope=get_user_info,get_vip_info,get_vip_rich_info'
      window.open(
        url,
        'qq_login_window',
        'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
      )
    },
    githubLogin() {
      const url =
        githubOauthUrl +
        'client_id=' +
        githubClientId +
        '&redirect_uri=' +
        redirectUri +
        'github_login' +
        '&scope=user'
      window.open(
        url,
        'github_login_window',
        'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
      )
    },
    async register() {
      if (this.username === '' || this.password === '') {
        this.$newmessage('请输入完整！', 'error')
      } else {
        try {
          // 正则匹配用户名，格式要求：8-16位；只允许大小写字母、数字、下划线
          const usernameReg = /[0-9a-zA-Z_]{6,12}$/g
          if (!usernameReg.test(this.username)) {
            throw new Error('格式要求：8-16位；只允许大小写字母、数字、下划线')
          }
          // 正则匹配密码，格式要求：8-16位；只允许大小写字母、数字、下划线；且不能全是大小写字母/数字/下划线
          const pwdReg =
            /^(?![0-9]+$)(?![a-zA-Z]+$)(?![_]+$)[0-9a-zA-Z_]{8,16}$/g
          if (!pwdReg.test(this.password)) {
            throw new Error(
              '密码格式要求：8-16位；只允许大小写字母、数字、下划线；且不能全是大小写字母/数字/下划线'
            )
          }
        } catch (err) {
          this.$newmessage(err, 'error')
          return
        }
        await this.$axios1
          .post('/api/user/register', {
            username: this.username,
            password: this.password,
          })
          .then((res) => {
            this.$newmessage('注册成功!', 'success')
            setTimeout(() => {
              this.dialogtwo = false
            }, 500)
          })
          .catch((err) => {
            this.$newmessage(err.message, 'error')
          })
      }
    },
    login() {
      if (this.username === '' || this.password === '') {
        this.$newmessage('请输入完整！', 'error')
      } else {
        this.userLogin({ username: this.username, password: this.password })
          .then((res) => {
            this.$newmessage(res.message, 'success')
            this.dialogVisible = false
            this.getUserInfo()
          })
          .catch((err) => {
            console.log(err)
            this.$newmessage(err.message, 'error')
          })
      }
    },
    logout() {
      this.userLogout()
    },
    handleCommand(x) {
      this.title = x
    },
    handleSelect(res) {
      const id = res.id
      if (this.$route.path !== '/article/' + id) {
        this.$router.push('/article/' + id)
      }
    },
    async querySearchAsync(keyword, cb) {
      if (keyword) {
        await this.$store.dispatch('user/findarticle', { keyword })
        // cb(this.$store.state.article.search);
        setTimeout(() => {
          cb(this.$store.state.article.search)
        }, 300)
      } else {
        setTimeout(() => {
          cb([])
        }, 300)
      }
    },
    headershow() {
      // 头部高度为70px
      const height = 70
      const offsetTop = window.pageYOffset || document.documentElement.scrollTop
      this.visible = offsetTop < height
    },
  },
}
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

<style scoped>
.dialog {
  line-height: 30px;
}
.dialog /deep/ .el-dialog__body {
  padding: 0px 20px;
}
.qq-login {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
