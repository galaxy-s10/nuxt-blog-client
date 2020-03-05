<template>
  <div class="article">
    <transition>
      <!-- <router-view /> -->
      <nuxt />
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    key() {
      console.log(this.$route.path)
      return this.$route.path;
    }
  }
};
</script>

<style scoped>
.v-enter {
  transform: translateX(-10px);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s ease;
}
</style>