<template>
  <div class="plum-wrap">
    <canvas v-show="switchValue" ref="Plum" @click="refresh()" />
    <div class="switch">
      <span class="txt">梅花特效:</span>
      <el-switch v-model="switchValue" :width="35"></el-switch>
    </div>
  </div>
</template>

<script>
const branchLength = 7
export default {
  components: {},
  props: [],
  data() {
    return {
      switchValue: true,
      width: 600,
      height: 600,
      ctx: null,
      branchLength, // 左右分支长度
      initLength: 7, // 最初的根分支长度
      branchRandom: 0.5, // 左右分支的概率范围，0-1，值越大每次产生分支的概率就越大
      leftBranchLengthRandom: Math.random() * branchLength - branchLength / 4, // 左分支长度的随机值
      rightBranchLengthRandom: Math.random() * branchLength - branchLength / 4, // 右分支长度的随机值
      leftBranchAngleRandom: Math.random() * 0.3, // 左分支角度的随机值
      rightBranchAngleRandom: Math.random() * 0.3, // 右分支角度的随机值
      queue: [],
      childQueue: [],
      framesCount: 0,
      initDepth: 4,
      r90: Math.PI / 2,
      r180: Math.PI,
      strokeColor: '#e0e0e0',
      fps: 4,
    }
  },
  computed: {},
  watch: {
    switchValue(newVal) {
      newVal && this.refresh()
    },
  },
  created() {},
  mounted() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.$refs.Plum.style.width = this.width + 'px'
    this.$refs.Plum.style.height = this.height + 'px'
    this.$refs.Plum.width = this.width
    this.$refs.Plum.height = this.height
    const canvas = this.$refs.Plum
    this.ctx = canvas.getContext('2d')
    // this.init({ x: 0, y: Math.random() * this.height });
    // this.init({ x: this.width, y: Math.random() * this.height });
    // this.init({ x: this.width / 2, y: this.height });
    this.handleStart()
    this.startFrame()
  },
  methods: {
    init(position, angle = -Math.PI / 2) {
      this.step({
        start: { x: position.x, y: position.y }, // 这个点扎在地上的根
        length: this.initLength,
        angle,
      })
    },
    refresh() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.queue = []
      this.handleStart()
    },
    handleStart() {
      this.childQueue = [
        () => this.init({ x: Math.random() * this.width, y: 0 }, this.r90), // 上边
        () =>
          this.init(
            { x: Math.random() * this.width, y: this.height },
            -this.r90
          ), // 下边
        () => this.init({ x: 0, y: Math.random() * this.height }, 0), // 左边
        () =>
          this.init(
            { x: this.width, y: Math.random() * this.height },
            this.r180
          ), // 右边
      ]
      if (window.innerWidth < 500) {
        this.childQueue = this.childQueue.slice(0, 2)
      }
      this.childQueue.forEach((fn) => fn())
    },
    getEndPoin(start, length, angle) {
      return {
        x: start.x + length * Math.cos(angle),
        y: start.y + length * Math.sin(angle),
      }
    },
    /**
     * start:{x:x值,y:y值}
     * length:长度
     * angle:角度
     * 根据起点、长度、角度，计算出终点，
     * 然后将起点(start)和终点(end)进行画线（连线）。
     */
    drawBranch({ start, length, angle }) {
      const end = this.getEndPoin(start, length, angle)
      this.drawLine(start, end)
    },

    step(startPoin, depth = 0) {
      const end = this.getEndPoin(
        startPoin.start,
        startPoin.length,
        startPoin.angle
      )

      if (
        startPoin.start.x < -10 ||
        startPoin.start.x > this.width + 10 ||
        startPoin.start.y < -10 ||
        startPoin.start.y > this.height + 10
      ) {
        // 超出屏幕一定范围就return
        return
      }
      this.drawBranch(startPoin)
      if (depth < this.initDepth || Math.random() < this.branchRandom) {
        const length = this.branchLength + this.leftBranchLengthRandom
        const angle = startPoin.angle + this.leftBranchAngleRandom
        this.queue.push(() =>
          this.step(
            {
              start: end,
              length,
              angle,
            },
            depth + 1
          )
        )
      }
      if (depth < this.initDepth || Math.random() < this.branchRandom) {
        const length = this.branchLength + this.rightBranchLengthRandom
        const angle = startPoin.angle - this.rightBranchAngleRandom
        this.queue.push(() =>
          this.step(
            {
              start: end,
              length,
              angle,
            },
            depth + 1
          )
        )
      }
    },
    frame() {
      const tasks = [...this.queue]
      this.queue.length = 0
      tasks.forEach((fn) => fn())
    },
    startFrame() {
      requestAnimationFrame(() => {
        this.framesCount += 1
        if (this.framesCount % this.fps === 0) {
          this.frame()
        }
        this.startFrame()
      })
    },

    drawLine(startPoin, endPoin) {
      // 这是一段使用 lineTo 方法的简单的代码片段。 使用 beginPath() 绘制路径的起始点， 使用 moveTo()移动画笔， 使用 stroke() 方法真正地画线。
      this.ctx.strokeStyle = this.strokeColor
      this.ctx.beginPath()
      this.ctx.moveTo(startPoin.x, startPoin.y)
      this.ctx.lineTo(endPoin.x, endPoin.y)
      this.ctx.stroke()
    },
  },
}
</script>

<style lang="scss" scoped>
.plum-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  pointer-events: none;
  .switch {
    position: fixed;
    top: 150px;
    right: 10px;
    pointer-events: auto;

    .txt {
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>
