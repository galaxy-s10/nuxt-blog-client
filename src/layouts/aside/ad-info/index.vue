<template>
  <div
    v-if="GOOGLE_AD"
    class="ad-info"
  >
    <!-- 展示-展示广告1 -->
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-client="ca-pub-6064454674933772"
      data-ad-slot="4061381975"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
    <!-- 展示广告2 -->
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-client="ca-pub-6064454674933772"
      data-ad-slot="7203099379"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<script>
import { GOOGLE_AD } from '@/constant';

export default {
  components: {},
  props: {},
  data() {
    return { GOOGLE_AD };
  },
  head() {
    return {
      script: [
        GOOGLE_AD && {
          crossorigin: true,
          async: true,
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6064454674933772`,
        },
      ].filter(Boolean),
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.ad-info {
}
</style>
