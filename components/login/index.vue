<template>
  <div>
    <div class="login">
      <el-dropdown v-if="inout" trigger="click">
        <div class="el-dropdown-link" style="color:#53a8ff">
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
        <div class="el-dropdown-link" style="color:#53a8ff">
          <a>{{name}}</a>
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
      <el-dialog title="登录" :modal-append-to-body="false" :visible.sync="dialogVisible" width="30%">
        账号：
        <el-input placeholder="请输入账号" v-model="uname"></el-input>密码：
        <el-input placeholder="请输入密码" v-model="upwd" show-password></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="success" @click="login">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog">
      <el-dialog title="注册" :modal-append-to-body="false" :visible.sync="dialogtwo" width="30%">
        账号：
        <el-input placeholder="请输入账号" v-model="uname"></el-input>密码：
        <el-input placeholder="请输入密码" v-model="upwd" show-password></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogtwo = false">取消</el-button>
          <el-button type="success" @click="register()">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    return {
      uname: "",
      upwd: "",
      state: "",
      visible: true,
      title: "首页",
      dialogVisible: false,
      dialogtwo: false
    };
  },
  methods: {
    async register() {
      if (this.uname == "" || this.upwd == "") {
        this.$newmessage("请输入完整！", "error");
      } else {
        const res = await this.$axios.$post("/api/user/add", {
          username: this.uname,
          password: this.upwd
        });
        if (res.code) {
          this.$newmessage("注册成功，请登录~", "success");
          setTimeout(() => {
            this.dialogtwo = false;
          }, 500);
        } else {
          this.$newmessage(res.message, "error");
        }
      }
    },
    async login() {
      if (this.uname == "" || this.upwd == "") {
        this.$newmessage("请输入完整！", "error");
      } else {
        await this.$store.dispatch("user/login", {
          username: this.uname,
          password: this.upwd
        });
        await this.$store.dispatch("user/getInfo");
      }
      if (this.$store.state.user.token) {
        setTimeout(() => {
          this.dialogVisible = false;
        }, 500);
      }
    },
    logout() {
      this.$store.commit("user/settoken", null);
      this.$store.commit("user/setname", null);
      this.$store.commit("user/setavatar", null);
      this.$store.commit("user/settitle", null);
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
    }
  },
  created() {},
  computed: {
    name() {
      if (this.$store.state.user.name) {
        return this.$store.state.user.name;
      } else {
        return "登录";
      }

      // var token = Cookies.get("token");
      // if (token) {
      //   this.$store.dispatch("user/geiInfo");
      // } else {
      //   return "登录";
      // }
    },
    inout() {
      if (!this.$store.state.user.name) {
        return true;
      } else {
        return false;
      }
    }
  }
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
</style>
