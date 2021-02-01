import { MessageBox, Message } from 'element-ui'
// import Cookies from 'js-cookie';

export default function ({ $axios, store }) {
    $axios.defaults.timeout = 2000
    $axios.onRequest(config => {
        var token = store.state.user.token
        if (store.state.user.token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    })
    $axios.onError(error => {
        console.log(error);
        console.log(error.response);
        // return Promise.reject(error.response.data)
        // return Promise.reject(error.response)
        return Promise.reject(error.response.data)
    })
}