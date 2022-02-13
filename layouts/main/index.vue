<template>
  <div>
    <transition>
      <nuxt />
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>

<style lang="scss" scoped>
.v-enter {
  transform: translateX(-10px);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s ease;
}
</style>
