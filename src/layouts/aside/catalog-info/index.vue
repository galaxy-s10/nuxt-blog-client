<template>
  <div
    v-if="showCatalog"
    :class="{ 'catalog-info': 1 }"
  >
    <div
      ref="catalogRef"
      class="catalog-ref"
    ></div>
    <nav
      ref="catalogInfoRef"
      :style="{ width }"
      :class="{ 'catalog-nav': 1, fix: catalogFixed }"
    >
      <div class="title">
        <i class="el-icon-paperclip"></i>
        <b>文章目录</b>
      </div>
      <CatalogCpt :list="catalogList"></CatalogCpt>
      <!-- 文章插入广告 -->
      <client-only>
        <div
          v-if="GOOGLE_AD"
          class="ad"
        >
          <ins
            class="adsbygoogle"
            style="display: block; text-align: center"
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-6064454674933772"
            data-ad-slot="3717357923"
          ></ins>
        </div>
      </client-only>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import CatalogCpt from '@/components/Catalog/index.vue';
import { GOOGLE_AD } from '@/constant';

export default {
  components: { CatalogCpt },
  props: {},
  data() {
    return {
      width: '',
      catalogFixed: false,
      catalogObserver: null,
      GOOGLE_AD,
    };
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
  computed: {
    ...mapState({}),
    catalogList() {
      return this.$store.state.article.catalogList;
    },
    showCatalog() {
      return this.$store.state.app.showCatalog;
    },
  },
  watch: {
    $route(to, from) {
      if (to.name !== 'article-id') {
        this.$nextTick(() => {
          if (this.showCatalog && this.$refs.catalogRef) {
            this.catalogObserver.unobserve(this.$refs.catalogRef);
          }
        });
      }
    },
    showCatalog(newVal, oldVal) {
      if (newVal) {
        this.catalogFixed = false;
        this.$nextTick(() => {
          if (this.showCatalog && this.$refs.catalogRef) {
            this.handleCataLogObserver(this.$refs.catalogRef);
          }
        });
      }
    },
  },

  created() {},
  mounted() {},
  methods: {
    // 文章目录监听
    handleCataLogObserver(ref) {
      const rootMargin = { top: -40, right: 0, bottom: 0, left: 0 };
      this.catalogObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((item) => {
            const height = window.innerHeight + rootMargin.top;
            if (height <= item.boundingClientRect.top) return;
            if (!this.showCatalog) return;
            if (
              this.$refs.catalogInfoRef.getBoundingClientRect().height >=
              document.querySelector('.main-wrap .left').getBoundingClientRect()
                .height
            ) {
              return;
            }
            if (item.isIntersecting) {
              this.catalogFixed = false;
              this.width = `${
                this.$refs.catalogInfoRef.getBoundingClientRect().width
              }px`;
            } else {
              this.catalogFixed = true;
            }
          });
        },
        {
          rootMargin: `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`,
        }
      );
      this.catalogObserver.observe(ref);
    },
  },
};
</script>

<style lang="scss" scoped>
.catalog-info {
  position: relative;
  .catalog-ref {
    width: 1px;
    height: 1px;
  }
  .catalog-nav {
    overflow: hidden;
    box-sizing: border-box;
    margin-top: 20px;
    padding: 10px;
    border: 1px solid $theme-color4;
    border-radius: 5px;
    background: $theme-color6;
    &.fix {
      position: fixed;
      top: 40px;
      box-sizing: border-box;
      width: inherit;
    }
    .title {
      margin: 8px 0;
    }
  }
  .ad {
    height: 120px;
  }
}
</style>
