export const state = () => ({
    tagList: ""
})

export const mutations = {
    setTagList(state, res) {
        state.tagList = res
    }
}

export const actions = {
    async getTagList({ commit }) {
        let params = {
            nowPage:1,
            pageSize:6,
        }
        const res = await this.$axios.$get(`/api/tag/pageList`,{
            params
        })
        commit('setTagList', res.rows)
    },
}