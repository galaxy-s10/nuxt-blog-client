import { MessageBox, Message } from 'element-ui'

export default function ({ $axios, redirect }) {
    $axios.defaults.timeout = 2000
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