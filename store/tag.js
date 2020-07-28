export const state = () => ({
    tagList: null
})

export const mutations = {
    setTagList(state, res) {
        state.tagList = res
    }
}

export const actions = {
    async getTagList({ commit }) {
        const res1 = await this.$axios.$get(`/api/tag/list?size=3`)
        commit('setTagList', res1.rows)
    },
}