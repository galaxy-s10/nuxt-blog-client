export const state = () => ({
  dayData: null,
  historyData: null,
});

export const mutations = {
  setDayData(state, res) {
    state.dayData = res;
  },
  setHistoryData(state, res) {
    state.historyData = res;
  },
};

export const actions = {
  async getVisitorDayData({ commit }, paylod) {
    try {
      const { data } = await this.$axios1.get('/visitor_log/day', {
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
      const { data } = await this.$axios1.get('/visitor_log/history');
      commit('setHistoryData', data);
    } catch (error) {
      console.log(error);
    }
  },
};
