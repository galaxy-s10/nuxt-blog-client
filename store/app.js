export const state = () => ({
  // id信息
  ipInfo: null,
  // 前端数据
  frontendData: null,
  // 是否显示文章目录
  showCatalog: false,
  CurrentNodeEnv: 'development',
})

export const mutations = {
  setIpInfo(state, res) {
    state.ipInfo = res
  },
  setCurrentNodeEnv(state, res) {
    state.CurrentNodeEnv = res
  },
  setFrontendData(state, res) {
    state.frontendData = res
  },
  setShowCatalog(state, res) {
    state.showCatalog = res
  },
}

export const actions = {
  async getIpInfo({ commit }) {
    const { data } = await this.$axios1.get('/api/position/get')
    commit('setIpInfo', data)
  },
  async getFrontendData({ commit }) {
    const { data } = await this.$axios1.get('/api/frontend/detail')
    commit('setFrontendData', data)
  },
}
