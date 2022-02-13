export const state = () => ({
  // 排序字段
  orderName: 'created_at',
  // 排序方式
  orderBy: 'desc',
  // 总页数
  count: 0,
  // 当前页数
  nowPage: 1,
  // 分页大小
  pageSize: 10,
  // 当前类型
  type_id: '',
  // 文章类型列表
  ArticleTypeList: '',
  // 默认文章列表
  pageList: [],
  // 热门文章列表
  hotList: '',
  // 热门文章/最近更新
  hotOrLastUpdate: 'lastUpdate',
  // 历史文章列表
  historyList: '',
  // 历史文章分页大小
  historyPageSize: 10,
  // 文章详情
  detail: '',
  // 搜索数据
  search: '',
  // 文章目录
  catalogList: [],
  // 是否显示文章目录
  showCatalog: false,
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
  changeTypeIds(state, res) {
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
  changeCatalogList(state, res) {
    state.catalogList = res
  },
  changeShowCatalog(state, res) {
    state.showCatalog = res
  },
  // changeOrderName(state, res) {
  //     state.orderName = res
  // },
  // changeOrderBy(state, res) {
  //     state.orderBy = res
  // },
  setDetail(state, res) {
    state.detail = res
  },
  search(state, res) {
    state.search = res
  },
  hotlist(state, res) {
    state.hotOrLastUpdate = 'hot'
    state.hotlist = res
  },
  lastUpdateList(state, res) {
    state.hotOrLastUpdate = 'lastUpdate'
    state.hotlist = res
  },
}

export const actions = {
  async getArticleTypeList({ commit }) {
    try {
      const res = await this.$axios1.get(`/api/type/list?pageSize=10&nowPage=1`)
      commit('changeArticleTypeList', res.rows)
    } catch (err) {
      console.log(err)
    }
  },
  async getArticleList({ commit }, params) {
    try {
      const res = await this.$axios1.get(`/api/article/list`, { params })
      commit('changePageList', res.rows)
      commit('changeCount', res.count)
    } catch (err) {
      console.log(err)
    }
  },
  async getHistoryList({ commit, state }, payload) {
    try {
      const res = await this.$axios1.get(`/api/article/list`, {
        params: {
          orderName: 'created_at',
          orderBy: 'desc',
          nowPage: payload.nowPage,
          pageSize: state.historyPageSize,
        },
      })
      commit('changeHistoryList', res.rows)
      commit('changeCount', res.count)
    } catch (err) {
      console.log(err)
    }
  },
  async getArticleHotList({ commit }, params) {
    const { orderName, orderBy, nowpage } = params
    try {
      const res = await this.$axios1.get(
        `api/article/list?orderName=${orderName}&orderBy=${orderBy}&nowPage=${nowpage}&pageSize=5`
      )
      commit('hotlist', res.rows)
    } catch (err) {
      console.log(err)
    }
  },
  async getArticleLastUpdateList({ commit }, params) {
    const { orderName, orderBy, nowpage } = params
    try {
      const res = await this.$axios1.get(
        `api/article/list?orderName=${orderName}&orderBy=${orderBy}&nowPage=${nowpage}&pageSize=5`
      )
      commit('lastUpdateList', res.rows)
    } catch (err) {
      console.log(err)
    }
  },
  async getArticleDetail({ commit }, params) {
    const { id } = params
    const res = await this.$axios1.get(`/api/article/find/${id}`)
    commit('setDetail', res)
  },
}
