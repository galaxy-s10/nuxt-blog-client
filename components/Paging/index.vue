<template>
  <div class="paging-cpt-wrap">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="count"
      :page-size="pageSize"
      :current-page="nowPage"
      :pager-count="5"
      :hide-on-single-page="false"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: ['count', 'nowPage', 'pageSize'],
  data() {
    return {};
  },
  computed: {},
  methods: {
    currentChange(nowPage) {
      this.$emit('currentChange', nowPage);
      scrollTo({ top: 0 });
    },
  },
};
</script>

<style lang="scss" scoped>
.paging-cpt-wrap {
  text-align: center;
}
</style>
