export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.npm_package_name || "",
    // htmlAttrs: {
    //   lang: "en"
    // },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      },
      { name: "description", content: "前端 | 大前端 | 开源 | 自然博客" },
      { name: "keywords", content: "自然博客" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "前端 | 大前端 | 开源 | 自然博客" },
      { property: "og:url", content: "https://www.zhengbeining.com" },
      { property: "og:site_name", content: "前端 | 大前端 | 开源 | 自然博客" },
      { property: "og:description", content: "前端 | 大前端 | 开源 | 自然博客" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#53a8ff" },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["element-ui/lib/theme-chalk/index.css", "~/assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/axios",
    "@/plugins/element-ui",
    "@/plugins/vue-lazyload",
    { src: "~/plugins/tip" }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "@nuxtjs/proxy"],
  server: {
    port: 3000 // default: 3000
  },
  axios: {
    proxy: true
  },
  proxy: {
    "/api": {
      target: "http://42.193.157.44/api",
      // target: 'http://localhost:3003',
      pathRewrite: {
        "^/api": ""
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
