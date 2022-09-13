<template>
  <div>
    <LyHeader />
    <LyTypeList />
    <LyBacktop />
    <div class="main-wrapper">
      <div class="left">
        <LyMain />
      </div>
      <div class="right">
        <LyAside />
      </div>
    </div>
    <AsnycAudioCpt v-if="showMusicAudio === true"></AsnycAudioCpt>
    <AsnycPlumCpt v-if="showPlum === true"></AsnycPlumCpt>
    <AsnycFeatureTipCpt></AsnycFeatureTipCpt>
    <LyFooter />
  </div>
</template>
<script>
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
    AsnycAudioCpt: () => import('components/Audio/index.vue'),
    AsnycPlumCpt: () => import('components/Plum/index.vue'),
    AsnycFeatureTipCpt: () => import('components/FeatureTip/index.vue'),
  },
  asyncData({ $myaxios, store }) {},
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
  },

  mounted() {
    this.init();
    this.getFrontendData();
    if (this.CurrentNodeEnv !== 'development') {
      this.$myaxios.post('visitor_log/create'); // 新增访客记录
    }
    window.addEventListener('message', this.messageFn);
  },
  destroyed() {
    window.removeEventListener('message', this.messageFn);
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
      getFrontendData: 'app/getFrontendData',
    }),
    ...mapMutations({
      setToken: 'user/setToken',
      logout: 'user/logout',
    }),

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

.main-wrapper {
  display: flex;
  // overflow: hidden;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 130px;
  .left {
    flex: 1;
    width: 65%;
  }
  .right {
    margin-left: 20px;
    width: 300px;
  }
}
@media screen and (max-width: 540px) {
  .main-wrapper {
    margin-top: 120px !important;
    width: 100%;
  }
}
</style>
