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
      :md="frontendData.frontend_dialog_content"
    ></AsyncRenderMarkdownCpt>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {
    AsyncRenderMarkdownCpt: () => import('components/RenderMarkdown/index.vue'),
  },
  props: {},
  data() {
    return {
      dialogWidth: '500px',
      dialogTop: '30vh',
      dialogVisible: false,
      activities: [
        {
          content: '热门文章/最近更新切换',
          timestamp: '2021-03-16',
        },
        {
          content: '新增申请友链功能',
          timestamp: '2021-03-03',
        },
        {
          content: '新增qq登录功能',
          timestamp: '2021-02-18',
        },
        // {
        //   content: "新增文章目录功能",
        //   timestamp: "2021-02-10",
        // },
        // {
        //   content: "新增访客模块",
        //   timestamp: "2021-02-02",
        // },
      ],
    };
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData;
    },
  },
  watch: {
    frontendData() {
      this.dialogVisible = this.frontendData
        ? this.frontendData.frontend_dialog === 1
        : false;
    },
  },
  created() {},
  mounted() {
    const d = window.pageXOffset || document.documentElement.offsetWidth;
    if (d <= 414) {
      this.dialogWidth = '80%';
    }
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
