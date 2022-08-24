<template>
  <div class="back-top-wrapper">
    <div
      v-if="toggle"
      :class="{ 'back-top': true, 'show-back-top': visible }"
      @click="handleTo"
    ></div>
    <div
      v-else
      :class="{ 'mini-back-top': true, 'show-mini-back-top': visible }"
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
      toggle: false,
    };
  },
  mounted() {
    this.handleResize();
    window.addEventListener('scroll', this.headershow);
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('scroll', this.headershow);
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleTo() {
      scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleResize() {
      const { width } = document.documentElement.getBoundingClientRect();
      this.toggle = width > 1200;
    },
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop > height;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

@keyframes move {
  0% {
    transform: translatey(0);
  }
  75% {
    transform: translatey(-10px);
  }
  100% {
    transform: translatey(0);
  }
}
.back-top-wrapper {
  .back-top {
    position: fixed;
    top: -100%;
    right: 10px;
    z-index: 100;
    width: 100px;
    height: 85%;
    background: url('@/assets/img/back_top.webp') no-repeat bottom;
    cursor: pointer;
    transition: all 0.5s;
    animation: move 3s infinite linear;
    &.show-back-top {
      top: -100px;
      transition: all 0.5s;
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
    &.show-mini-back-top {
      z-index: 100;
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>
