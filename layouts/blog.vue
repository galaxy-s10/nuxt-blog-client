<template>
  <div>
    <HeaderCpt />
    <TypeListCpt />
    <BacktopCpt />
    <div class="main-wrapper">
      <div class="left">
        <MainCpt />
      </div>
      <div class="right"><AsideCpt /></div>
    </div>
    <AudioCpt></AudioCpt>
    <!-- <feature-tip></feature-tip> -->
    <FooterCpt />
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import HeaderCpt from '@/layouts/header'
import TypeListCpt from '@/layouts/typelist'
import BacktopCpt from '@/layouts/backtop'
import AsideCpt from '@/layouts/aside'
import MainCpt from '@/layouts/main'
import FooterCpt from '@/layouts/footer'
import AudioCpt from '@/components/audio'
// import featureTip from "../components/featureTip";
export default {
  components: {
    HeaderCpt,
    TypeListCpt,
    BacktopCpt,
    AsideCpt,
    MainCpt,
    AudioCpt,
    FooterCpt,
    // featureTip,
  },
  mounted() {
    this.init()
    this.getFrontendDetail()
    this.$axios1.post('/api/visitor_log/create')
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
      setToken: 'user/setToken',
      logout: 'user/logout',
      setFrontendData: 'app/setFrontendData',
    }),

    init() {
      const token = localStorage.token
      if (token) {
        this.setToken(token)
        this.getUserInfo()
          .then(() => {})
          .catch(() => {
            this.logout()
          })
      }
    },

    async getFrontendDetail() {
      const res = await this.$axios1.get('/api/frontend/detail')
      this.setFrontendData(res)
    },
  },
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  margin: 0 auto;
  margin-top: 140px;
  padding-bottom: 50px;
  overflow: hidden;
  .left {
    float: left;
    width: 70%;
  }
  .right {
    float: right;
    width: 27%;
  }
}
@media screen and (max-width: 540px) {
  .main-wrapper {
    width: 100%;
    margin-top: 135px !important;
  }
}
</style>
