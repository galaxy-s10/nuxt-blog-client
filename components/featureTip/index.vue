<template>
  <div>
    <el-dialog
      title="最近更新"
      :visible="dialogVisible"
      :before-close="handleClose"
      :width="dialogWidth"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      dialogWidth: "50%",
      dialogVisible: true,
      activities: [
        {
          content: "新增申请友链功能",
          timestamp: "2021-03-03",
        },
        {
          content: "新增qq登录功能",
          timestamp: "2021-02-18",
        },
        {
          content: "新增文章目录功能",
          timestamp: "2021-02-10",
        },
        // {
        //   content: "新增访客模块",
        //   timestamp: "2021-02-02",
        // },
      ],
    };
  },
  created() {},
  mounted() {
    const d = window.pageXOffset || document.documentElement.offsetWidth;
    if (d <= 414) {
      this.dialogWidth = "80%";
    }
  },
  computed: {},
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
</style>