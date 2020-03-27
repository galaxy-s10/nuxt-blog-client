import { MessageBox, Message } from 'element-ui'
import Cookies from 'js-cookie';

export default function ({ $axios,store,redirect }) {
    $axios.defaults.timeout = 2000
    $axios.onRequest(config => {
        var token = Cookies.get('token')
        if (token != 'null' && token != undefined) {
            store.commit("user/settoken",token);
            config.headers.Authorization = `Bearer ${token}`
        }
    })
    $axios.onError(error => {
        // const code = parseInt(error.response && error.response.status)
        // if (code === 400) {
        Message({
            message: error,
            type: 'error',
            duration: 1000
        })
        // redirect('/400')
        // }
    })
}