<template>
  <div :class="{ 'fix-type-wrapper': true, show: visible }">
    <ul class="type-wrapper">
      <li @click="all()">全部</li>
      <li
        v-for="(item, index) in articleTypeList"
        :key="index"
        @click="type(item.id)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    articleTypeList() {
      return this.$store.state.article.ArticleTypeList
    },
  },
  mounted() {
    window.addEventListener('scroll', this.headershow)
  },
  destroyed() {
    window.removeEventListener('scroll', this.headershow)
  },
  methods: {
    headershow() {
      // 头部高度为70px
      const height = 70
      const offsetTop = window.pageYOffset || document.documentElement.scrollTop
      this.visible = offsetTop > height
    },
    type(typeId) {
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
      this.$store.commit('article/changeNowPage', 1)
      this.$store.commit('article/changeTypeIds', typeId)
    },
    all() {
      if (this.$store.state.article.type_id) {
        this.$store.commit('article/changeNowPage', 1)
        this.$store.commit('article/changeTypeIds', '')
      }
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fix-type-wrapper {
  position: fixed;
  top: 70px;
  left: 0;
  z-index: 99;
  width: 100%;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  .type-wrapper {
    margin: 0 auto;
    padding: 0;
    height: 50px;
    color: #53a8ff;
    line-height: 50px;
    li {
      display: inline;
      margin-right: 8px;
      cursor: pointer;
    }
  }
}
.show {
  transition: all 0.5s;
  transform: translateY(-70px);
}

/* 响应式布局,大于540px */
@media screen and (min-width: 540px) {
  .show {
    transform: translateY(-70px);
  }
}
</style>
