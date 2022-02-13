export const state = () => ({
  id: null,
  name: null,
  avatar: null,
  title: null,
  token: null,
  summary: {},
})

export const mutations = {
  logout(state) {
    localStorage.removeItem('token')
    state.id = null
    state.name = null
    state.avatar = null
    state.title = null
    state.token = null
    state.summary = {}
  },
  setToken(state, res) {
    if (res === null) {
      localStorage.removeItem('token')
    } else {
      state.token = res
      localStorage.token = res
    }
  },
  setName(state, res) {
    state.name = res
  },
  setId(state, res) {
    state.id = res
  },
  setTitle(state, res) {
    state.title = res
  },
  setAvatar(state, res) {
    state.avatar = res
  },
  setSummary(state, res) {
    state.summary = res
  },
}

export const actions = {
  async login({ commit }, data) {
    try {
      const res = await this.$axios1.post('/api/user/login', {
        ...data,
        exp: 24,
      })
      commit('setToken', res)
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async getUserInfo({ commit }) {
    try {
      const res = await this.$axios1.get('/api/user/get_user_info')
      commit('setId', res.id)
      commit('setName', res.username)
      commit('setAvatar', res.avatar)
      commit('setTitle', res.title)
      commit('setSummary', {
        articleTotal: res.articles.length,
        commentTotal: res.comments.length,
        starTotal: res.stars.length,
        qq_users: res.qq_users,
        github_users: res.github_users,
        roles: res.roles,
      })
      return Promise.resolve(true)
    } catch (err) {
      if (localStorage) {
        localStorage.removeItem('token')
      }
      return Promise.reject()
    }
  },
}
