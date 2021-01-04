export const state = () => ({
    // 排序字段
    ordername: "createdAt",
    // 排序方式
    orderby: "desc",
    // 总页数
    count: 0,
    // 当前页数
    nowPage: 1,
    // 分页大小
    pageSize: 5,
    // 当前类型
    type_id: "",
    // 文章类型列表
    ArticleTypeList: "",
    // 默认文章列表
    pageList: "",
    // 热门文章列表
    hotList: "",
    // 历史文章列表
    historyList: "",
    // 历史文章分页大小
    historyPageSize: 10,
    // 文章详情
    detail: "",
    // 搜索数据
    search: "",
})

export const mutations = {
    list(state, res) {
        state.list = res
    },
    page(state, res) {
        state.list = res
    },
    changeNowPage(state, res) {
        state.nowPage = res
    },
    changeType_id(state, res) {
        state.type_id = res
    },
    changeArticleTypeList(state, res) {
        state.ArticleTypeList = res
    },
    changeHistoryList(state, res) {
        state.historyList = res
    },
    changeCount(state, res) {
        state.count = res
    },
    changePageList(state, res) {
        state.pageList = res
    },
    // changeOrderName(state, res) {
    //     state.ordername = res
    // },
    // changeOrderBy(state, res) {
    //     state.orderby = res
    // },
    setDetail(state, res) {
        state.detail = res
    },
    search(state, res) {
        state.search = res
    },

    hotlist(state, res) {
        // state.hotlist = res
        // slice截取指定元素
        // state.hotlist = res.slice(0, 3)
        state.hotlist = res
    },

}

export const actions = {
    async getArticleTypeList({ commit }) {
        const res = await this.$axios.$get(`/api/type/pageList?pageSize=10&nowPage=1`)
        commit('changeArticleTypeList', res.rows)
    },
    async getArticleList({ commit }, params) {
        const res = await this.$axios.$get(`/api/article/pageList`, { params })
        commit('changePageList', res.rows)
        commit('changeCount', res.count)
    },
    async getHistoryList({ commit, state }, payload) {
        var res = await this.$axios.$get(`/api/article/pageList`, {
            params: {
                ordername: "createdAt",
                orderby: "desc",
                nowPage: payload.nowPage,
                pageSize: state.historyPageSize,
            },
        });
        commit("changeHistoryList", res.rows);
        commit("changeCount", res.count);
    },
    async getArticleHotList({ commit }, params) {
        var { ordername, orderby, nowpage } = params
        try {
            const res = await this.$axios.$get(`api/article/pageList?ordername=${ordername}&orderby=${orderby}&nowPage=${nowpage}&pageSize=5`)
            commit('hotlist', res.rows)
        } catch (err) {
            console.log(err)
        }

    },
    async getArticleDetail({ commit }, params) {
        var { id } = params
        const res = await this.$axios.$get(`/api/article/findOne?id=${id}`)
        commit('setDetail', res.detail)
    }
}