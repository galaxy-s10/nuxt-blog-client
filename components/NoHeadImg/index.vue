<template>
  <div class="no-head-img">此处无图胜有图</div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
/* 响应式布局 - 小于 540px */
@media screen and (max-width: 540px) {
  .no-head-img {
    font-size: 18px !important;
  }
}
.no-head-img {
  text-align: center;
  height: 150px;
  line-height: 150px;
  font-size: 24px;
  user-select: none;
}
</style>
