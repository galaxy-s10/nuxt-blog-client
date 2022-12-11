<template>
  <div
    ref="dndRef"
    @touchstart="handleStart"
    @touchmove="handleMove"
    @touchend="handleEnd"
    @mousedown="handleStart"
    @mousemove="handleMove"
    @mouseup="handleEnd"
  >
    <slot></slot>
  </div>
</template>

<script>
import { throttle } from 'billd-utils';

export default {
  components: {},
  props: {
    margin: {
      type: Number,
      require: true,
      default: 10,
    },
  },
  data() {
    return {
      dndRef: null,
      offset: { x: 0, y: 0 },
      handleMove: throttle(this.move, 10, true),
      isDown: false, // 是否按下
      top: '0',
      left: '0',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.dndRef = this.$refs.dndRef;
    window.addEventListener('resize', () => {
      this.touchend();
    });
  },
  methods: {
    throttle,
    move(event) {
      // 禁用默认事件，让需要滑动的地方滑动，不需要滑动的地方禁止滑动。
      event.preventDefault();
      if (!this.dndRef) return;
      if (!this.isDown) return;
      if (event.targetTouches) {
        this.top = `${event.targetTouches[0].pageY - this.offset.y}px`;
        this.left = `${event.targetTouches[0].pageX - this.offset.x}px`;
      } else {
        this.top = `${event.pageY - this.offset.y}px`;
        this.left = `${event.pageX - this.offset.x}px`;
      }
      this.dndRef.style.top = this.top;
      this.dndRef.style.left = this.left;
    },
    handleStart(event) {
      if (!this.dndRef) return;
      this.isDown = true;
      let x = 0;
      let y = 0;
      if (event.targetTouches) {
        x =
          event.targetTouches[0].pageX - this.dndRef.getBoundingClientRect().x;
        y =
          event.targetTouches[0].pageY - this.dndRef.getBoundingClientRect().y;
      } else {
        x = event.pageX - this.dndRef.getBoundingClientRect().x;
        y = event.pageY - this.dndRef.getBoundingClientRect().y;
      }
      this.offset.x = x;
      this.offset.y = y;
    },
    handleEnd() {
      if (!this.dndRef) return;
      this.isDown = false;
      const rect = this.dndRef.getBoundingClientRect();
      const width = window.document.documentElement.clientWidth;
      this.dndRef.style.transition = 'all .5s ease';
      if (rect.x + rect.width / 2 > width / 2) {
        setTimeout(() => {
          this.dndRef.style.left = `${width - this.margin - rect.width}px`;
          this.left = `${width - this.margin - rect.width}px`;
        }, 0);
      } else {
        setTimeout(() => {
          this.dndRef.style.left = `${this.margin}px`;
          this.left = `${this.margin}px`;
        }, 0);
      }
      setTimeout(() => {
        this.dndRef.style.removeProperty('transition');
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped></style>
