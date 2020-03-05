<template>
  <div>
    <div v-show="toggle" :class="{show:1,backtop:visible}" @click="handleTo"></div>
    <div v-if="!toggle" :class="{minback:1,showminback:visible}" @click="handleTo">
      <span class="triangle" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      toggle: false
    };
  },
  methods: {
    handleTo() {
      scrollTo({ top: 0, behavior: "smooth" });
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
    }
  },
  created() {},
  mounted() {
    this.handleResize();
    window.addEventListener("scroll", this.headershow);
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("scroll", this.headershow);
    window.addEventListener("resize", this.handleResize);
  },
  computed: {}
};
</script>

<style scoped>
.triangle {
  border: 7px solid transparent;
  border-bottom-color: #97dffd;
  position: relative;
  top: -5px;
}
.show {
  position: fixed;
  top: -300px;
  right: 10px;
  width: 100px;
  height: 300px;
  background: url("../../assets/imgs/gotop.png") no-repeat bottom;
  z-index: 999;
  animation: move 3s infinite linear;
  cursor: pointer;
  transition: all 1s;
}
.backtop {
  top: 0;
  transition: all 1s;
}
.minback {
  position: fixed;
  background-color: #fff;
  text-align: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  right: 30px;
  bottom: 70px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: all 1s;
  cursor: pointer;
  visibility: hidden;
}
.showminback {
  opacity: 1;
  visibility: visible;
}
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
</style>