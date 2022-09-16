<template>
  <div class="back-top-wrap">
    <div
      :class="{ 'back-top': true, show: showBigBackTop && visible }"
      @click="handleTo"
    ></div>
    <div
      :class="{ 'mini-back-top': true, show: !showBigBackTop && visible }"
      @click="handleTo"
    >
      <span class="triangle" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      showBigBackTop: false,
    };
  },
  mounted() {
    this.handleResize();
    this.handleBackTop();
    window.addEventListener('scroll', this.handleBackTop);
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleBackTop);
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleTo() {
      scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleResize() {
      const offsetWidth =
        window.pageXOffset || document.documentElement.offsetWidth;
      this.showBigBackTop = offsetWidth >= 990;
    },
    handleBackTop() {
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop > 1200; // 向下滚动超过1200px才显示
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

@keyframes move {
  0% {
    top: 0;
  }
  75% {
    top: -30px;
  }
  100% {
    top: 0;
  }
}

.back-top-wrap {
  .back-top {
    position: fixed;
    top: -100%;
    right: 30px;
    z-index: 100;
    width: 70px;
    height: 700px;
    background: url('@/assets/img/back_top.webp') no-repeat bottom;
    cursor: pointer;
    transition: all 0.5s;
    transform: translateY(-100%);
    animation: move 3s infinite linear;

    &.show {
      top: 0;
      transform: translateY(0%);
    }
  }

  .mini-back-top {
    position: fixed;
    right: 30px;
    bottom: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: $theme-color6;
    box-shadow: 0 0 5px $theme-color2;
    text-align: center;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.5s;
    pointer-events: none;

    .triangle {
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      border: 7px solid transparent;
      border-bottom-color: $theme-color1;
      transform: translate(-50%, -90%);
    }
    &.show {
      z-index: 100;
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>
