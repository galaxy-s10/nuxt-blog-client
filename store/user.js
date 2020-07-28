import { MessageBox, Message } from 'element-ui'
import Cookies from 'js-cookie'
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
            const res = await this.$axios.$post('/api/user/login', data)
            commit('setToken', res.token)
            return Promise.resolve()
        } catch (err) {
            return Promise.reject()
        }
    },
    async getUserInfo({ commit, state }) {
        try {
            const res = await this.$axios.$get('/api/user/getuserinfo')
            // commit("setToken", res.userinfo.id)
            commit("setId", res.userinfo.id)
            commit("setName", res.userinfo.username)
            commit("setAvatar", res.userinfo.avatar)
            commit("setTitle", res.userinfo.title)
            return Promise.resolve()
        } catch (err) {
            localStorage.removeItem('token')
            return Promise.reject()
        }
    }

}
