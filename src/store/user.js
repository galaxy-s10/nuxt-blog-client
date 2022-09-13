export const state = () => ({
  summary: null,
  userInfo: null,
  token: null,
});

export const mutations = {
  // eslint-disable-next-line no-shadow
  logout(state) {
    localStorage.removeItem('token');
    state.userInfo = null;
  },
  // eslint-disable-next-line no-shadow
  setToken(state, res) {
    if (res === null) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', res);
    }
    state.token = res;
  },
  // eslint-disable-next-line no-shadow
  setUserInfo(state, res) {
    state.userInfo = res;
  },
  // eslint-disable-next-line no-shadow
  setSummary(state, res) {
    state.summary = res;
  },
};

export const actions = {
  async login({ commit }, payload) {
    try {
      const { data } = await this.$myaxios.post('/user/login', {
        ...payload,
        exp: 24,
      });
      commit('setToken', data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getUserInfo({ commit }) {
    try {
      const { data } = await this.$myaxios.get('/user/get_user_info');
      commit('setUserInfo', data);
      commit('setSummary', {
        articlesTotal: data.articles_total,
        receiveCommentsTotal: data.receive_comments_total,
        sendCommentsTotal: data.send_comments_total,
        receiveStarsTotal: data.receive_stars_total,
        sendStarsTotal: data.send_stars_total,
        qq_users: data.qq_users,
        github_users: data.github_users,
        roles: data.roles,
      });
      return Promise.resolve(true);
    } catch (error) {
      commit('logout');
      console.log(error);
      return Promise.reject(error);
    }
  },
};
