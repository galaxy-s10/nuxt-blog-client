export const state = () => ({
  // 侧边栏文章列表
  sideBarArticleList: null,
  // 侧边栏文章类型
  sideBarArticleOrderName: 'updated_at',
  // 文章目录
  catalogList: [],
})

export const mutations = {
  changeSidebarArticleList(state, res) {
    state.sideBarArticleList = res
  },
  changeCatalogList(state, res) {
    state.catalogList = res
  },
  changeSideBarArticleOrderName(state, res) {
    state.sideBarArticleOrderName = res
  },
}

export const actions = {
  // 获取侧边栏文章列表
  async getSideBarArticleList({ commit }, params) {
    const { nowPage, pageSize, orderName, orderBy } = params
    try {
      const { data } = await this.$axios1.get(`/article/list`, {
        params: {
          orderName,
          orderBy,
          nowPage,
          pageSize,
        },
      })
      commit('changeSideBarArticleOrderName', orderName)
      commit('changeSidebarArticleList', data.rows)
    } catch (error) {
      console.log(error)
    }
  },
}
