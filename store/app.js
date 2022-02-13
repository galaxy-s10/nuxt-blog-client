export const state = () => ({
  ipInfo: {},
  visitorData: {},
  frontendData: {},
})

export const mutations = {
  setIpInfo(state, res) {
    state.ipInfo = res
  },
  setVisitorData(state, res) {
    state.visitorData = res
  },
  setFrontendData(state, res) {
    state.frontendData = res
  },
}

export const actions = {
  async getIpInfo({ commit }) {
    const res = await this.$axios1.get('/api/position/get')
    commit('setIpInfo', res)
  },
  async getVisitorData({ commit }) {
    const res = await this.$axios1.get('/api/log/detail')
    commit('setVisitorData', res.data)
  },
}
