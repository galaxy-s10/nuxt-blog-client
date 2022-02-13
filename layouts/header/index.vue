<template>
  <transition>
    <div v-show="visible" class="fix-header-wrapper">
      <div class="header-wrapper">
        <div class="logo">
          <nuxt-link tag="span" to="/">Nuxt</nuxt-link>
          <sup>Blog</sup>
        </div>
        <div class="nav">
          <ul class="nav-menu">
            <li v-for="(item, index) in navlist" :key="index" class="item">
              <nuxt-link :to="item.path" tag="span">
                <span :class="item.icon"></span>
                <span style="font-size: 18px">{{ item.title }}</span>
              </nuxt-link>
            </li>
          </ul>
          <div class="nav-menu-mini">
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="el-dropdown-link" style="color: #53a8ff">
                {{ title }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in navlist"
                  :key="index"
                  :command="item.title"
                >
                  <nuxt-link tag="span" :to="item.path">{{
                    item.title
                  }}</nuxt-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search">
          <el-autocomplete
            v-model="state"
            value-key="title"
            suffix-icon="el-icon-search"
            :fetch-suggestions="querySearchAsync"
            size="small"
            placeholder="搜索本站"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
        <LoginCpt />
      </div>
    </div>
  </transition>
</template>

<script>
import LoginCpt from '@/components/login'
export default {
  components: {
    LoginCpt,
  },
  data() {
    return {
      username: '',
      password: '',
      state: '',
      visible: true,
      title: '首页',
      dialogVisible: false,
      dialogtwo: false,
      navlist: [
        {
          title: '首页',
          icon: 'el-icon-s-home',
          path: '/',
        },
        {
          title: '归档',
          icon: 'el-icon-s-data',
          path: '/history',
        },
        {
          title: '标签',
          icon: 'el-icon-s-flag',
          path: '/tag/1',
        },
        {
          title: '友链',
          icon: 'el-icon-s-promotion',
          path: '/link',
        },
        // {
        //   title: "留言板",
        //   icon: "el-icon-chat-line-round",
        //   path: "/message"
        // },
        {
          title: '关于',
          icon: 'el-icon-share',
          path: '/about',
        },
      ],
    }
  },
  computed: {
    inout() {
      if (!this.$store.state.user.token) {
        return true
      } else {
        return false
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.headershow)
  },
  destroyed() {
    window.removeEventListener('scroll', this.headershow)
  },
  methods: {
    register() {
      if (this.username === '' || this.password === '') {
        this.$newmessage('请输入完整！', 'error')
      } else {
        add({ username: this.username, pwd: this.password })
          .then((res) => {
            this.$newmessage(this.username + '注册成功，请登录~', 'success')
            setTimeout(() => {
              this.dialogtwo = false
            }, 500)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    async login() {
      if (this.username === '' || this.password === '') {
        this.$newmessage('请输入完整！', 'error')
      } else {
        await this.$store.dispatch('login', {
          username: this.username,
          pwd: this.password,
        })
        await this.$store.dispatch('getInfo')
      }
      if (this.$store.state.user.token) {
        setTimeout(() => {
          this.dialogVisible = false
        }, 500)
      }
    },
    logout() {
      this.$store.commit('settoken', null)
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
        const params = {
          nowPage: 1,
          pageSize: 20,
          keyword,
        }
        const res = await this.$axios1.get(`/api/article/list`, { params })
        setTimeout(() => {
          cb(res.rows)
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

<style lang="scss" scope>
.fix-header-wrapper {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid #f1f1f1;
  background: white;
  .header-wrapper {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    height: 70px;
    line-height: 70px;
    transition: all 0.2s;
    .logo {
      font-size: 20px;
      sup {
        font-size: 13px;
      }
    }
    .nav {
      ul li {
        display: inline-block;
        margin: 0 15px;
        padding: 0 4px;
        position: relative;
        color: #666;
        cursor: pointer;
      }
      ul li:hover {
        color: #53a8ff;
      }
      .nav-menu {
        margin: 0;
        padding: 0;
        .item:hover:before {
          left: 0;
          width: 100%;
        }
        .item:before {
          position: absolute;
          bottom: 10px;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #53a8ff;
          content: '';
          transition: all 0.3s ease;
        }
      }
      .nav-menu-mini {
        display: none;
        text-align: center;
      }
    }
  }
}
</style>

<style scoped>
@media screen and (max-width: 540px) {
  .header {
    height: 50px;
    line-height: 50px;
  }
  .search {
    width: 30%;
  }
  .logo h2 {
    font-size: 18px;
  }
  .logo h2 sup {
    font-size: 10px;
  }
}
.v-enter-active {
  transition: all 0.5s ease;
}
.v-leave-active {
  transition: all 0.5s ease;
}
.v-enter,
.v-leave-to {
  transform: translateY(-75px);
}
</style>
