<template>
  <div class="footer">
    <p>
      博客已运行 {{ runningTime ? runningTime : '正在加载...' }}
      <span class="ani">(='◡'=)☆</span>
    </p>
    <a href="http://beian.miit.gov.cn" target="__blank" class="beianhao">
      粤ICP备19114467号-2
    </a>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export default {
  data() {
    return {
      runningTime: null,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      setInterval(() => {
        const startDate = dayjs('2019-09-01 00:00:00')
        const nowDate = dayjs()
        const res = dayjs
          .duration(nowDate - startDate)
          .format('Y年M个月D天H小时m分s秒')
        this.runningTime = res
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

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
.footer {
  padding: 20px;
  text-align: center;
  font-size: 14px;
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
