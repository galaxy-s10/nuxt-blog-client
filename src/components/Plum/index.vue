<template>
  <div class="plum-cpt-wrap">
    <canvas v-show="showPlum" ref="Plum" @click="refresh()" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  components: {},
  props: [],
  data() {
    return {
      width: 600,
      height: 600,
      ctx: null,
      branchLength: 6, // 左右分支长度
      branchRandom: 0.5, // 左右分支的概率范围，0-1，值越大每次产生分支的概率就越大
      queue: [],
      initDepth: 4,
      r90: Math.PI / 2,
      r180: Math.PI,
      strokeColor: '#ffc0cb80',
      depth: 0,
      stopped: false,
      interval: 1000 / 40,
      lastTime: 0,
      duration: 5000, // 特效持续时间
    };
  },
  computed: {
    ...mapState({
      showPlum(state) {
        return state.app.showPlum;
      },
    }),
  },
  watch: {
    showPlum(newVal) {
      if (newVal) {
        this.refresh();
      } else {
        this.depth = 0;
        this.queue.splice(0);
      }
    },
  },
  created() {},
  mounted() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.$refs.Plum.style.width = `${this.width}px`;
    this.$refs.Plum.style.height = `${this.height}px`;
    this.$refs.Plum.width = this.width;
    this.$refs.Plum.height = this.height;
    const canvas = this.$refs.Plum;
    this.ctx = canvas.getContext('2d');
    if (this.showPlum) {
      this.handleStep();
      this.handleFrame();
      let timer = null;
      timer = setTimeout(() => {
        this.queue.splice(0);
        clearTimeout(timer);
      }, this.duration);
    }
  },
  methods: {
    refresh() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.depth = 0;
      this.handleStep();
      this.handleFrame();
      let timer = null;
      timer = setTimeout(() => {
        this.queue.splice(0);
        clearTimeout(timer);
      }, this.duration);
    },
    handleStep() {
      this.queue.push(
        () => this.step(Math.random() * this.width, this.height, -this.r90), // 下边的梅花
        () => this.step(Math.random() * this.width, 0, this.r90), // 上边的梅花
        () => this.step(0, Math.random() * this.height, 0), // 左边的梅花
        () => this.step(this.width, Math.random() * this.height, -this.r180) // 右边的梅花
      );
      if (this.width < 500) {
        this.duration = 4500;
        this.queue = this.queue.slice(0, 2);
      }
    },
    getEndPoin(x, y, angle) {
      const length = this.branchLength;
      const y1 = length * Math.sin(angle); // 对边
      const x1 = length * Math.cos(angle); // 邻边
      return {
        x: x + x1,
        y: y + y1,
      };
    },
    drawBranch(startX, startY, end) {
      this.drawLine({ x: startX, y: startY }, end);
    },

    step(x, y, angle) {
      if (x < -50 || x > this.width + 50 || y < -50 || y > this.height + 50) {
        // 超出屏幕一定范围就return
        return;
      }

      // eslint-disable-next-line no-shadow
      const getEndPoin1 = (x, y, angle) => {
        // const length = this.branchLength
        const length = Math.random() * this.branchLength;
        // const length =
        //   this.branchLength +
        //   (Math.random() > 0.2 ? +Math.random() * 2 : -Math.random() * 2)
        const x1 = length * Math.cos(angle); // 邻边
        const y1 = length * Math.sin(angle); // 对边
        return {
          x: x + x1,
          y: y + y1,
        };
      };
      const end = getEndPoin1(x, y, angle);
      this.drawBranch(x, y, end);
      const rad1 = angle + Math.random() * (this.r180 / 12);
      const rad2 = angle - Math.random() * (this.r180 / 12);

      if (this.depth <= this.initDepth || Math.random() > this.branchRandom) {
        this.queue.push(() => this.step(end.x, end.y, rad1));
      }
      if (this.depth <= this.initDepth || Math.random() > this.branchRandom) {
        this.queue.push(() => this.step(end.x, end.y, rad2));
      }
    },
    frame() {
      this.stopped = false;
      if (performance.now() - this.lastTime < this.interval) {
        return;
      }
      const tasks = [...this.queue];
      this.queue.splice(0);
      this.depth += 1;

      this.lastTime = performance.now();
      if (!tasks.length) {
        this.stopped = true;
        return;
      }
      tasks.forEach((fn) => {
        fn();
      });
    },
    handleFrame() {
      requestAnimationFrame(() => {
        this.frame();
        // this.handleFrame()
        !this.queue.length && (this.stopped = true);
        this.queue.length && this.handleFrame();
      });
    },

    drawLine(startPoin, endPoin) {
      // 这是一段使用 lineTo 方法的简单的代码片段。 使用 beginPath() 绘制路径的起始点， 使用 moveTo()移动画笔， 使用 stroke() 方法真正地画线。
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.beginPath();
      this.ctx.moveTo(startPoin.x, startPoin.y);
      this.ctx.lineTo(endPoin.x, endPoin.y);
      this.ctx.stroke();
    },
  },
};
</script>

<style scoped>
.plum-cpt-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  pointer-events: none;
}
</style>
