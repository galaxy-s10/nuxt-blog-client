export const state = () => ({
    id: null,
    name: null,
    avatar: null,
    title: null,
    token: null
})


export const mutations = {
    logout(state) {
        localStorage.removeItem('token')
        state.id = null,
            state.name = null,
            state.avatar = null,
            state.title = null,
            state.token = null
    },
    setToken(state, res) {
        if (res == null) {
            localStorage.removeItem('token')
        } else {
            state.token = res
            localStorage.token = res
        }
    },
    setName(state, res) {
        state.name = res
    },
    setId(state, res) {
        state.id = res
    },
    setTitle(state, res) {
        state.title = res
    },
    setAvatar(state, res) {
        state.avatar = res
    }
}

export const actions = {
    async login({ commit }, data) {
        try {
            const res = await this.$axios.$post('/api/user/login', { ...data, exp: 1 })
            commit('setToken', res.token)
            return Promise.resolve(res)
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async getUserInfo({ commit, state }) {
        try {
            const res = await this.$axios.$get('/api/user/getuserinfo')
            console.log("s:::", res)
            commit("setId", res.userInfo.id)
            commit("setName", res.userInfo.username)
            commit("setAvatar", res.userInfo.avatar)
            commit("setTitle", res.userInfo.title)
            return Promise.resolve()
        } catch (err) {
            if (localStorage) {
                localStorage.removeItem('token')
            }
            return Promise.reject()
        }
    }

}
