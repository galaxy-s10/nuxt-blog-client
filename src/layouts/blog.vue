<template>
  <div class="layout-blog-wrap">
    <LyHeader />
    <LyTypeList />
    <LyBacktop />
    <div class="main-wrap">
      <LyMain class="left" />
      <LyAside class="right" />
      <!-- <div class="right">
        <LyAside />
      </div> -->
      <!-- <div class="left">
        <LyMain />
      </div> -->
    </div>
    <AsnycAudioCpt v-if="showMusicAudio === true"></AsnycAudioCpt>
    <AsnycPlumCpt v-if="showPlum === true"></AsnycPlumCpt>
    <AsnycFeatureTipCpt></AsnycFeatureTipCpt>
    <div
      v-if="showMinCatalogIco"
      class="mini-catalog-ico"
      @click="showMinCatalog = !showMinCatalog"
    >
      <i class="el-icon-notebook-2"></i>
    </div>
    <div v-if="showMinCatalog" class="mini-catalog-wrap">
      <div class="mask" @click.self="showMinCatalog = !showMinCatalog">
        <div class="content">
          <CatalogCpt :list="catalogList"></CatalogCpt>
        </div>
      </div>
    </div>
    <LyFooter />
  </div>
</template>
<script>
import CatalogCpt from 'components/Catalog/index.vue';
import Cookies from 'js-cookie';
import LyAside from 'layouts/aside/index.vue';
import LyBacktop from 'layouts/backtop/index.vue';
import LyFooter from 'layouts/footer/index.vue';
import LyHeader from 'layouts/header/index.vue';
import LyMain from 'layouts/main/index.vue';
import LyTypeList from 'layouts/typelist/index.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: {
    LyHeader,
    LyTypeList,
    LyBacktop,
    LyAside,
    LyMain,
    LyFooter,
    CatalogCpt,
    AsnycAudioCpt: () => import('components/Audio/index.vue'),
    AsnycPlumCpt: () => import('components/Plum/index.vue'),
    AsnycFeatureTipCpt: () => import('components/FeatureTip/index.vue'),
  },
  asyncData({ $myaxios, store }) {},
  data() {
    return { showMinCatalogIco: false, showMinCatalog: false };
  },
  computed: {
    CurrentNodeEnv() {
      return this.$store.state.app.CurrentNodeEnv;
    },
    showMusicAudio() {
      return this.$store.state.app.showMusicAudio;
    },
    showPlum() {
      return this.$store.state.app.showPlum;
    },
    catalogList() {
      return this.$store.state.article.catalogList;
    },
  },
  mounted() {
    this.init();
    if (this.CurrentNodeEnv !== 'development') {
      this.$myaxios.post('visitor_log/create'); // 新增访客记录
    }
    this.handleResize();
    window.addEventListener('message', this.messageFn);
    window.addEventListener('scroll', this.headershow);
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('message', this.messageFn);
    window.removeEventListener('scroll', this.headershow);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
      setToken: 'user/setToken',
      logout: 'user/logout',
      setHiddenHeader: 'app/setHiddenHeader',
    }),
    handleResize() {
      const offsetWidth =
        window.pageXOffset || document.documentElement.offsetWidth;
      if (offsetWidth <= 425) {
        this.showMinCatalogIco = true;
      } else {
        this.showMinCatalogIco = false;
      }
    },
    headershow() {
      // 向下滚动超过350px才显示
      const height = 350;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.setHiddenHeader(offsetTop > height);
    },
    init() {
      const token = localStorage.token;
      if (token) {
        this.setToken(token);
        this.getUserInfo();
      }
    },
    async messageFn(e) {
      const { type, data: code } = e.data;
      if (type === 'qq_login') {
        if (code) {
          try {
            await this.$myaxios.post(`/qq_user/login`, { code });
            const token = Cookies.get('token');
            if (token) {
              this.setToken(token);
              this.getUserInfo();
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      if (type === 'github_login') {
        if (code) {
          try {
            await this.$myaxios.post(`/github_user/login`, { code });
            const token = Cookies.get('token');
            if (token) {
              this.setToken(token);
              this.getUserInfo();
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@media screen and (max-width: 540px) {
  .main-wrap {
    margin-top: 120px !important;
    width: 100%;
  }
}

.main-wrap {
  margin: 0 auto;
  margin-top: 130px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .left {
    box-sizing: border-box;
    width: calc(100% - 320px);
  }
  .right {
    width: 300px;
    box-sizing: border-box;
  }
}
.mini-catalog-ico {
  position: fixed;
  bottom: 20px;
  left: 10px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: wheat;
  box-shadow: 0 0 5px $theme-color2;
}
.mini-catalog-wrap {
  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    .content {
      position: fixed;
      bottom: 70px;
      left: 10px;
      width: 250px;
      border-radius: 10px;
      background-color: wheat;
      box-shadow: 0 2px 4px 0 rgb(0 0 0 / 4%);
      :deep(.catalog-cpt-wrap) {
        max-height: 50vh;
      }
    }
  }
}
</style>
