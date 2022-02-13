export const state = () => ({
  tagList: [],
})

export const mutations = {
  setTagList(state, res) {
    state.tagList = res
  },
}

export const actions = {
  async getTagList({ commit }) {
    const params = {
      nowPage: 1,
      pageSize: 6,
    }
    try {
      const res = await this.$axios1.get(`/api/tag/list`, {
        params,
      })
      commit('setTagList', res.rows)
    } catch (err) {
      console.log(err)
    }
  },
}
