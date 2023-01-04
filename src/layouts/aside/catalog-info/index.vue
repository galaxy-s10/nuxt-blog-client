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
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import CatalogCpt from '@/components/Catalog/index.vue';

export default {
  components: { CatalogCpt },
  props: {},
  data() {
    return {
      width: '',
      catalogFixed: false,
      catalogObserver: null,
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
          this.$refs.catalogRef &&
            this.catalogObserver.unobserve(this.$refs.catalogRef);
        });
      }
    },
    showCatalog(newVal, oldVal) {
      if (newVal) {
        this.catalogFixed = false;
        this.$nextTick(() => {
          this.$refs.catalogRef &&
            this.handleCataLogObserver(this.$refs.catalogRef);
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
}
</style>
