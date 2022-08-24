<template>
  <div class="textarea-cpt-wrap">
    <el-input
      v-model="content"
      type="textarea"
      resize="none"
      :rows="5"
      show-word-limit
      maxlength="200"
    ></el-input>
    <span class="tip">支持markdown</span>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return { content: null };
  },
  computed: {},
  watch: {
    content(v, o) {
      this.$emit('contentChange', v, o);
    },
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style>
/* style在scoped环境下重写覆盖默认element样式不行，得去掉scoped */
.textarea-cpt-wrap .el-textarea__inner {
  padding-bottom: 20px;
}
</style>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.textarea-cpt-wrap {
  position: relative;
  .tip {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 6px 8px;
    color: $theme-color1;
    font-size: 14px;
    font-weight: bold;
  }
  .btn {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
