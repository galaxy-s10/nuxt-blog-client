export const state = () => ({
  childrenPageSize: 3,
  nowPage: 1,
  pageSize: 3,
})

export const mutations = {}

export const actions = {
  async addComment({}, data) {
    try {
      await this.$axios1.post('/api/comment/add', {
        ...data,
      })
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
