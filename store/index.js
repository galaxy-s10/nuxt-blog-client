const actions = {
  async nuxtServerInit({ dispatch }) {
    try {
      await dispatch('article/getArticleLastUpdateList', {
        orderName: 'updated_at',
        orderBy: 'desc',
        nowpage: 1,
      })
      await dispatch('article/getArticleTypeList')
      await dispatch('tag/getTagList')
    } catch (err) {
      console.log(err)
    }
  },
}

export default {
  actions,
}
