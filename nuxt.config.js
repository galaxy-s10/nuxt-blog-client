
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'description', content: "前端 | 大前端 | 开源 | 自然博客" },
      { name: 'keywords', content: "自然博客" },
      { property: 'og:type', content: "website" },
      { property: 'og:title', content: "前端 | 大前端 | 开源 | 自然博客" },
      { property: 'og:url', content: "https://www.zhengbeining.com" },
      { property: 'og:site_name', content: "前端 | 大前端 | 开源 | 自然博客" },
      { property: 'og:description', content: "前端 | 大前端 | 开源 | 自然博客" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#53a8ff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/css/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/axios',
    '@/plugins/element-ui',
    '@/plugins/vue-lazyload',
    { src: '~/plugins/tip' },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  server: {
    port: 3000, // default: 3000
  },
  axios: {
    proxy: true,
  },
  proxy: {
    '/api': {
      target: 'http://www.zhengbeining.com:3003',
      // target: 'http://localhost:3003',
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
