export const state = () => ({
  dayData: null,
  historyData: null,
});

export const mutations = {
  // eslint-disable-next-line no-shadow
  setDayData(state, res) {
    state.dayData = res;
  },
  // eslint-disable-next-line no-shadow
  setHistoryData(state, res) {
    state.historyData = res;
  },
};

export const actions = {
  async getVisitorDayData({ commit }, paylod) {
    try {
      const { data } = await this.$myaxios.get('/visitor_log/day', {
        params: {
          startTime: paylod.startTime,
          endTime: paylod.endTime,
        },
      });
      commit('setDayData', data);
    } catch (error) {
      console.log(error);
    }
  },
  async getVisitorHistoryData({ commit }) {
    try {
      const { data } = await this.$myaxios.get('/visitor_log/history');
      commit('setHistoryData', data);
    } catch (error) {
      console.log(error);
    }
  },
};
