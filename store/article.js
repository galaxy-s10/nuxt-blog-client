export const state = () => ({
    // 总页数
    count: null,
    // 当前页数
    nowpage: 1,
    // 当前类型
    nowtype: null,
    // 历史文章列表
    list: null,
    // 文章列表
    pagelist: null,
    // 热门文章列表
    hotlist: null,
    // 文章数据
    data: null,
    // 搜索数据
    search: null,
    // 分页大小
    pagesize: 5,
    // 历史文章分页大小
    historypagesize: 10,
    // 文章类型
    typelist: null,
    history: null,
    Detail: null
})

export const mutations = {
    list(state, res) {
        state.list = res
    },
    page(state, res) {
        state.list = res
    },
    nowpage(state, res) {
        state.nowpage = res
    },
    nowtype(state, res) {
        state.nowtype = res
    },
    typelist(state, res) {
        state.typelist = res
    },
    data(state, res) {
        if (res != null) {
            // window.document.title = res.list.rows[0].title + " | vueblog"
            state.data = res.list
        } else {
            state.data = res
        }
    },
    search(state, res) {
        state.search = res
    },
    pagelist(state, res) {
        state.pagelist = res
    },
    hotlist(state, res) {
        // state.hotlist = res
        // slice截取指定元素
        // state.hotlist = res.slice(0, 3)
        state.hotlist = res
    },
    history(state, res) {
        // slice截取指定元素
        state.history = res
    },
    count(state, res) {
        state.count = res
    }
}

export const actions = {
    async articletypelist({ commit }) {
        const res = await this.$axios.$get(`/api/article/typelist`)
        commit('typelist', res.typelist)
    },
    async articlepage({ commit, state }, data) {
        var { ordername, orderby, nowpage } = data
        if (ordername != undefined && orderby != undefined) {
            const res = await this.$axios.$get(`/api/article/page?ordername=${ordername}&orderby=${orderby}&nowPage=${nowpage}&pageSize=${state.historypagesize}`)
            commit('list', res.pagelist.rows)
            commit('count', res.pagelist.count)
        } else {
            if (state.nowtype != null) {
                var res = await this.$axios.$get(`/api/article/page?type=${state.nowtype}&nowPage=${nowpage}&pageSize=${state.pagesize}`)
                commit('pagelist', res.pagelist.rows)
                commit('count', res.pagelist.count)
            } else {
                var res = await this.$axios.$get(`/api/article/page?&nowPage=${nowpage}&pageSize=${state.pagesize}`)
                commit('pagelist', res.pagelist.rows)
                commit('count', res.pagelist.count)
            }
        }

    },
    async articlehotlist({ commit }, data) {
        // console.log(data)
        var { ordername, orderby, nowpage } = data
        const res = await this.$axios.$get(`/api/article/page?ordername=${ordername}&orderby=${orderby}&nowPage=${nowpage}&pageSize=4`)
        commit('hotlist', res.pagelist.rows)
    },
    async findarticle({ commit }, data) {
        var { id } = data
        const res = await this.$axios.$get(`/api/article/find?id=${id}`)
        commit('data', res)
    }
}