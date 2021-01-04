<template>
  <div class="fixedd" :class="{ hiddenMusic: hiddenMusic }">
    <div class="songWrapper">
      <div class="songText">
        <div class="textItem">{{ songList[currentIndex].name }}</div>
        <div class="textItem">{{ songList[currentIndex].author }}</div>
      </div>
      <div class="songBar">
        <div class="songBarItem" ref="bar">
          <div
            :style="{ width: nowTime * (100 / duration1) + '%' }"
            class="currentTime"
          ></div>
        </div>
        <div class="text">{{ duration2(nowTime) }}/{{ duration2(duration) }}</div>
      </div>
      <div class="songImg1" :class="{ disk_play: start }">
        <div class="songImg2">
          <img
            :src="songList[currentIndex].img"
            alt
            width="90"
            height="90"
            class="songImg"
            ref="disk"
            :style="{ transform: matrix }"
            @click="showMusic"
          />
        </div>
      </div>
      <div class="songControl">
        <div class="pre" @click="preSong"></div>
        <div :class="!start ? 'start' : 'stop'" @click="switchBtn()"></div>
        <div class="next" @click="nextSong"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      hiddenMusic: false,
      matrix: "",
      nowDeg: 0,
      audio: null,
      songLink: null,
      start: false,
      duration: 0,
      duration1: 0,
      nowTime: 0,
      currentIndex: 0,
      songList: [],
      // songList: [
      //   {
      //     name: "花 が とぶ 飛ぶ",
      //     author: "邱有句 / 李德奎",
      //     img: "https://img.cdn.zhengbeining.com/song7.jpg",
      //     url: "https://img.cdn.zhengbeining.com/1609599956810song2.mp3",
      //   },
      //   {
      //     name: "云村的告别",
      //     author: "邱有句",
      //     img: "https://img.cdn.zhengbeining.com/song6.jpg",
      //     url: "https://img.cdn.zhengbeining.com/song6.mp3",
      //   },
      //   {
      //     name: "Cubi - BingBian病变钢琴版",
      //     author: "Kirito潇轩; 文武贝",
      //     img: "https://img.cdn.zhengbeining.com/song2.jpg",
      //     url: "https://img.cdn.zhengbeining.com/song2.mp3",
      //   },
      //   {
      //     name: "僕らの手には何もないけど、",
      //     author: "RAM WIRE",
      //     img: "https://img.cdn.zhengbeining.com/song1.jpg",
      //     url: "https://img.cdn.zhengbeining.com/song1.mp3",
      //   },
      //   {
      //     name: "山海皆可平",
      //     author: "CMJ",
      //     img: "https://img.cdn.zhengbeining.com/song3.jpg",
      //     url: "https://img.cdn.zhengbeining.com/song3.mp3",
      //   },
      //   {
      //     name: "所念皆星河",
      //     author: "CMJ",
      //     img: "https://img.cdn.zhengbeining.com/song4.jpg",
      //     url: "https://img.cdn.zhengbeining.com/song4.mp3",
      //   },
      //   {
      //     name: "蜗居背景音乐",
      //     author: "群星",
      //     img: "https://img.cdn.zhengbeining.com/song5.jpg",
      //     url: "https://img.cdn.zhengbeining.com/song5.mp3",
      //   },
      // ],
    };
  },
  computed: {
    duration2(x) {
      return (x) => this.formatTime(x);
    },
  },
  async fetch() {
    let res = await this.$axios.$get(`/api/music/pageList`, {
      params: { nowPage: 1, pageSize: 10 },
    });
    this.songList = res.rows;
  },
  mounted() {
    const d = window.pageXOffset || document.documentElement.offsetWidth;
    if (d <= 375) {
      this.hiddenMusic = true;
    }
    window.addEventListener("resize", () => {
      const offsetWidth = window.pageXOffset || document.documentElement.offsetWidth;
      if (offsetWidth <= 375) {
        if (this.hiddenMusic != true) {
          this.hiddenMusic = true;
        }
      } else {
        if (this.hiddenMusic != false) {
          this.hiddenMusic = false;
        }
      }
    });

    this.audio = new Audio();
    this.audio.src = this.songList[0].url;
    let timer = setInterval(() => {
      if (!isNaN(this.audio.duration)) {
        this.duration = this.audio.duration;
        this.duration1 = this.audio.duration;
        clearInterval(timer);
      }
    }, 100);

    this.audio.addEventListener("timeupdate", () => {
      this.nowTime = this.audio.currentTime;
      if (this.nowTime == this.duration1) {
        this.nextSong();
      }
    });
    this.$refs.bar.addEventListener("click", (e) => {
      setTimeout(() => {
        this.nowTime = (e.offsetX / 180) * this.duration1;
        this.audio.currentTime = this.nowTime;
      }, 100);
    });
  },
  methods: {
    showMusic() {
      this.hiddenMusic = !this.hiddenMusic;
    },
    formatTime(t) {
      var h = parseInt(t / 3600);
      h = h < 10 ? "0" + h : h;
      var m = parseInt((t % 3600) / 60);
      m = m < 10 ? "0" + m : m;
      var s = parseInt(t % 60);
      s = s < 10 ? "0" + s : s;
      // return h + ":" + m + ":" + s;
      return m + ":" + s;
    },
    switchBtn() {
      this.start = !this.start;
      if (this.start == true) {
        this.duration = this.audio.duration;
        this.duration1 = this.audio.duration;
        if (this.nowTime != 0) {
          this.audio.currentTime = this.nowTime;
        }
        this.audio
          .play()
          .then((res) => {})
          .catch((err) => {});
      } else {
        this.stopRotate();
        this.audio.pause();
        this.audio.currentTime = this.nowTime;
      }
    },
    // 切歌
    changeSong(index) {
      this.matrix = "";
      this.start = false;
      setTimeout(() => {
        this.start = true;
        const styles = [...document.styleSheets];
        styles.forEach((style) => {
          const rules = [...style.cssRules];
          rules.forEach((rule) => {
            if (rule.type === rule.KEYFRAMES_RULE && rule.name === "rotate1") {
              rule.cssRules[0].style.transform = `rotate(0deg)`;
              rule.cssRules[1].style.transform = `rotate(360deg)`;
              // rule.cssRules[0].style.transform = `rotate(${-this.nowDeg}deg)`;
              // rule.cssRules[1].style.transform = `rotate(${360 -
              //   this.nowDeg}deg)`;
            }
          });
        });
        this.audio.src = this.songList[index].url;
        let timer = setInterval(() => {
          if (!isNaN(this.audio.duration)) {
            this.duration = this.audio.duration;
            this.duration1 = this.audio.duration;
            clearInterval(timer);
          }
        }, 100);
        this.audio
          .play()
          .then((res) => {})
          .catch((err) => {});
      }, 500);
    },
    preSong() {
      if (this.currentIndex == 0) {
        this.currentIndex = this.songList.length - 1;
      } else {
        this.currentIndex--;
      }
      this.audio.pause();
      if (this.start == false) {
        this.start = !this.start;
      }
      this.changeSong(this.currentIndex);
    },
    nextSong() {
      if (this.currentIndex < this.songList.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
      this.changeSong(this.currentIndex);
    },
    // 停止转盘转动
    stopRotate() {
      var currentMatrix = window.getComputedStyle(this.$refs.disk).transform;
      function getmatrix(a, b, c, d, e, f) {
        var aa = Math.round((180 * Math.asin(a)) / Math.PI);
        var bb = Math.round((180 * Math.acos(b)) / Math.PI);
        var cc = Math.round((180 * Math.asin(c)) / Math.PI);
        var dd = Math.round((180 * Math.acos(d)) / Math.PI);
        var deg = 0;
        if (aa == bb || -aa == bb) {
          deg = dd;
        } else if (-aa + bb == 180) {
          deg = 180 + cc;
        } else if (aa + bb == 180) {
          deg = 360 - cc || 360 - dd;
        }
        return deg >= 360 ? 0 : deg;
        //return (aa+','+bb+','+cc+','+dd);
      }
      this.matrix = currentMatrix;
      var res = currentMatrix.split("(")[1].split(")")[0].split(",");
      var rotateDeg = getmatrix(res[0], res[1], res[2], res[3], res[4], res[5]);
      this.nowDeg = rotateDeg;
      const styles = [...document.styleSheets];
      styles.forEach((style) => {
        const rules = [...style.cssRules];
        rules.forEach((rule) => {
          if (rule.type === rule.KEYFRAMES_RULE && rule.name === "rotate1") {
            rule.cssRules[0].style.transform = `rotate(${rotateDeg}deg)`;
            rule.cssRules[1].style.transform = `rotate(${rotateDeg + 360}deg)`;
          }
        });
      });
    
    
    },
  },
};
</script>

<style>
@keyframes rotate1 {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<style scoped>
.hiddenMusic .songWrapper {
  background-color: transparent !important;
  box-shadow: none !important;
}
.hiddenMusic .songText,
.hiddenMusic .songBar,
.hiddenMusic .songControl {
  display: none;
  background-color: transparent !important;
  box-shadow: none !important;
}
.hiddenMusic .songImg1 {
  position: absolute;
  left: 165px;
}
.currentTime {
  height: 10px;
  background-color: #53a8ffc4;
  border-radius: 10px;
  transition: all 0.2s linear;
}
.songBar {
  width: 100%;
  height: 15px;
  position: absolute;
  display: flex;
  justify-content: space-around;
  bottom: 0;
  border-radius: 10px;
}
.songBarItem {
  display: inline-block;
  width: 180px;
  height: 10px;
  background-color: #f6eaf3;
  margin-top: 1px;
  border-radius: 10px;
}
.songBarItem:hover {
  cursor: pointer;
}
.text {
  display: inline-block;
  width: 22%;
  height: 10px;
  font-size: 10px;
}
.disk_play .songImg {
  animation: rotate1 6s infinite linear;
}
.fixedd {
  position: fixed;
  bottom: 90px;
  right: 10px;
}
.songWrapper {
  position: relative;
  width: 250px;
  height: 80px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12), 0 30px 20px rgba(95, 23, 100, 0.2);
  background-color: white;
  border-radius: 10px;
}
.songText {
  position: absolute;
  width: 230px;
  height: 50px;
  border-radius: 5px;
  padding-top: 4px;
  top: -40%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.5);
}
.textItem {
  padding-left: 45%;
  font-size: 9px;
}
.textItem:nth-child(1) {
  font-size: 9px;
  font-weight: 700;
}
.songImg2 {
  position: relative;
}
.songImg2:hover {
  cursor: pointer;
}
.songImg1 {
  position: absolute;
  width: 90px;
  height: 90px;
  top: -45px;
  left: 10px;
  transition: all 0.3s linear;
}
.songImg {
  position: relative;
  background-color: black;
  box-shadow: 0px 10px 10px -4px rgba(122, 103, 103, 0.8);
  /* box-shadow: 0px 25px 10px -4px rgba(122, 103, 103, 0.8); */
  width: 90px;
  height: 90px;
  border-radius: 50%;
}
.songImg1::after {
  content: "";
  width: 10px;
  height: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-image: linear-gradient(45deg, #fff, #dabad1);
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}
.songControl {
  position: absolute;
  right: -8px;
  display: flex;
  justify-content: space-around;
  /* background-color: blue; */
  width: 150px;
  height: 60px;
}
.pre,
.next,
.stop,
.start {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  top: 50%;
  transform: translateY(-30%);
}
/* .start,
.stop {
  top: 47%;
} */
.pre,
.next,
.stop,
.start:hover {
  cursor: pointer;
}
.pre:hover {
  color: white;
  background-color: #717070;
}
.next:hover {
  color: white;
  background-color: #717070;
}
.stop:hover {
  color: white;
  background-color: #717070;
}
.start:hover {
  color: white;
  background-color: #717070;
}
.start::after:hover {
  border-color: transparent transparent transparent white;
}

.pre::before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 12px;
  border-style: solid;
  border-width: 5px 5px 5px 0px;
  border-color: transparent #d9d9d9 transparent transparent;
}
.pre::after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 18px;
  border-style: solid;
  border-width: 5px 5px 5px 0px;
  border-color: transparent #d9d9d9 transparent transparent;
}
.next::before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 12px;
  border-style: solid;
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent #d9d9d9;
}
.next::after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 18px;
  border-style: solid;
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent #d9d9d9;
}

.stop::before {
  content: "";
  width: 4px;
  height: 18px;
  left: 10px;
  top: 6px;
  background-color: #d9d9d9;
  position: absolute;
}
.stop::after {
  content: "";
  width: 4px;
  height: 18px;
  left: 17px;
  top: 6px;
  background-color: #d9d9d9;
  position: absolute;
}
.start::after {
  content: "";
  width: 0;
  height: 0;
  left: 10px;
  top: 5px;
  position: absolute;
  border-style: solid;
  border-width: 10px 0 10px 15px;
  border-color: transparent transparent transparent #d9d9d9;
}
</style>
