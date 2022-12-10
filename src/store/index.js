const actions = {
  // https://nuxtjs.org/docs/directory-structure/store/#the-nuxtserverinit-action
  async nuxtServerInit({ state, commit, dispatch }, { app }) {
    const startTime = Date.now();
    console.log(
      `=== nuxtServerInit开始: ${startTime}(${new Date().toLocaleString()}) ===`
    );
    try {
      commit('app/setCurrentNodeEnv', process.env.NODE_ENV);
      await Promise.all([
        dispatch('app/getFrontendData'),
        dispatch('type/getTypeList'),
        dispatch('tag/getSideBarTagList', { nowPage: 1, pageSize: 10 }),
        dispatch('article/getSideBarArticleList', {
          nowPage: 1,
          pageSize: 5,
          orderName: state.article.sideBarArticleOrderName,
          orderBy: 'desc',
        }),
      ]);
      const endTime = Date.now();
      console.log(
        `=== nuxtServerInit完成: ${endTime}(${new Date().toLocaleString()}) 耗时: ${
          endTime - startTime
        }ms ===`
      );
      commit('app/setNuxtServerInit', { startTime, endTime });
    } catch (error) {
      console.log(`=== nuxtServerInit错误: ${new Date().toLocaleString()} ===`);
      console.log(error);
    }
  },
};

export default {
  actions,
};
