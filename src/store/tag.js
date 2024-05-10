export const state = () => ({
  sideBarTagList: null,
});

export const mutations = {
  // eslint-disable-next-line no-shadow
  setSideBarTagList(state, res) {
    state.sideBarTagList = res;
  },
};

export const actions = {
  async getSideBarTagList({ commit }, payload) {
    const params = {
      nowPage: payload.nowPage,
      pageSize: payload.pageSize,
      orderName: 'priority',
      orderBy: 'desc',
    };
    try {
      const { data } = await this.$myaxios.tag.list(params);
      commit('setSideBarTagList', data.rows);
    } catch (error) {
      console.log(error);
    }
  },
};
