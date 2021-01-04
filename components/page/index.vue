<template>
  <div>
    <!-- 分页 -->
    <div style="text-align: center">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        :page-size="pageSize"
        :current-page="nowPage"
        :pager-count="5"
        @current-change="currentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: "",
    nowPage: "",
    pageSize: "",
  },
  data() {
    return {};
  },
  methods: {
    currentChange(nowPage) {
      this.$emit("currentChange", nowPage);
    },
  },
  computed: {
    // nowPage() {
    //   return this.$store.state.article.nowPage;
    // },
  },
};
</script>

<style scoped></style>
