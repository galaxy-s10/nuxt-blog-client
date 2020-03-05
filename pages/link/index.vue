<template>
  <div
    class="content"
    style="overflow:hidden;background:white;box-shadow:0 0 5px rgba(0,0,0,.1);padding:30px"
  >
    <h1 style="text-align:center;padding:10px">友链</h1>
    <el-divider></el-divider>
    <div style="text-align:center;margin-bottom:30px">欢迎大家交换友链！</div>
    <el-input
      type="textarea"
      resize="none"
      :rows="5"
      show-word-limit
      maxlength="200"
      v-model="content"
    ></el-input>
    <p style="text-align:right">
      <el-button type="primary" disabled>申请</el-button>
    </p>
    <div></div>
  </div>
</template>

<script>
export default {
  layout:'blog',
  data() {
    return {
      content: ""
    };
  },
  head() {
    return {
      title: '友链'
    };
  },
  methods: {},
  mounted() {}
};
</script>


<style>
</style>