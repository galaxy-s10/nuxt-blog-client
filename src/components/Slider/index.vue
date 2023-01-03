<template>
  <div class="slider-wrap">
    <div
      v-for="(slider, index) in sliderList"
      :key="'slider-' + index"
      class="slider"
      :style="{ '--width': widthMap[index] / 2 }"
    >
      <div
        ref="containerRef"
        class="container"
      >
        <div
          v-for="(slide, indey) in slider"
          :key="'slide-' + indey"
          class="slide"
        >
          <img
            :src="JSON.parse(slide.user_info).avatar"
            alt=""
            class="avatar"
          />
          <span class="txt">
            <span class="username">
              {{ formatUsername(JSON.parse(slide.user_info).username) }}
            </span>
            <span>：</span>
            <span class="msg">{{ JSON.parse(slide.value).msg }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    list: {
      type: Array,
      require: true,
      default() {
        return [];
      },
    },
    row: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      sliderList: [],
      widthMap: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const res = [];
    const count = Math.ceil(this.list.length / 3);
    for (let i = 0, len = this.list.length; i < len; i += count) {
      const item = this.list.slice(i, i + count);
      res.push([...item, ...item]);
    }
    this.sliderList = res;
    this.$nextTick(() => {
      const widthMap = {};
      this.$refs.containerRef.forEach((container, index) => {
        for (let i = 0; i < container.children.length; i += 1) {
          const slideList = container.children;
          for (let y = 0; y < slideList.length; y += 1) {
            const slide = slideList[y];
            if (index === i) {
              widthMap[index] = widthMap[index] || 0;
              widthMap[index] += slide.getBoundingClientRect().width;
            }
          }
        }
      });
      this.widthMap = widthMap;
    });
  },
  methods: {
    formatUsername(val) {
      if (val.length > 4) {
        return `${val.slice(0, 4)}***`;
      }
      return val;
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes left-right {
  0% {
    transform: translateX(calc(var(--width) * -1px));
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes right-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(var(--width) * -1px));
  }
}
.slider-wrap {
  .slider {
    overflow-x: scroll;

    @extend %hideScrollbar;

    &:nth-child(2n) {
      .container {
        animation: left-right 10s linear infinite;
      }
    }
    &:nth-child(2n-1) {
      .container {
        animation: right-left 10s linear infinite;
      }
    }

    .container {
      display: flex;

      .slide {
        // line-height: 40px;
        // display: inline-block;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        box-sizing: border-box;
        padding-right: 30px;
        height: 40px;
        .avatar {
          margin-right: 4px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .txt {
          display: flex;
          align-items: center;
          font-size: 14px;
          .username {
            display: inline-block;
            // width: 70px;
          }
          .msg {
            display: inline-block;
            max-width: 150px;

            @extend %singleEllipsis;
          }
        }
      }
    }
  }
}
</style>
