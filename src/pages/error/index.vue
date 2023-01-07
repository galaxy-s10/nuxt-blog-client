<template>
  <div class="error-wrap">
    <div class="err-txt">
      <h1 class="title">Natural blog</h1>
      <h1 v-if="apiError.errorCode.value !== -1">
        {{ apiError.message }}
      </h1>
      <h1
        v-if="frontendData && frontendData.allow_shutdown_modal.value === '1'"
      >
        {{ frontendData.shutdown_modal_content.value || '停机维护中' }}
      </h1>
    </div>

    <div class="site">
      <h2>联系方式:</h2>
      <SiteInfoCpt></SiteInfoCpt>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import SiteInfoCpt from '@/components/SiteInfo/index.vue';

export default {
  components: { SiteInfoCpt },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      frontendData(state) {
        return state.app.frontendData;
      },
      apiError(state) {
        return state.app.apiError;
      },
    }),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.error-wrap {
  .err-txt {
    text-align: center;
    .title {
      font-size: 4rem;
    }
  }
  .site {
    padding: 0 30px;
    width: 300px;
  }
}
</style>
