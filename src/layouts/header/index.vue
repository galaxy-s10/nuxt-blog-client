<template>
  <transition>
    <header :class="{ 'fix-header-wrap': true, hidden: hiddenHeader }">
      <div class="header-wrap">
        <div class="logo">
          <nuxt-link
            v-slot="{ navigate }"
            to="/"
            custom
          >
            <span @click="navigate">Natural</span>
          </nuxt-link>
          <sup>Blog</sup>
        </div>
        <nav class="nav">
          <ul class="nav-menu">
            <li
              v-for="(item, index) in navList"
              :key="index"
              class="item"
            >
              <!-- https://router.vuejs.org/zh/api/#custom，默认用a标签包裹元素，可以添加custom改掉这个行为 -->
              <nuxt-link :to="item.path">
                <span>{{ item.title }}</span>
              </nuxt-link>
            </li>
          </ul>
          <div class="nav-menu-mini">
            <el-dropdown
              trigger="click"
              @command="handleCommand"
            >
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
                  <nuxt-link
                    v-slot="{ navigate }"
                    :to="item.path"
                    custom
                  >
                    <span @click="navigate"> {{ item.title }}</span>
                  </nuxt-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </nav>
        <div class="search">
          <el-autocomplete
            v-model="keyWord"
            value-key="title"
            suffix-icon="el-icon-search"
            :fetch-suggestions="querySearchAsync"
            size="small"
            placeholder="搜索本站"
            clearable
            @select="handleSelect"
          ></el-autocomplete>
        </div>
        <LoginCpt />
      </div>
    </header>
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
          title: '互动',
          path: '/interaction',
        },
        {
          title: '关于',
          path: '/about',
        },
      ],
    };
  },
  computed: {
    hiddenHeader() {
      return this.$store.state.app.hiddenHeader;
    },
  },
  mounted() {},
  destroyed() {},
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
          keyWord,
        };
        const { data } = await this.$myaxios.get(`/article/keyword_list`, {
          params,
        });
        cb(data.rows);
      } else {
        // eslint-disable-next-line node/no-callback-literal
        cb([]);
      }
    },
  },
};
</script>

<style lang="scss" scope>
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
  .fix-header-wrap {
    background: $theme-color3;
  }
}
.fix-header-wrap {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid $theme-color2;
  background: $theme-color6;
  transition: all 0.3s;
  transform: translateZ(0);

  &.hidden {
    transform: translate3d(0, -100%, 0);
  }
  .header-wrap {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    height: 60px;
    line-height: 60px;
    .logo {
      cursor: pointer;
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
          margin: 0 15px;

          user-select: none;
          a {
            text-decoration: none;
            color: $theme-color5;
          }
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
          transition: all 0.3s;
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
