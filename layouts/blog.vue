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
    <FooterCpt />
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import Cookies from 'js-cookie'
import HeaderCpt from '@/layouts/header'
import TypeListCpt from '@/layouts/typelist'
import BacktopCpt from '@/layouts/backtop'
import AsideCpt from '@/layouts/aside'
import MainCpt from '@/layouts/main'
import FooterCpt from '@/layouts/footer'
import AudioCpt from '@/components/Audio'

// import featureTip from "../components/FeatureTip";
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
    this.getFrontendData()
    this.$axios1.post('/api/visitor_log/create') // 新增访客记录
    window.addEventListener('message', async (e) => {
      const { type, data: code } = e.data
      if (type === 'qq_login') {
        if (code) {
          try {
            await this.$axios1.get(`/api/qq_user/login?code=${code}`)
            const token = Cookies.get('token')
            if (token) {
              this.setToken(token)
              this.getUserInfo()
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
      if (type === 'github_login') {
        if (code) {
          try {
            await this.$axios1.get(`/api/github_user/login?code=${code}`)
            const token = Cookies.get('token')
            if (token) {
              this.setToken(token)
              this.getUserInfo()
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
    })
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
      const token = localStorage.token
      if (token) {
        this.setToken(token)
        this.getUserInfo()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.main-wrapper {
  display: flex;
  overflow: hidden;
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
