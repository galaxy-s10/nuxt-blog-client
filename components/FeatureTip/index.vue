<template>
  <el-dialog
    title="近期"
    :visible="dialogVisible"
    :before-close="handleClose"
    :width="dialogWidth"
    :top="dialogTop"
  >
    最近都在对博客进行比较彻底的重构（前台、后台、后端），目的是把项目做到可读、可复用、可扩展、可维护，以及能有一定用户体验。
    <br />
    <br />
    虽然整个过程前端涉及的东西不多（或者说无关紧要），涉及最多的其实是业务方面（后端方面），但是整个重构过程中的引发的思考是非常锻炼的，
    期待重构后的结果~

    <!-- <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline> -->
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
  components: {},
  props: {},
  data() {
    return {
      dialogWidth: '500px',
      dialogTop: '30vh',
      dialogVisible: true,
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
    }
  },
  computed: {},
  created() {},
  mounted() {
    const d = window.pageXOffset || document.documentElement.offsetWidth
    if (d <= 414) {
      this.dialogWidth = '80%'
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
  },
}
</script>

<style scoped>
.el-dialog__wrapper {
  overflow: hidden;
}
</style>
