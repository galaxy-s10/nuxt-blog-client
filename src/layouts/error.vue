<template>
  <div>
    <div v-if="error.statusCode === 404">页面未找到</div>
    <div v-else>未知错误，{{ error }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  layout: 'blog',
  props: ['error'],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
