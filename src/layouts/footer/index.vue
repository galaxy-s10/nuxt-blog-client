<template>
  <div class="footer-wrap">
    <p>
      博客已运行 {{ runningTime ? runningTime : '正在加载...' }}
      <span class="ani">(='◡'=)☆</span>
    </p>
    <p class="fixed-powered">
      <span class="txt">Powered by</span>
      <span
        class="author"
        @click="jumpToUrl"
        >galaxy-s10</span
      >
    </p>
    <a
      href="http://beian.miit.gov.cn"
      target="__blank"
      class="beianhao"
    >
      粤ICP备19114467号-2
    </a>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { GITHUB_REPO } from '@/constant';
dayjs.extend(duration);

export default {
  data() {
    return {
      runningTime: null,
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  destroyed() {},
  methods: {
    jumpToUrl() {
      window.open(GITHUB_REPO);
    },
    init() {
      for (let i = 0; i < 1000; i += 1) {
        setInterval(() => {
          const startDate = dayjs('2019-09-01 00:00:00');
          const nowDate = dayjs();
          const res = dayjs
            .duration(nowDate - startDate)
            .format('Y年M个月D天HH小时mm分ss秒');
          this.runningTime = res;
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes run {
  0% {
    transform: rotate(15deg);
  }
  25% {
    transform: translateY(4px);
  }
  50% {
    transform: rotate(-10deg);
  }
  75% {
    transform: translateY(-4px);
  }
  100% {
    transform: rotate(15deg);
  }
}
.footer-wrap {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  .fixed-powered {
    width: 100%;
    border-radius: 10px;
    text-align: center;

    user-select: none;
    .txt {
    }
    .author {
      font-weight: bold;
      cursor: pointer;
    }
  }
  .beianhao {
    color: $theme-color5;
    text-decoration: none;
  }
  .ani {
    display: inline-block;
    animation: run 2s infinite linear;
  }
}
</style>
