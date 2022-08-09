export const state = () => ({
  // ip信息
  ipInfo: null,
  // 前端数据
  frontendData: null,
  // 是否显示文章目录
  showCatalog: false,
  // 是否显示梅花特效
  showPlum: false,
  // 是否显示音乐播放器
  showMusicAudio: false,
  // 当前主题
  theme: 'light',
  // 当前node环境
  CurrentNodeEnv: 'development',
});

export const mutations = {
  setIpInfo(state, res) {
    state.ipInfo = res;
  },
  setCurrentNodeEnv(state, res) {
    state.CurrentNodeEnv = res;
  },
  setFrontendData(state, res) {
    state.frontendData = res;
  },
  setShowCatalog(state, res) {
    state.showCatalog = res;
  },
  setShowPlum(state, res) {
    state.showPlum = res;
  },
  setShowMusicAudio(state, res) {
    state.showMusicAudio = res;
  },
  setTheme(state, res) {
    state.theme = res;
    if (res === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      const styleContent = `
      .dark {
        --bg-color-light: #1a1a1a;
        --text-color-light: #bbb;
        --bg-item-color-light: #1a1a1a;
      }
      `;
      const styleEle = document.createElement('style');
      styleEle.textContent = styleContent;
      document.head.appendChild(styleEle);
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  },
};

export const actions = {
  async getIpInfo({ commit }) {
    try {
      const { data } = await this.$axios1.get('/position/get');
      commit('setIpInfo', data);
    } catch (error) {
      console.log(error);
    }
  },
  async getFrontendData({ commit }) {
    try {
      const { data } = await this.$axios1.get('/frontend/detail');
      commit('setFrontendData', data);
    } catch (error) {
      console.log(error);
    }
  },
};
