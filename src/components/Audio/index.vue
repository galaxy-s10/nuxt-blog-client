<template>
  <div :class="{ 'audio-wrap': true, mini: showMiniAudio }">
    <template v-if="songList.length">
      <span
        class="mini-ico"
        :title="!showMiniAudio ? '最小化' : '最大化'"
        :style="{ background: showMiniAudio ? '#62c755' : '#f5c04f' }"
        @click="changeShowMiniAudio"
      >
        <template v-if="showMiniAudio">
          <i></i>
          <i></i>
        </template>
        <b v-else></b>
      </span>
      <div :class="{ 'song-desc': true }">
        <div class="text">
          {{ songList[currentIndex] ? songList[currentIndex].name : '-' }}
        </div>
        <div class="text">
          {{ songList[currentIndex] ? songList[currentIndex].author : '-' }}
        </div>
      </div>
      <div :class="{ 'song-progress': true }">
        <div
          ref="bar"
          class="song-progress-item"
        >
          <div
            :style="{ width: nowTime * (100 / duration) + '%' }"
            class="current-time"
          ></div>
        </div>
        <div>{{ duration2(nowTime) }}/{{ duration2(duration) }}</div>
      </div>
      <div :class="{ 'song-control': true }">
        <div
          class="pre"
          @click="preSong"
        ></div>
        <div
          :class="!start ? 'start' : 'stop'"
          @click="switchBtn()"
        ></div>
        <div
          class="next"
          @click="nextSong"
        ></div>
      </div>
      <div
        :class="{
          'song-disk': true,
        }"
      >
        <img
          ref="disk"
          :src="
            songList[currentIndex] ? songList[currentIndex]['cover_pic'] : '-'
          "
          class="songImg"
          :style="{
            animationPlayState: start ? 'running' : 'paused',
          }"
        />
      </div>
    </template>
    <div v-else>暂无音乐~</div>
  </div>
</template>

<script>
// import analyze from 'rgbaster';
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      showMiniAudio: true,
      matrix: '',
      nowDeg: 0,
      audio: null,
      start: false,
      duration: 0,
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
      currMusic(state) {
        return state.app.currMusic;
      },
    }),

    duration2() {
      return (x) => this.formatTime(x);
    },
  },
  watch: {
    currMusic(newVal) {
      const index = this.songList.findIndex(
        (item) => item.id === newVal.data.music.id
      );
      this.currentIndex = index;
      this.changeSong(index);
    },
  },
  async mounted() {
    this.handleResize(true);
    window.addEventListener('resize', this.handleResize);
    const { data } = await this.$myaxios.music.list();
    this.setMusicList(data.rows);
    this.songList = data.rows;
    if (!this.songList.length) return;
    this.audio = new Audio();
    this.audio.src = this.songList[0].audio_url;
    const timer = setInterval(() => {
      if (!isNaN(this.audio.duration)) {
        this.duration = this.audio.duration;
        clearInterval(timer);
      }
    }, 100);

    const timer1 = setTimeout(() => {
      this.audio.addEventListener('timeupdate', () => {
        this.nowTime = this.audio.currentTime;
        if (this.nowTime === this.duration) {
          this.nextSong();
        }
      });

      this.$refs.bar.addEventListener('click', (e) => {
        setTimeout(() => {
          this.nowTime = (e.offsetX / 170) * this.duration;
          this.audio.currentTime = this.nowTime;
        }, 100);
      });
      clearTimeout(timer1);
    }, 0);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    ...mapMutations({
      setMusicList: 'app/setMusicList',
    }),
    handleResize() {
      // const offsetWidth =
      //   window.pageXOffset || document.documentElement.offsetWidth;
      // if (offsetWidth <= 414) {
      //   this.showMiniAudio = true;
      // } else {
      //   this.showMiniAudio = false;
      // }
      this.$emit('changeRect');
    },
    changeShowMiniAudio() {
      this.$emit('changeRect');
      this.showMiniAudio = !this.showMiniAudio;
    },
    formatTime(t) {
      let m = parseInt((t % 3600) / 60);
      m = m < 10 ? `0${m}` : m;
      let s = parseInt(t % 60);
      s = s < 10 ? `0${s}` : s;
      return `${m}:${s}`;
    },
    changeBobyBg() {
      // analyze(this.songList[this.currentIndex].cover_pic, {
      //   scale: 0.8,
      // }).then((res) => {
      //   document.body.style.backgroundImage = `linear-gradient(43deg,${
      //     res[0].color
      //   } 100%,${res[res.length - 1].color} 0%)`;
      // });
    },
    switchBtn() {
      this.start = !this.start;
      if (this.start === true) {
        this.duration = this.audio.duration;
        if (this.nowTime !== 0) {
          this.audio.currentTime = this.nowTime;
        }
        this.changeBobyBg();
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
      this.changeBobyBg();
      setTimeout(() => {
        this.start = true;
        this.audio.src = this.songList[index].audio_url;
        this.audio
          .play()
          .then(() => {
            this.duration = this.audio.duration;
          })
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
      // this.$refs.disk.style.animationPlayState = 'paused';
    },
    // 停止转盘转动
    stopRotate1() {
      // this.$refs.disk.style.animationPlayState = 'paused';
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
.audio-wrap {
  position: relative;
  width: 250px;
  height: 80px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 20px 20px rgb(0 0 0 / 10%), 0 20px 20px rgb(236 245 255 / 20%);
  cursor: grab;
  .triangle {
    display: inline-block;
    border: 4px solid transparent;
    border-bottom-color: rgba(0, 0, 0, 0.5);
    content: '';
  }
  .mini-ico {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 1;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    & i:nth-child(1) {
      position: absolute;
      top: 22%;
      left: 80%;
      content: '';
      transform: translate(-50%, -50%) rotate(45deg);

      &::after {
        content: '';

        @extend .triangle;
      }
    }
    & i:nth-child(2) {
      position: absolute;
      top: 78%;
      left: 19%;
      content: '';
      transform: translate(-50%, -50%) rotate(-134deg);

      &::after {
        @extend .triangle;
      }
    }
    b {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      width: 40%;
      height: 2px;
      background-color: rgba(0, 0, 0, 0.5);
      content: '';
      transform: translate(-50%, -50%);
    }
  }
  &.mini {
    & {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background-color: inherit;
      box-shadow: none;
    }
    .song-desc,
    .song-progress,
    .song-control {
      display: none;
    }
    .song-disk {
      position: relative;
      top: 0;
      left: 0;
    }
  }

  .song-desc {
    position: absolute;
    top: -42%;
    left: 50%;
    padding-top: 4px;
    width: 230px;
    height: 50px;
    border-radius: 5px;
    background-color: rgb(255, 255, 255, 0.6);
    font-size: 12px;
    transform: translateX(-50%);
    .text {
      padding-left: 45%;
      &:nth-child(1) {
        font-weight: 700;
      }
    }
  }

  .song-progress {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 15px;
    border-radius: 10px;
    font-size: 12px;
    .song-progress-item {
      display: block;
      width: 170px;
      height: 10px;
      border-radius: 10px;
      background-color: rgba(236, 245, 255, 1);
      &:hover {
        cursor: pointer;
      }
      .current-time {
        height: 10px;
        border-radius: 10px;
        background-color: rgba(205, 225, 247, 1);
        transition: all 0.2s linear;
      }
    }
  }

  .song-control {
    position: absolute;
    right: 0;
    display: flex;
    justify-content: space-around;
    width: 150px;
    height: 60px;

    .pre,
    .next,
    .stop,
    .start {
      position: relative;
      top: 50%;
      width: 30px;
      height: 30px;
      border-radius: 5px;
      transform: translateY(-30%);
      &:hover {
        cursor: pointer;
      }
    }

    .pre,
    .next,
    .stop,
    .start {
      &:hover {
        background-color: #717070;
        color: white;
      }
    }
    .start::after:hover {
      border-color: transparent transparent transparent white;
    }

    .pre::before {
      position: absolute;
      top: 50%;
      left: 12px;
      width: 0;
      height: 0;
      border-width: 5px 5px 5px 0px;
      border-style: solid;
      border-color: transparent #d9d9d9 transparent transparent;
      content: '';
      transform: translate(-50%, -50%);
    }
    .pre::after {
      position: absolute;
      top: 50%;
      left: 18px;
      width: 0;
      height: 0;
      border-width: 5px 5px 5px 0px;
      border-style: solid;
      border-color: transparent #d9d9d9 transparent transparent;
      content: '';
      transform: translate(-50%, -50%);
    }
    .next::before {
      position: absolute;
      top: 50%;
      left: 12px;
      width: 0;
      height: 0;
      border-width: 5px 0 5px 5px;
      border-style: solid;
      border-color: transparent transparent transparent #d9d9d9;
      content: '';
      transform: translate(-50%, -50%);
    }
    .next::after {
      position: absolute;
      top: 50%;
      left: 18px;
      width: 0;
      height: 0;
      border-width: 5px 0 5px 5px;
      border-style: solid;
      border-color: transparent transparent transparent #d9d9d9;
      content: '';
      transform: translate(-50%, -50%);
    }

    .stop::before {
      position: absolute;
      top: 6px;
      left: 10px;
      width: 4px;
      height: 18px;
      background-color: #d9d9d9;
      content: '';
    }
    .stop::after {
      position: absolute;
      top: 6px;
      left: 17px;
      width: 4px;
      height: 18px;
      background-color: #d9d9d9;
      content: '';
    }
    .start::after {
      position: absolute;
      top: 5px;
      left: 10px;
      width: 0;
      height: 0;
      border-width: 10px 0 10px 15px;
      border-style: solid;
      border-color: transparent transparent transparent #d9d9d9;
      content: '';
    }
  }
  .song-disk {
    position: absolute;
    top: -45px;
    left: 10px;
    width: 90px;
    height: 90px;
    transition: all 0.1s ease;
    pointer-events: all;

    user-select: none;
    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-image: linear-gradient(45deg, #fff, #dabad1);
      box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.2);
      content: '';
      transform: translate(-50%, -50%);
    }
    img {
      position: relative;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background-color: $theme-color9;
      box-shadow: 0 20px 20px rgb(0 0 0 / 10%),
        0 20px 20px rgb(236 245 255 / 20%);
      animation: rotate1 6s infinite linear;
      animation-play-state: paused;
    }
  }
}
</style>
