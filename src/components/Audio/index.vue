<template>
  <div class="audio-wrap">
    <div
      v-if="songList.length"
      class="music-wrap"
      :class="{ showMiniAudio: showMiniAudio, hiddenAudio: !showMusicAudio }"
    >
      <div class="song-wrapper">
        <div class="song-text">
          <div class="text-item">
            {{ songList[currentIndex] ? songList[currentIndex].name : '-' }}
          </div>
          <div class="text-item">
            {{ songList[currentIndex] ? songList[currentIndex].author : '-' }}
          </div>
        </div>
        <div class="song-bar">
          <div ref="bar" class="song-bar-item">
            <div
              :style="{ width: nowTime * (100 / duration1) + '%' }"
              class="currentTime"
            ></div>
          </div>
          <div class="text">
            {{ duration2(nowTime) }}/{{ duration2(duration) }}
          </div>
        </div>
        <div class="songImg1" :class="{ disk_play: start }">
          <div class="songImg2">
            <img
              ref="disk"
              :src="
                songList[currentIndex]
                  ? songList[currentIndex]['cover_pic']
                  : '-'
              "
              alt
              width="90"
              height="90"
              class="songImg"
              :style="{ transform: matrix }"
              @click="showMiniMusic"
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
    <div v-else>暂无音乐~</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      showMiniAudio: false,
      matrix: '',
      nowDeg: 0,
      audio: null,
      start: false,
      duration: 0,
      duration1: 0,
      nowTime: 0,
      currentIndex: 0,
      songList: [],
    };
  },
  computed: {
    ...mapState({
      showMusicAudio(state) {
        return state.app.showMusicAudio;
      },
    }),
    duration2() {
      return (x) => this.formatTime(x);
    },
  },
  async mounted() {
    const d = window.pageXOffset || document.documentElement.offsetWidth;
    if (d <= 414) {
      this.showMiniAudio = true;
    }
    window.addEventListener('resize', this.resizeFn);
    const { data } = await this.$myaxios.get(`/music/list`, {
      params: { nowPage: 1, pageSize: 10 },
    });
    this.songList = data.rows;
    if (!this.songList.length) return;
    this.audio = new Audio();
    this.audio.src = this.songList[0].audio_url;
    const timer = setInterval(() => {
      if (!isNaN(this.audio.duration)) {
        this.duration = this.audio.duration;
        this.duration1 = this.audio.duration;
        clearInterval(timer);
      }
    }, 100);

    const timer1 = setTimeout(() => {
      this.audio.addEventListener('timeupdate', () => {
        this.nowTime = this.audio.currentTime;
        if (this.nowTime === this.duration1) {
          this.nextSong();
        }
      });

      this.$refs.bar.addEventListener('click', (e) => {
        setTimeout(() => {
          this.nowTime = (e.offsetX / 170) * this.duration1;
          this.audio.currentTime = this.nowTime;
        }, 100);
      });
      clearTimeout(timer1);
    }, 0);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeFn);
  },
  methods: {
    resizeFn() {
      const offsetWidth =
        window.pageXOffset || document.documentElement.offsetWidth;
      if (offsetWidth <= 414) {
        this.showMiniAudio = true;
      } else {
        this.showMiniAudio = false;
      }
    },
    showMiniMusic() {
      this.showMiniAudio = !this.showMiniAudio;
    },
    formatTime(t) {
      let m = parseInt((t % 3600) / 60);
      m = m < 10 ? `0${m}` : m;
      let s = parseInt(t % 60);
      s = s < 10 ? `0${s}` : s;
      return `${m}:${s}`;
    },
    switchBtn() {
      this.start = !this.start;
      if (this.start === true) {
        this.duration = this.audio.duration;
        this.duration1 = this.audio.duration;
        if (this.nowTime !== 0) {
          this.audio.currentTime = this.nowTime;
        }
        this.audio
          .play()
          .then((res) => {})
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.stopRotate();
        this.audio.pause();
        this.audio.currentTime = this.nowTime;
      }
    },
    // 切歌
    changeSong(index) {
      this.matrix = '';
      this.start = false;
      setTimeout(() => {
        this.start = true;
        const styles = [...document.styleSheets];
        styles.forEach((style) => {
          const rules = [...style.cssRules];
          rules.forEach((rule) => {
            if (rule.type === rule.KEYFRAMES_RULE && rule.name === 'rotate1') {
              rule.cssRules[0].style.transform = `rotate(0deg)`;
              rule.cssRules[1].style.transform = `rotate(360deg)`;
              // rule.cssRules[0].style.transform = `rotate(${-this.nowDeg}deg)`;
              // rule.cssRules[1].style.transform = `rotate(${360 -
              //   this.nowDeg}deg)`;
            }
          });
        });
        this.audio.src = this.songList[index].audio_url;
        // const timer = setInterval(() => {
        //   if (!isNaN(this.audio.duration)) {
        //     this.duration = this.audio.duration
        //     this.duration1 = this.audio.duration
        //     clearInterval(timer)
        //   }
        // }, 100)
        this.audio
          .play()
          .then((res) => {})
          .catch((error) => {
            console.log(error);
          });
      }, 500);
    },
    preSong() {
      if (this.currentIndex === 0) {
        this.currentIndex = this.songList.length - 1;
      } else {
        this.currentIndex -= 1;
      }
      this.audio.pause();
      if (this.start === false) {
        this.start = !this.start;
      }
      this.changeSong(this.currentIndex);
    },
    nextSong() {
      if (this.currentIndex < this.songList.length - 1) {
        this.currentIndex += 1;
      } else {
        this.currentIndex = 0;
      }
      this.changeSong(this.currentIndex);
    },
    // 停止转盘转动
    stopRotate() {
      const currentMatrix = window.getComputedStyle(this.$refs.disk).transform;
      function getmatrix(a, b, c, d, e, f) {
        const aa = Math.round((180 * Math.asin(a)) / Math.PI);
        const bb = Math.round((180 * Math.acos(b)) / Math.PI);
        const cc = Math.round((180 * Math.asin(c)) / Math.PI);
        const dd = Math.round((180 * Math.acos(d)) / Math.PI);
        let deg = 0;
        if (aa === bb || -aa === bb) {
          deg = dd;
        } else if (-aa + bb === 180) {
          deg = 180 + cc;
        } else if (aa + bb === 180) {
          deg = 360 - cc || 360 - dd;
        }
        return deg >= 360 ? 0 : deg;
        // return (aa+','+bb+','+cc+','+dd);
      }
      this.matrix = currentMatrix;
      const res = currentMatrix.split('(')[1].split(')')[0].split(',');
      const rotateDeg = getmatrix(
        res[0],
        res[1],
        res[2],
        res[3],
        res[4],
        res[5]
      );
      this.nowDeg = rotateDeg;
      const styles = [...document.styleSheets];
      styles.forEach((style) => {
        const rules = [...style.cssRules];
        rules.forEach((rule) => {
          if (rule.type === rule.KEYFRAMES_RULE && rule.name === 'rotate1') {
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

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.audio-wrap {
  .hiddenAudio {
    display: none;
    pointer-events: none;
  }
}
.music-wrap.showMiniAudio {
  right: -140px;
  pointer-events: none;
}
.showMiniAudio .song-wrapper {
  background-color: transparent !important;
  box-shadow: none !important;
}
.showMiniAudio .song-text,
.showMiniAudio .song-bar,
.showMiniAudio .songControl {
  display: none;
  background-color: transparent !important;
  box-shadow: none !important;
}
.currentTime {
  height: 10px;
  background-color: rgba(205, 225, 247, 1);
  border-radius: 10px;
  transition: all 0.2s linear;
}
.song-bar {
  width: 100%;
  height: 15px;
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  bottom: 0;
  border-radius: 10px;
  font-size: 12px;
}
.song-bar-item {
  display: block;
  width: 170px;
  height: 10px;
  background-color: rgba(236, 245, 255, 1);
  border-radius: 10px;
}
.song-bar-item:hover {
  cursor: pointer;
}
.disk_play .songImg {
  animation: rotate1 6s infinite linear;
}
.music-wrap {
  position: fixed;
  bottom: 50px;
  right: 10px;
  transition: all 0.2s linear;
}
.song-wrapper {
  position: relative;
  width: 250px;
  height: 80px;
  box-shadow: 0 20px 20px rgb(0 0 0 / 10%), 0 20px 20px rgb(236 245 255 / 20%);
  background-color: white;
  border-radius: 10px;
}
.song-text {
  font-size: 12px;
  position: absolute;
  width: 230px;
  height: 50px;
  border-radius: 5px;
  padding-top: 4px;
  top: -42%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(255, 255, 255, 0.6);
}
.text-item {
  padding-left: 45%;
}
.text-item:nth-child(1) {
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
  pointer-events: all;
}
.songImg {
  position: relative;
  background-color: $theme-color9;
  box-shadow: 0 20px 20px rgb(0 0 0 / 10%), 0 20px 20px rgb(236 245 255 / 20%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
}
.songImg1::after {
  content: '';
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
  content: '';
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
  content: '';
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
  content: '';
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
  content: '';
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
  content: '';
  width: 4px;
  height: 18px;
  left: 10px;
  top: 6px;
  background-color: #d9d9d9;
  position: absolute;
}
.stop::after {
  content: '';
  width: 4px;
  height: 18px;
  left: 17px;
  top: 6px;
  background-color: #d9d9d9;
  position: absolute;
}
.start::after {
  content: '';
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
