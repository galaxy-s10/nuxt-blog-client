<template>
  <AsnycCollapseCpt
    class="site-info"
    title="站点信息"
    open
  >
    <template #ico>
      <i class="el-icon-setting"></i>
    </template>
    <SiteInfoCpt></SiteInfoCpt>
  </AsnycCollapseCpt>
</template>

<script>
import SiteInfoCpt from '@/components/SiteInfo/index.vue';

export default {
  components: {
    SiteInfoCpt,
    AsnycCollapseCpt: () => import('@/components/Collapse/index.vue'),
  },
  props: {},
  data() {
    return {
      version: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.version = process.env.NUXT_BLOG_VERSION;
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.site-info {
}
</style>
