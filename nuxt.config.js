export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'new-blog-client',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      { name: 'description', content: '前端 | 大前端 | 开源 | 自然博客' },
      { name: 'keywords', content: '自然博客' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: '前端 | 大前端 | 开源 | 自然博客' },
      { property: 'og:url', content: 'https://www.hsslive.cn' },
      { property: 'og:site_name', content: '前端 | 大前端 | 开源 | 自然博客' },
      {
        property: 'og:description',
        content: '前端 | 大前端 | 开源 | 自然博客',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/css/main.scss',
    'normalize.css/normalize.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/element-ui',
    '@/plugins/vue-lazyload',
    { src: '~/plugins/tip' },
  ],

  loading: { color: '#53a8ff' },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  server: {
    // 注意，因为是服务端渲染，因此这个port不仅仅是开发时启动的端口，也是部署上线后生产模式的端口
    port: 3000, // default: 3000
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: { proxy: true },

  proxy: {
    '/api': {
      // target: 'http://42.193.157.44/api',
      // target: 'http://42.193.157.44:3003',
      // target: 'http://42.193.157.44:3200',
      target: 'http://localhost:3200',
      pathRewrite: {
        '^/api': '',
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
}
