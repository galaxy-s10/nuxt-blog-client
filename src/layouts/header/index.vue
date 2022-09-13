<template>
  <transition>
    <div v-show="visible" class="fix-header-wrapper">
      <div class="header-wrapper">
        <div class="logo">
          <nuxt-link v-slot="{ navigate }" to="/" custom>
            <span @click="navigate">Natural</span>
          </nuxt-link>
          <sup>Blog</sup>
        </div>
        <div class="nav">
          <ul class="nav-menu">
            <li v-for="(item, index) in navList" :key="index" class="item">
              <!-- https://router.vuejs.org/zh/api/#custom，默认用a标签包裹元素，可以添加custom改掉这个行为 -->
              <nuxt-link v-slot="{ navigate }" :to="item.path" custom>
                <span @click="navigate">{{ item.title }}</span>
              </nuxt-link>
            </li>
          </ul>
          <div class="nav-menu-mini">
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="el-dropdown-link">
                {{ title }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in navList"
                  :key="index"
                  :command="item.title"
                >
                  <nuxt-link v-slot="{ navigate }" :to="item.path" custom>
                    <span @click="navigate"> {{ item.title }}</span>
                  </nuxt-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search">
          <el-autocomplete
            v-model="keyWord"
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
import LoginCpt from 'components/Login/index.vue';

export default {
  components: {
    LoginCpt,
  },
  data() {
    return {
      visible: true,
      title: '首页',
      keyWord: '',
      navList: [
        {
          title: '首页',
          path: '/',
        },
        {
          title: '归档',
          path: '/history',
        },
        {
          title: '标签',
          path: '/tag/1',
        },
        {
          title: '作品',
          path: '/works',
        },
        {
          title: '友链',
          path: '/link',
        },
        {
          title: '留言',
          path: '/msg',
        },
        {
          title: '聊天',
          path: '/chat',
        },
        {
          title: '关于',
          path: '/about',
        },
      ],
    };
  },
  computed: {},
  mounted() {
    window.addEventListener('scroll', this.headershow);
  },
  destroyed() {
    window.removeEventListener('scroll', this.headershow);
  },
  methods: {
    register() {},
    login() {},
    logout() {
      this.$store.commit('user/setToken', null);
    },
    handleCommand(x) {
      this.title = x;
    },
    handleSelect(res) {
      const id = res.id;
      if (this.$route.path !== `/article/${id}`) {
        this.$router.push(`/article/${id}`);
      }
    },
    async querySearchAsync(keyWord, cb) {
      if (keyWord) {
        const params = {
          nowPage: 1,
          pageSize: 20,
          keyWord,
        };
        const { data } = await this.$myaxios.get(`/article/keyWord_list`, {
          params,
        });
        cb(data.rows);
      } else {
        // eslint-disable-next-line node/no-callback-literal
        cb([]);
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

<style lang="scss" scope>
@import '@/assets/css/constant.scss';

.v-enter-active {
  transition: all 0.5s ease;
}
.v-leave-active {
  transition: all 0.5s ease;
}
.v-enter,
.v-leave-to {
  transform: translateY(-70px);
}

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
.dark {
  .fix-header-wrapper {
    background: $theme-color3;
  }
}
.fix-header-wrapper {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid $theme-color2;
  background: $theme-color6;
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
        position: relative;
        display: inline-block;
        cursor: pointer;
      }
      ul li:hover {
        color: $theme-color1;
      }
      .nav-menu {
        margin: 0;
        padding: 0;
        .item {
          margin: 0 20px;
          user-select: none;
        }
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
          background-color: $theme-color1;
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
