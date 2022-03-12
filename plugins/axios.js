import { Message } from 'element-ui'

export default function ({ $axios, store }, inject) {
  const axios = $axios
  const service = axios.create({
    // baseURL: 'http://localhost:3100',
    timeout: 5000,
  })

  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      const token = store.state.user.token
      if (store.state.user.token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      console.log(error)
      return Promise.reject(error)
    }
  )

  // 响应拦截
  service.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      const whiteList = ['400', '401', '403'] // 这三个状态码是后端会返回的
      if (!whiteList.includes(`${error.response.status}`)) {
        Message({
          message: error,
          type: 'error',
          duration: 1000,
        })
        return Promise.reject(error)
      }
      if (error.response) {
        const message =
          error.response.data.error.message || error.response.data.message
        Message({
          message,
          type: 'error',
          duration: 1000,
        })
        if (error.response.status === 400) {
          // 400错误不返回data
          return Promise.reject(error.response.data)
        }
        if (error.response.status === 401) {
          store.commit('user/logout')
          return Promise.reject(error.response.data)
        }
        if (error.response.status === 403) {
          return Promise.reject(error.response.data)
        }
      } else {
        Message({
          message: error.response.message,
          type: 'error',
        })
        return Promise.reject(error.response)
      }
    }
  )
  inject('axios1', service)
}
