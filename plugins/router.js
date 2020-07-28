import Vue from 'vue'
var vm = new Vue({})

// NProgress.configure({ showSpinner: false })
// NProgress.configure({ easing: 'ease', speed: 100, showSpinner: false });

export default ({ app }) => {
    app.router.beforeEach((to, from, next) => {
        // this.$nuxt.$loading.start()
        // console.log(app)
        // vm.$loading();
        // NProgress.start()
        next()
    })
    app.router.afterEach(() => {
        // this.$nuxt.$loading.finish()
        // NProgress.done()
        // let load = vm.$loading();
        //   load.close();
    })
}