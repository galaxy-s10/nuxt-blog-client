<template>
  <div
    v-if="isMobile"
    ref="dndRef"
    :style="{ zIndex: zIndex }"
    @touchstart="handleStart"
    @touchend="handleEnd"
  >
    <slot></slot>
  </div>
  <div
    v-else
    ref="dndRef"
    :style="{ zIndex: zIndex }"
    @mousedown="handleStart"
    @mouseup="handleEnd"
  >
    <slot></slot>
  </div>
</template>

<script>
import { isMobile, throttle } from 'billd-utils';

export default {
  components: {},
  props: {
    // 放下的时候dnd距离上下左右边的距离
    margin: {
      type: Object,
      require: true,
      default() {
        return { top: 50, right: 25, bottom: 30, left: 20 };
      },
    },
    zIndex: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      isMobile: false,
      dndRef: null,
      isDown: false, // 是否按下
      startPosition: { x: 0, y: 0 }, // 开始按下dnd的位置
      position: { left: 0, top: 0 }, // 当前dnd的位置
      handleMove: throttle(this.move, 5, true),
      handleResize: throttle(this.handleEnd, 50, true),
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.isMobile = isMobile();
    this.changeRect();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy(){
    window.document.removeEventListener('mousemove', this.handleMove);
  },
  methods: {
    throttle,
    changeRect() {
      const slot = this.$slots.default[0].elm;
      this.dndRef = this.$refs.dndRef;
      if (this.dndRef.style.width || this.dndRef.style.height) {
        this.dndRef.style.removeProperty('width');
        this.dndRef.style.removeProperty('height');
        setTimeout(() => {
          this.dndRef.style.width = `${slot.getBoundingClientRect().width}px`;
          this.dndRef.style.height = `${slot.getBoundingClientRect().height}px`;
        }, 0);
      } else {
        this.dndRef.style.width = `${slot.getBoundingClientRect().width}px`;
        this.dndRef.style.height = `${slot.getBoundingClientRect().height}px`;
      }
      setTimeout(() => {
        this.handleEnd();
      });
    },
    move(event) {
      // 禁用默认事件，让需要滑动的地方滑动，不需要滑动的地方禁止滑动。
      event.preventDefault();
      if (!this.dndRef) return;
      if (!this.isDown) return;
      if (event.targetTouches) {
        this.position.top = `${
          event.targetTouches[0].pageY - this.startPosition.y
        }px`;
        this.position.left = `${
          event.targetTouches[0].pageX - this.startPosition.x
        }px`;
      } else {
        this.position.top = `${event.pageY - this.startPosition.y}px`;
        this.position.left = `${event.pageX - this.startPosition.x}px`;
      }
      this.dndRef.style.top = this.position.top;
      this.dndRef.style.left = this.position.left;
    },
    handleStart(event) {
      if (!this.dndRef) return;
      window.document.addEventListener('mousemove', this.handleMove);
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
      this.startPosition.x = x;
      this.startPosition.y = y;
    },
    handleEnd() {
      if (!this.dndRef) return;
      window.document.removeEventListener('mousemove', this.handleMove);
      this.isMobile = isMobile();
      this.isDown = false;
      const rect = this.dndRef.getBoundingClientRect();
      const clientWidth = window.document.documentElement.clientWidth;
      const clientHeight = window.document.documentElement.clientHeight;
      const transition = 500;
      this.dndRef.style.transition = `all ${transition / 1000}s ease`;
      if (rect.bottom > clientHeight - this.margin.bottom) {
        // 底部小于margin.bottom的时候
        const top = `${clientHeight - this.margin.bottom - rect.height}px`;
        this.dndRef.style.top = top;
        this.position.top = top;
      }
      if (rect.top <= this.margin.top) {
        // 顶部小于margin.top的时候
        const top = `${this.margin.top}px`;
        this.dndRef.style.top = top;
        this.position.top = top;
      }
      if (rect.x + rect.width / 2 > clientWidth / 2) {
        // 贴在右边
        const left = `${clientWidth - this.margin.right - rect.width}px`;
        this.dndRef.style.left = left;
        this.position.left = left;
      } else {
        // 贴在左边
        const left = `${this.margin.left}px`;
        this.dndRef.style.left = left;
        this.position.left = left;
      }
      setTimeout(() => {
        this.dndRef.style.removeProperty('transition');
      }, transition);
    },
  },
};
</script>

<style lang="scss" scoped></style>
