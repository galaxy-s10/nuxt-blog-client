<template>
  <div>
    <div class="login">
      <el-dropdown v-if="inout" trigger="click">
        <div class="el-dropdown-link" style="color: #53a8ff">
          <a>登录</a>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="dialogtwo = true">注册</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="dialogVisible = true">登录</span>
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
        <el-input placeholder="请输入账号" v-model="username"></el-input>密码：
        <el-input
          placeholder="请输入密码"
          v-model="password"
          show-password
        ></el-input>
        <div class="qq-login">
          <img
            style="cursor: pointer"
            @click="qqLogin"
            src="../../assets/imgs/Connect_logo_4.png"
            alt=""
          />
        </div>
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
        <el-input placeholder="请输入账号" v-model="username"></el-input>密码：
        <el-input
          placeholder="请输入密码"
          v-model="password"
          show-password
        ></el-input>
        <div class="qq-login">
          <img
            style="cursor: pointer"
            @click="qqLogin"
            src="../../assets/imgs/Connect_logo_4.png"
            alt=""
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogtwo = false">取消</el-button>
          <el-button type="primary" @click="register()">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
      state: "",
      visible: true,
      title: "首页",
      dialogVisible: false,
      dialogtwo: false,
    };
  },
  created() {},
  methods: {
    ...mapActions({
      userLogin: "user/login",
      getUserInfo: "user/getUserInfo",
    }),
    ...mapMutations({
      userLogout: "user/logout",
    }),
    qqLogin() {
      window.location.href =
        // "https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101934585&redirect_uri=https://www.zhengbeining.com/link";
        "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101958191&redirect_uri=https://www.hsslive.cn/link&state=99&scope=get_user_info,get_vip_info,get_vip_rich_info";
        // "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101934585&redirect_uri=http://localhost:3000/link&state=99&scope=get_user_info,get_vip_info,get_vip_rich_info";
      // this.$newmessage("审核通过将点击跳转qq授权登录", "success");
    },
    async register() {
      if (this.username == "" || this.password == "") {
        this.$newmessage("请输入完整！", "error");
      } else {
        try {
          if (!(this.username.length >= 3 && this.username.length < 10)) {
            throw "用户名错误：用户名要求3-10个字符";
          }
          // 正则匹配密码，6-12位，大小写字母和数字和下划线
          let reg = /^\w{6,12}$/g;
          if (!reg.test(this.password)) {
            throw "密码错误：密码要求6-12位，大小写字母以及数字和下划线！";
          }
        } catch (err) {
          this.$newmessage(err, "error");
          return;
        }
        await this.$axios
          .$post("/api/user/register", {
            username: this.username,
            password: this.password,
          })
          .then((res) => {
            this.$newmessage("注册成功!", "success");
            setTimeout(() => {
              this.dialogtwo = false;
            }, 500);
          })
          .catch((err) => {
            this.$newmessage(err.message, "error");
          });
      }
    },
    login() {
      if (this.username == "" || this.password == "") {
        this.$newmessage("请输入完整！", "error");
      } else {
        this.userLogin({ username: this.username, password: this.password })
          .then((res) => {
            this.$newmessage(res.message, "success");
            this.dialogVisible = false;
            this.getUserInfo();
          })
          .catch((err) => {
            console.log(err);
            this.$newmessage(err.message, "error");
          });
      }
    },
    logout() {
      this.userLogout();
    },
    handleCommand(x) {
      this.title = x;
    },
    handleSelect(res) {
      var id = res.id;
      if (this.$route.path != "/article/" + id) {
        this.$router.push("/article/" + id);
      }
    },
    async querySearchAsync(keyword, cb) {
      if (keyword) {
        await this.$store.dispatch("user/findarticle", { keyword });
        // cb(this.$store.state.article.search);
        setTimeout(() => {
          cb(this.$store.state.article.search);
        }, 300);
      } else {
        setTimeout(() => {
          cb([]);
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

  computed: {
    name() {
      if (this.$store.state.user.name) {
        return this.$store.state.user.name;
      } else {
        return "登录";
      }
    },
    inout() {
      if (!this.$store.state.user.name) {
        return true;
      } else {
        return false;
      }
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
