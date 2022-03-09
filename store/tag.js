export const state = () => ({
  sideBarTagList: null,
})

export const mutations = {
  setSideBarTagList(state, res) {
    state.sideBarTagList = res
  },
}

export const actions = {
  async getSideBarTagList({ commit }, payload) {
    const params = {
      nowPage: payload.nowPage,
      pageSize: payload.pageSize,
    }
    try {
      const { data } = await this.$axios1.get(`/api/tag/list`, {
        params,
      })
      commit('setSideBarTagList', data.rows)
    } catch (error) {
      console.log(error)
    }
  },
}
