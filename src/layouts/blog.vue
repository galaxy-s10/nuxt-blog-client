<template>
  <div class="blog-wrap">
    <LyHeader />
    <LyTypeList />
    <LyBacktop />
    <div class="main-wrap">
      <LyMain class="left" />
      <LyAside class="right" />
    </div>

    <LazyDND
      v-if="showMusicAudio === true"
      ref="dndRef"
      class="dnd-wrap"
    >
      <AudioCpt @changeRect="changeRect"></AudioCpt>
    </LazyDND>

    <LazyPlum v-if="showPlum === true"></LazyPlum>
    <FeatureTipCpt></FeatureTipCpt>
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
    <LoginModalCpt v-model="loginModalVisiable"></LoginModalCpt>
  </div>
</template>
<script>
// import PlumCpt from '@/components/Plum/index.vue';
import { generateStyle, imgPrereload } from 'billd-utils';
import { mapActions, mapMutations } from 'vuex';
import adapter from 'webrtc-adapter';

// eslint-disable-next-line
import { Api } from '@/api';

import AudioCpt from '@/components/Audio/index.vue';
import CatalogCpt from '@/components/Catalog/index.vue';
import FeatureTipCpt from '@/components/FeatureTip/index.vue';
import LoginModalCpt from '@/components/LoginModal/index.vue';
import LyAside from '@/layouts/aside/index.vue';
import LyBacktop from '@/layouts/backtop/index.vue';
import LyFooter from '@/layouts/footer/index.vue';
import LyHeader from '@/layouts/header/index.vue';
import LyMain from '@/layouts/main/index.vue';
import LyTypeList from '@/layouts/typelist/index.vue';

export default {
  components: {
    LyHeader,
    LyTypeList,
    LyBacktop,
    LyAside,
    LyMain,
    LyFooter,
    CatalogCpt,
    AudioCpt,
    // AsnycAudioCpt: () => import('@/components/Audio/index.vue'),
    // PlumCpt,
    FeatureTipCpt,
    LoginModalCpt,
  },
  middleware: ['auth'],
  /**
   * @typedef {Object} asyncDataType
   * @property {Api} $myaxios
   * @property {Object} store
   * @property {Object} params
   * @property {Object} req
   * @param {asyncDataType} value
   * https://nuxtjs.org/docs/concepts/context-helpers
   * nuxt2不支持在layout使用asyncData:https://github.com/nuxt/nuxt.js/issues/3510
   */
  async asyncData({ $myaxios, store, params, req }) {},
  data() {
    return {
      loginModalVisiable: false,
      showMinCatalogIco: false,
      showMinCatalog: false,
    };
  },
  head() {
    return {
      // script: [
      //   {
      //     crossorigin: true,
      //     async: true,
      //     src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6064454674933772`,
      //   },
      // ],
    };
  },
  computed: {
    apiError() {
      return this.$store.state.app.apiError;
    },
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
    showLoginModal() {
      return this.$store.state.app.showLoginModal;
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
    showLoginModal(newVal) {
      this.loginModalVisiable = newVal;
    },
    loginModalVisiable(newVal) {
      this.setShowLoginModal(newVal);
    },
  },
  mounted() {
    console.log(adapter.browserDetails.browser, adapter.browserDetails.version);
    // try {
    //   // eslint-disable-next-line
    //   (adsbygoogle = window.adsbygoogle || []).push({});
    // } catch (error) {
    //   console.log(error);
    // }
    this.init();
    this.handlePreloadImg();
    console.log(
      `nuxtServerInit阶段的耗时：${
        this.nuxtServerInit.endTime - this.nuxtServerInit.startTime
      }ms`
    );
    console.log(
      `nuxtServerInit开始至layout渲染之间的耗时：${
        Date.now() - this.nuxtServerInit.startTime
      }ms`
    );
    if (this.currentNodeEnv !== 'development') {
      this.$myaxios.visitorLog.create(); // 新增访客记录
    }
    if (this.$route.name === 'article-id') {
      this.handleResize();
    }

    window.addEventListener('message', this.messageFn);
    window.addEventListener('scroll', this.handleHiddenHeader);
    window.addEventListener('resize', this.handleResize);

    const { code: authCode, loginEnv } = this.$route.query;
    const oldQuery = { ...this.$router.query };
    delete oldQuery.code;
    delete oldQuery.loginEnv;
    this.$router.push({ query: oldQuery });
    if (!loginEnv) return;
    try {
      const { env } = JSON.parse(loginEnv);
      if (env === 'qq') {
        this.messageFn({ data: { type: 'qq_login', data: authCode } });
      } else if (env === 'github') {
        this.messageFn({ data: { type: 'github_login', data: authCode } });
      }
    } catch (error) {
      console.error('解密state失败');
      console.error(error);
    }
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
      setShowLoginModal: 'app/setShowLoginModal',
    }),
    changeRect() {
      const dndRef = this.$refs.dndRef;
      dndRef.changeRect();
    },
    async setTheme() {
      const { data } = await this.$myaxios.theme.list();
      const obj = {};
      data.rows.forEach((item) => {
        obj[item.key] = item.value;
      });
      generateStyle({
        ':root': obj,
      });
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
        imgPrereload(imgArr);
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
    async messageFn(event) {
      const { type, data: code } = event.data;
      let token;
      try {
        if (type === 'qq_login') {
          const { data } = await this.$myaxios.qqUser.login(code);
          token = data;
        } else if (type === 'github_login') {
          const { data } = await this.$myaxios.githubUser.login(code);
          token = data;
        }
      } catch (error) {
        console.error(`${type}失败`);
        console.log(error);
      }
      if (token) {
        this.setToken(token);
        this.getUserInfo();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 540px) {
  .main-wrap {
    margin-top: 120px !important;
    width: 100%;
  }
}
.blur-img {
  filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: 1000px;
}
.blog-wrap {
  .dnd-wrap {
    position: fixed;
    right: 20px;
    top: 250px;
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
}
</style>
