<template>
  <el-dialog
    title="公告"
    :visible="dialogVisible"
    :before-close="handleClose"
    :width="dialogWidth"
    :top="dialogTop"
  >
    <AsyncRenderMarkdownCpt
      v-if="frontendData"
      :md="frontendData.home_modal_content"
    ></AsyncRenderMarkdownCpt>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="dialogVisible = false"
      >
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {
    AsyncRenderMarkdownCpt: () =>
      import('@/components/RenderMarkdown/index.vue'),
  },
  props: {},
  data() {
    return {
      dialogWidth: '500px',
      dialogTop: '30vh',
      dialogVisible: false,
    };
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData;
    },
  },
  watch: {},
  created() {},
  mounted() {
    const d = window.pageXOffset || document.documentElement.offsetWidth;
    if (d <= 414) {
      this.dialogWidth = '80%';
    }
    this.dialogVisible = this.frontendData.allow_home_modal === '1';
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
.el-dialog__wrapper {
  overflow: hidden;
}
</style>
