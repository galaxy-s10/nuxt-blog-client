<template>
  <div class="footer">
    <p>
      博客已正常运行 {{running?running:'正在加载...'}}
      <span class="ani">(='◡'=)☆</span>
    </p>
    <p>托管于阿里云(学生机) | 使用七牛云对象存储</p>
    <a href="http://www.beian.miit.gov.cn" target="__blank" class="bah">粤ICP备19114467号</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      running: null
    };
  },
  methods: {
    runtime: function() {
      setInterval(() => {
        // 格式化时分秒
        function format(n) {
          return n < 10 ? "0" + n : "" + n;
        }
        var startday = new Date(2019, 8, 5, 11, 41, 3);
        var today = new Date();
        // 将返回的毫秒数转化为秒
        var res = (today - startday) / 1000;
        // var res_day = Math.floor(res / (24 * 60 * 60));
        var res_day = Math.floor(res / (24 * 60 * 60));
        var res_hour = format(Math.floor((res % (24 * 60 * 60)) / (60 * 60)));
        var res_minute = format(
          Math.floor(((res % (24 * 60 * 60)) % (60 * 60)) / 60)
        );
        var res_second = format(Math.floor(res % 60));
        var runtime =
          res_day +
          "天" +
          res_hour +
          "时" +
          res_minute +
          "分" +
          res_second +
          "秒";
        this.running = runtime;
      }, 1000);
    }
  },
  created() {
    this.runtime();
  }
};
</script>

<style scoped>
.bah {
  text-decoration: none;
  color: #666;
}
p {
  margin: 0;
  padding: 0;
}
.ani {
  display: inline-block;
  animation: run 2s infinite linear;
}
@keyframes run {
  0% {
    /* transform: translateY(-10px) rotate(10deg); */
    /* transform: translateY(50px) rotate(45deg); */
    transform: rotate(15deg);
  }
  25% {
    transform: translateY(4px);
  }
  50% {
    /* transform: translateY(-2px) rotate(-45deg); */
    transform: rotate(-10deg);
  }
  75% {
    /* transform: translateY(-2px) rotate(-45deg); */
    transform: translateY(-4px);
  }
  100% {
    /* transform: translateY(-3px); */
    transform: rotate(15deg);
  }
}
</style>
