<template>
  <transition>
    <nuxt />
  </transition>
</template>

<script>
export default {}
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
