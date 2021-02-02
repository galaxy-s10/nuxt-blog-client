export const state = () => ({
    ipInfo: {},
    visitorData: {},
})

export const mutations = {
    setIpInfo(state, res) {
        state.ipInfo = res
    },
    setVisitorData(state, res) {
        state.visitorData = res
    }
}

export const actions = {
    async getIpInfo({ commit }) {
        let res = await this.$axios.$get("/api/log/getPosition")
        // .then((res) => {
        //     console.log("resresresres");
        //     console.log(res);
        // }).catch(err => {
        //     console.log('111');
        //     console.log(err);
        // })
        commit('setIpInfo', res.data)
    },
    async getVisitorData({ commit }) {
        let res = await this.$axios.$get("/api/log/detail")
        // .then((res) => {
        //     console.log("resresresres");
        //     console.log(res);
        // }).catch(err => {
        //     console.log('111');
        //     console.log(err);
        // })
        commit('setVisitorData', res.data)
    },
}