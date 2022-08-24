<template>
  <div class="fix-type-wrapper" :class="{ show: visible }">
    <ul class="type-wrapper">
      <li @click="all()">全部</li>
      <li
        v-for="(item, index) in typeList"
        :key="index"
        @click="changeType(item.id)"
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
    };
  },
  computed: {
    typeList() {
      return this.$store.state.type.typeList;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.headershow);
  },
  destroyed() {
    window.removeEventListener('scroll', this.headershow);
  },
  methods: {
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop > height;
    },
    changeType(typeId) {
      this.$store.commit('type/changeTypeId', `${typeId}`);
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    all() {
      if (this.$store.state.type.typeId) {
        this.$store.commit('type/changeTypeId', '');
      }
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

/* 响应式布局,大于540px */
@media screen and (min-width: 540px) {
  .show {
    transform: translateY(-70px);
  }
}
.dark {
  .fix-type-wrapper {
    background: $theme-color3;
  }
}
.fix-type-wrapper {
  position: fixed;
  top: 70px;
  left: 0;
  z-index: 99;
  width: 100%;
  border-bottom: 1px solid $theme-color4;
  background-color: $theme-color6;
  .type-wrapper {
    margin: 0 auto;
    padding: 0;
    height: 40px;
    color: $theme-color1;
    line-height: 40px;
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
</style>
