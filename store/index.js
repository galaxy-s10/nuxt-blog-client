import { dateStartAndEnd } from '@/utils/format'

const actions = {
  // https://nuxtjs.org/docs/directory-structure/store/#the-nuxtserverinit-action
  async nuxtServerInit({ commit, dispatch }) {
    try {
      commit('app/setNODE_ENV', process.env.NODE_ENV)
      await Promise.all([
        dispatch('app/getIpInfo'),
        dispatch('log/getVisitorDayData', dateStartAndEnd(new Date())),
        dispatch('log/getVisitorHistoryData'),
        dispatch('type/getTypeList'),
        dispatch('tag/getSideBarTagList', { nowPage: 1, pageSize: 10 }),
        dispatch('article/getSideBarArticleList', {
          nowPage: 1,
          pageSize: 5,
          orderName: 'updated_at',
          orderBy: 'desc',
        }),
      ])
      console.log('nuxtServerInit初始化完成')
    } catch (error) {
      console.log(error)
    }
  },
}

export default {
  actions,
}
