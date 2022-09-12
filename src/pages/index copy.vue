<template>
  <div class="pages-wrap">
    main
    <!-- <MainCpt v-if="frontendData.frontend_shutdown === 2"></MainCpt> -->
    <!-- <div v-else>{{ frontendData.frontend_shutdown_content }}</div> -->
  </div>
</template>

<script>
import MainCpt from './main';
export default {
  components: { MainCpt },
  mixins: [],
  data() {
    return {};
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData;
    },
  },
};
</script>

<style lang="scss" scoped></style>
