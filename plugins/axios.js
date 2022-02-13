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
      return response.data.data
    },
    (error) => {
      const whiteList = ['400', '401', '403', '404']
      if (!whiteList.includes(`${error.response.status}`)) {
        return Promise.reject(error)
      }
      if (error.response) {
        if (error.response.status === 400) {
          return Promise.reject(error.response.data.data)
        }
        if (error.response.status === 401) {
          store.commit('user/logout')
          return Promise.reject(error.response.data.data)
        }
        if (error.response.status === 403) {
          return Promise.reject(error.response.data.data)
        }
      } else {
        return Promise.reject(error.response)
      }
    }
  )
  inject('axios1', service)
}
