const actions = {
  // https://nuxtjs.org/docs/directory-structure/store/#the-nuxtserverinit-action
  async nuxtServerInit({ commit, dispatch }) {
    try {
      commit('app/setCurrentNodeEnv', process.env.NODE_ENV);
      await Promise.all([
        dispatch('type/getTypeList'),
        dispatch('tag/getSideBarTagList', { nowPage: 1, pageSize: 10 }),
        dispatch('article/getSideBarArticleList', {
          nowPage: 1,
          pageSize: 5,
          orderName: 'updated_at',
          orderBy: 'desc',
        }),
      ]);
      console.log(`${new Date().toLocaleString()} --- nuxtServerInit完成`);
    } catch (error) {
      console.log(
        `${new Date().toLocaleString()} --- nuxtServerInit错误`,
        error
      );
    }
  },
};

export default {
  actions,
};
