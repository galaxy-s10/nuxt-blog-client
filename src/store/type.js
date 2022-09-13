export const state = () => ({
  typeId: '',
  typeList: null,
});

export const mutations = {
  // eslint-disable-next-line no-shadow
  changeTypeId(state, res) {
    state.typeId = res;
  },
  // eslint-disable-next-line no-shadow
  changeTypeList(state, res) {
    state.typeList = res;
  },
};

export const actions = {
  async getTypeList({ commit }) {
    const params = {
      nowPage: 1,
      pageSize: 10,
    };
    try {
      const { data } = await this.$myaxios.get(`/type/list`, { params });
      commit('changeTypeList', data.rows);
    } catch (error) {
      console.log(error);
    }
  },
};
