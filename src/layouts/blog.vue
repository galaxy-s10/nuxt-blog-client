<template>
  <div class="layout-blog-wrap">
    <LyHeader />
    <LyTypeList />
    <LyBacktop />
    <div class="main-wrap">
      <LyMain class="left" />
      <LyAside class="right" />
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
    <div
      v-if="showMinCatalog"
      class="mini-catalog-wrap"
    >
      <div
        class="mask"
        @click.self="showMinCatalog = !showMinCatalog"
      >
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
import LyAside from 'layouts/aside/index.vue';
import LyBacktop from 'layouts/backtop/index.vue';
import LyFooter from 'layouts/footer/index.vue';
import LyHeader from 'layouts/header/index.vue';
import LyMain from 'layouts/main/index.vue';
import LyTypeList from 'layouts/typelist/index.vue';
import { mapActions, mapMutations } from 'vuex';

import { preloadImg } from '@/utils';
import generatorCss from '@/utils/themeSystem';

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
    currentNodeEnv() {
      return this.$store.state.app.currentNodeEnv;
    },
    nuxtServerInit() {
      return this.$store.state.app.nuxtServerInit;
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
  watch: {
    $route(to, from) {
      if (to.name === 'article-id') {
        this.handleResize();
      } else {
        this.showMinCatalogIco = false;
        this.showMinCatalog = false;
      }
    },
  },
  mounted() {
    this.init();
    this.handlePreloadImg();
    console.log(
      `nuxtServerInit阶段耗时：${
        this.nuxtServerInit.endTime - this.nuxtServerInit.startTime
      }ms`
    );
    if (this.currentNodeEnv !== 'development') {
      this.$myaxios.post('visitor_log/create'); // 新增访客记录
    }
    if (this.$route.name === 'article-id') {
      this.handleResize();
    }
    window.addEventListener('message', this.messageFn);
    window.addEventListener('scroll', this.handleHiddenHeader);
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('message', this.messageFn);
    window.removeEventListener('scroll', this.handleHiddenHeader);
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
    async setTheme() {
      const { data } = await this.$myaxios.get(`/theme/list`);
      let styleContent = ':root{';
      data.rows.forEach((item) => {
        const styleVal = item.value;
        styleContent += `${item.key}:${styleVal};`;
      });
      styleContent += '}';
      generatorCss(styleContent);
    },
    handlePreloadImg() {
      const imgs = require.context(
        '../assets/img/',
        true,
        /.webp|.jpg|.png|.jpeg|.gif$/i
      );
      const imgArr = [];
      imgs.keys().forEach((path) => {
        const newpath = path.replace('./', '');
        try {
          imgArr.push(require(`@/assets/img/${newpath}`));
        } catch (error) {
          console.log(error);
        }
      });
      try {
        preloadImg(imgArr);
      } catch (error) {
        console.log(error);
      }
    },
    handleResize() {
      if (this.$route.name !== 'article-id') return;
      const offsetWidth =
        window.pageXOffset || document.documentElement.offsetWidth;
      this.showMinCatalogIco = offsetWidth <= 425;
    },
    handleHiddenHeader() {
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.setHiddenHeader(offsetTop > 350); // 向下滚动超过350px就隐藏header
    },
    init() {
      this.setTheme();
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
            const { data: token } = await this.$myaxios.post(`/qq_user/login`, {
              code,
            });
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
            const { data: token } = await this.$myaxios.post(
              `/github_user/login`,
              {
                code,
              }
            );
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

<style>
html {
  filter: var(--html-filter);
}
</style>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@media screen and (max-width: 540px) {
  .main-wrap {
    margin-top: 120px !important;
    width: 100%;
  }
}

.main-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 130px;
  .left {
    box-sizing: border-box;
    width: calc(100% - 320px);
  }
  .right {
    box-sizing: border-box;
    width: 300px;
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
