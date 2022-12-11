<template>
  <transition>
    <nuxt :class="{ padding: route !== '/' ? true : false }" />
  </transition>
</template>

<script>
export default {
  data() {
    return {
      route: '',
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.route = val.path;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-enter {
  // transform: translateX(-10px);
  margin-left: -15px;
  opacity: 0;
}
.v-enter-active {
  transition: all 0.3s;
}

/* 响应式布局 - 小于 540px */
@media screen and (max-width: 540px) {
  .padding {
    padding: 20px 10px !important;
  }
}

.padding {
  // overflow: hidden;
  padding: 30px;
  border: 1px solid $theme-color4;
  border-radius: 5px;
  background: $theme-color6;
}
</style>
