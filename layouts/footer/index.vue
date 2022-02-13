<template>
  <div class="footer">
    <p>
      博客已运行 {{ running ? running : '正在加载...' }}
      <span class="ani">(='◡'=)☆</span>
    </p>
    <p>托管于腾讯云 | 使用七牛云对象存储</p>
    <a href="http://beian.miit.gov.cn" target="__blank" class="beianhao"
      >粤ICP备19114467号
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      running: null,
    }
  },
  created() {
    this.runtime()
  },
  methods: {
    runtime() {
      setInterval(() => {
        // 格式化时分秒
        function format(n) {
          return n < 10 ? '0' + n : '' + n
        }
        const startday = new Date(2019, 8, 5, 11, 41, 3)
        const today = new Date()
        // 将返回的毫秒数转化为秒
        const res = (today - startday) / 1000
        const resDay = Math.floor(res / (24 * 60 * 60))
        const resHour = format(Math.floor((res % (24 * 60 * 60)) / (60 * 60)))
        const resMinute = format(
          Math.floor(((res % (24 * 60 * 60)) % (60 * 60)) / 60)
        )
        const resSecond = format(Math.floor(res % 60))
        const runtime =
          resDay + '天' + resHour + '时' + resMinute + '分' + resSecond + '秒'
        this.running = runtime
      }, 1000)
    },
  },
}
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
.footer {
  padding: 20px 10px;
  background: #232323;
  text-align: center;
  font-size: 12px;
  .beianhao {
    text-decoration: none;
    color: #666;
  }
  .ani {
    display: inline-block;
    animation: run 2s infinite linear;
  }
}
</style>
