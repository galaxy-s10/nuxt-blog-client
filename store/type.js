export const state = () => ({
  typeId: '',
  typeList: null,
})

export const mutations = {
  changeTypeId(state, res) {
    state.typeId = res
  },
  changeTypeList(state, res) {
    state.typeList = res
  },
}

export const actions = {
  async getTypeList({ commit }) {
    const params = {
      nowPage: 1,
      pageSize: 10,
    }
    try {
      const { data } = await this.$axios1.get(`/api/type/list`, { params })
      commit('changeTypeList', data.rows)
    } catch (error) {
      console.log(error)
    }
  },
}
