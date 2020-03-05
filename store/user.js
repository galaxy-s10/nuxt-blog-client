import { MessageBox, Message } from 'element-ui'
import { login, getinfo, register } from '../api/user'

export const state = () => ({
    id: null,
    name: null,
    avatar: null,
    title: null,
    token: null
})


export const mutations = {
    settoken(state, res) {
        state.token = res
    },
    setname(state, res) {
        state.name = res
    },
    setid(state, res) {
        state.id = res
    },
    settitle(state, res) {
        state.title = res
    },
    setavatar(state, res) {
        state.avatar = res
    }
}

export const actions = {
    async login({ commit }, data) {
        const res = await this.$axios.$post('/api/user/login', data)
        if (res.token) {
            commit('settoken', res.token.id)
            Message({
                message: '登录成功！',
                type: 'success',
                duration: 1000
            })
        } else {
            commit('settoken', res.token)
            console.log('登录成功账号或密码错误！！')
            Message({
                message: '账号或密码错误！',
                type: 'error',
                duration: 1000
            })
        }
    },
    logout({ commit }) {
        commit("settoken", null)
    },
    async getInfo({ commit, state }) {
        const res = await this.$axios.$get(`/api/user/getinfo?token=${state.token}`)
        commit("setname", res.userinfo.username)
        commit("setavatar", res.userinfo.avatar)
        commit("settitle", res.userinfo.title)
    }
}
