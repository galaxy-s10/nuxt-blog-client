<template>
  <div class="content" style="overflow:hidden;background:white;box-shadow:0 0 5px rgba(0,0,0,.1);padding:30px">
    <h1 style="text-align:center;padding:10px">关于</h1>
    <el-divider></el-divider>
    <div>
      <h2>关于我</h2>
      <p style="text-indent:2em">
        喜欢计算机有关的事物,喜欢前端,励志成为一名前端攻城狮
        目前主要在学vue，本站也是用vue做的,其他语言稍有涉足,主力web方向,目前在朝着前端码农努力着.
      </p>
      <h2>关于本站</h2>
      <p
        style="text-indent:2em"
      >写了本站经历了两个个月左右,过程收获满满,之前也用过typecho,wrdpress等出色的博客开源系统,总觉得要自己从头开始写一个博客 正好我也在学vue，由此本博客就诞生了!</p>
      <h2>技术栈</h2>
      <p style="text-indent:2em">前端：vue全家桶，axios，tinymce，qiniu-js</p>
      <p style="text-indent:2em">后台：vue全家桶，vue-element-template，tinymce，qiniu-js</p>
      <p style="text-indent:2em">后端：node.js，mysql</p>
    </div>
  </div>
</template>

<script>
export default {
  layout:'blog',
  data() {
    return {};
  },
  head() {
    return {
      title: '关于'
    };
  },
};
</script>


<style>
</style>