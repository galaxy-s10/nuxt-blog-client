<template>
  <div>
    <!-- 分页 -->
    <div style="text-align:center">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pagesize"
        :current-page="nowpage"
        @current-change="currentchange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: ["total", "pagesize"],
  data() {
    return {
      // total: 0,
      // pagesize: 3
    };
  },
  methods: {
    currentchange(nowpage) {
      this.$emit('currentchange', nowpage)
      // this.articlepage(this.pagesize, nowpage);
    }
  },
  computed:{
    nowpage(){
      return this.$store.state.article.nowpage;
    }
  }
};
</script>

<style scoped>
</style>