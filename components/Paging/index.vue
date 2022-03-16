<template>
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
</template>

<script>
export default {
  props: ['count', 'nowPage', 'pageSize'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    currentChange(nowPage) {
      this.$emit('currentChange', nowPage)
    },
  },
}
</script>

<style scoped></style>
