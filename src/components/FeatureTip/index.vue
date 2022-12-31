<template>
  <div class="feature-tip-wrap">
    <el-dialog
      title="公告"
      :visible="dialogVisible"
      :before-close="handleClose"
      :width="dialogWidth"
      :top="dialogTop"
    >
      <AsyncRenderMarkdownCpt
        v-if="frontendData"
        :md="frontendData.home_modal_content.value"
      ></AsyncRenderMarkdownCpt>
      <div class="update-time">
        发布时间：{{ frontendData.home_modal_content.updated_at }}
      </div>
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
  </div>
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
    this.dialogVisible = this.frontendData.allow_home_modal.value === '1';
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.feature-tip-wrap {
  :deep(.el-dialog__wrapper) {
    overflow: hidden;
    font-size: 10px;
  }
  :deep(.el-dialog__body) {
    padding-bottom: 10px;
  }
  .update-time {
    text-align: right;
  }
}
</style>
