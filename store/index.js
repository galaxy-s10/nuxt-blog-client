const actions = {
  // https://nuxtjs.org/docs/directory-structure/store/#the-nuxtserverinit-action
  nuxtServerInit({ commit, dispatch }) {
    try {
      console.log(new Date().toLocaleString() + '---nuxtServerInit初始化完成')
    } catch (error) {
      console.log(
        new Date().toLocaleString() + '---nuxtServerInit初始化错误',
        error
      )
    }
  },
}

export default {
  actions,
}
