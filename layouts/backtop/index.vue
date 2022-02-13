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
    }
  },
  mounted() {
    this.handleResize()
    window.addEventListener('scroll', this.headershow)
    window.addEventListener('resize', this.handleResize)
  },
  destroyed() {
    window.removeEventListener('scroll', this.headershow)
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleTo() {
      scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleResize() {
      const { width } = document.documentElement.getBoundingClientRect()
      this.toggle = width > 1200
    },
    headershow() {
      // 头部高度为70px
      const height = 70
      const offsetTop = window.pageYOffset || document.documentElement.scrollTop
      this.visible = offsetTop > height
    },
  },
}
</script>

<style lang="scss" scoped>
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
    z-index: 999;
    width: 100px;
    height: 85%;
    background: url('~/assets/img/backTop.png') no-repeat bottom;
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
    visibility: hidden;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    opacity: 0;
    cursor: pointer;
    transition: all 1s;
    .triangle {
      position: relative;
      top: -5px;
      border: 7px solid transparent;
      border-bottom-color: #97dffd;
    }
    &.show-mini-back-top {
      z-index: 999;
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>
