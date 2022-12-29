import path from 'path';

// import { VERSION as axiosVersion } from 'axios';
import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
// import { version as vueVersion } from 'vue';
// import { version as vueRouterVersion } from 'vue-router';
// import vuex from 'vuex';
import webpack from 'webpack';

import pkg from './package.json';
import { QINIU_CDN_URL } from './src/constant';

const isDevelopment = process.env.NODE_ENV === 'development';

const seo = {
  title: '自然博客',
  description: '自然博客 | 前端 | 大前端 | javascript | vue | react | node',
  keywords:
    '前端 | 大前端 | 开源 | 开源博客 | javascript | vue | react | node | nuxt | nuxt2 | next',
};

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-blog-client',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'description',
        content: seo.description,
      },
      {
        name: 'keywords',
        content: seo.description,
      },
      { property: 'og:url', content: 'https://www.hsslive.cn' },
      { property: 'og:title', content: seo.title },
      { property: 'og:keywords', content: seo.keywords },
      { property: 'og:description', content: seo.description },
      { property: 'twitter:title', content: seo.title },
      { property: 'twitter:keywords', content: seo.keywords },
      { property: 'twitter:description', content: seo.description },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    // 如果不是开发环境，则使用cdn加载这些库
    // script: !isDevelopment && [
    //   { src: `https://unpkg.com/vue@${vueVersion}/dist/vue.runtime.min.js` },
    //   { src: `https://unpkg.com/vuex@${vuex.version}/dist/vuex.min.js` },
    //   {
    //     src: `https://unpkg.com/vue-router@${vueRouterVersion}/dist/vue-router.min.js`,
    //   },
    //   { src: `https://unpkg.com/axios@${axiosVersion}/dist/axios.min.js` },
    // ],
  },
  alias: {
    '@': path.resolve(__dirname, './src/'),
    // components: path.resolve(__dirname, './src/components'),
    // layouts: path.resolve(__dirname, './src/layouts'),
  },
  corejs: 3,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // 'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/main.scss',
    // 'normalize.css/normalize.css',
  ],
  srcDir: 'src/',
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/element-ui',
    '@/plugins/vue-lazyload',
    '@/plugins/filters',
    '@/plugins/router',
    {
      src: '@/plugins/baidutongji',
      ssr: false,
    },
    { src: '@/plugins/tip' },
  ],
  router: {
    // Run the middleware/auth.js on every page
    // middleware: 'auth',
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
  },

  loading: { color: '#0984e3' },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // 太影响热更新了，开发的时候可以依靠编辑器的eslint，把项目的eslint关闭
    // '@nuxtjs/eslint-module',

    // https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    // 这样引无法实际引入billd-scss
    // scss: ['~billd-scss/src/index.scss'],

    // 做一层中转就可以引入billd-scss了
    scss: ['@/assets/css/billd-scss.scss', '@/assets/css/constant.scss'],

    // test1.scss和test2.scss都使用了@use 'sass:math';如果同时引入他们两个，就会报错：SassError: @use rules must be written before any other rules.可能是一个bug?
    // scss: ['@/assets/css/test1.scss', '@/assets/css/test2.scss'],
    /**
     * hoistUseStatements属性本质上是：https://github.com/shakacode/sass-resources-loader#hoistusestatements
     * StyleSheet的@USE规则必须在@forward以外的任何规则之前，包括样式规则。但是，您可以在配置模块时使用@USE规则之前声明变量。
     * 具体的表现就是在vue文件的style标签里，如果我们使用了@use @/assets/css/test1.scss'，没有设置hoistUseStatements为true的话，
     * 假设@/assets/css/billd-scss.scss'里面的内容是：.aaa {font-size: 12px;}，那么实际上的编译结果是
     * .aaa {font-size: 12px;}
     * @use @/assets/css/test1.scss'
     * 那么就会报错：SassError: @use rules must be written before any other rules
     * 如果我们设置hoistUseStatements为true的话，就会将所有的@use提升，，那么实际上的编译结果是
     * @use @/assets/css/test1.scss'
     * .aaa {font-size: 12px;}
     * 这样就符合sass语法，即hoistUseStatements会帮我们将style标签里的@use都提升到@/assets/css/billd-scss.scss的前面，
     * ps:如果我们@/assets/css/billd-scss.scss里面没有任何规则的话，不设置hoistUseStatements为true也没问题。
     */
    hoistUseStatements: true, // Hoists the "@use" imports. Applies only to "sass", "scss" and "less". Default: false.
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    // '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],

  hooks: {},

  server: {
    // 注意，因为是服务端渲染，因此这个port不仅仅是开发时启动的端口，也是部署上线后生产模式的端口
    port: 3000, // default: 3000
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  // axios: { proxy: true },

  proxy: {
    '/api': {
      target: 'http://localhost:3300',
      pathRewrite: {
        '^/api': '',
      },
    },
    // '/prodapi/': {
    //   target: 'https://api.hsslive.cn/prodapi/',
    //   secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/prodapi': '',
    //   },
    //   // 效果：/prodapi/link/list ==> http://api.hsslive.cn/prodapi/link/list
    // },
    // '/betaapi/': {
    //   target: 'https://api.hsslive.cn/',
    //   secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
    //   changeOrigin: true,
    //   // 效果：/betaapi/link/list ==> http://api.hsslive.cn/betaapi/link/list
    // },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: `${QINIU_CDN_URL}${pkg.name}/v${pkg.version}`,

    // styleResources此属性已弃用。请改用style-resources-module以提高性能和更好的 DX！
    // styleResources: {},

    // analyze: true,
    plugins: [
      !isDevelopment &&
        new CompressionPlugin({
          test: /\.(js|css|html)$/,
          threshold: 10 * 1024, // 大于10k的文件才进行压缩
          minRatio: 0.8, // 只有压缩比这个比率更好的资产才会被处理(minRatio =压缩大小/原始大小),即压缩如果达不到0.8就不会进行压缩
          algorithm: 'gzip', // 压缩算法
        }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      // 注入项目信息
      new BilldHtmlWebpackPlugin({ nuxt2: true }),
    ].filter(Boolean),

    babel: {
      plugins: [
        [
          'component',
          { libraryName: 'element-ui', styleLibraryName: 'theme-chalk' },
        ],
      ],
    },
    /**
     * extractCSS，默认false
     * 所有CSS将被提取到单独的文件中，通常每个组件一个。
     * 这允许单独缓存CSS和JavaScript，如果您有大量全局或共享CSS，值得一试。
     */
    extractCSS: true,

    optimization: {
      // 拆分大文件
      splitChunks: {
        cacheGroups: {
          // commons: {
          //   // name: 'commons',
          //   test: /[\\/]src[\\/]/,
          //   chunks: 'all',
          //   maxSize: 80 * 1024,
          //   minChunks: 2, // 至少被minChunks个入口文件引入了minChunks次。
          //   priority: 20,
          // },
          defaultVendors: {
            // 重写默认的defaultVendors
            chunks: 'initial',
            minSize: 40 * 1024,
            maxSize: 80 * 1024,
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            // 重写默认的default
            chunks: 'all',
            minSize: 40 * 1024,
            maxSize: 80 * 1024,
            priority: 30,
          },
        },
      },
      minimize: true, // 是否开启Terser,默认就是true，设置false后，不会压缩和转化
      minimizer: [
        !isDevelopment &&
          new TerserPlugin({
            parallel: true, // 使用多进程并发运行以提高构建速度
            extractComments: false, // 去除打包生成的bundle.js.LICENSE.txt
            terserOptions: {
              // Terser 压缩配置
              parse: {
                // default {},如果希望指定其他解析选项，请传递一个对象。
              },
              compress: {
                // default {},传递false表示完全跳过压缩。传递一个对象来指定自定义压缩选项。
                arguments: true, // default: false,尽可能将参数[index]替换为函数参数名
                dead_code: true, // 删除死代码，默认就会删除，实际测试设置false也没用，还是会删除
                toplevel: false, // default: false,在顶级作用域中删除未引用的函数("funcs")和/或变量("vars"), 设置true表示同时删除未引用的函数和变量
                keep_classnames: false, // default: false,传递true以防止压缩器丢弃类名
                keep_fnames: false, // default: false,传递true以防止压缩器丢弃函数名
              },
              /**
               * mangle,默认值true,会将keep_classnames,keep_fnames,toplevel等等mangle options的所有选项设为true。
               * 传递false以跳过篡改名称，或者传递一个对象来指定篡改选项
               */
              mangle: true,
              toplevel: true, // default false,如果希望启用顶级变量和函数名修改,并删除未使用的变量和函数,则设置为true。
              keep_classnames: true, // default: undefined,传递true以防止丢弃或混淆类名。
              keep_fnames: true, // default: false,传递true以防止函数名被丢弃或混淆。
            },
          }),
      ].filter(Boolean),
    },

    // transpile: [/^element-ui/],

    extend(config, { isDev, isClient, isServer }) {
      // Extend only webpack config for client-bundle
      console.log('isDev, isClient, isServer', isDev, isClient, isServer);

      if (isDev && isClient) {
        // https://v4.webpack.docschina.org/configuration/devtool/
        config.devtool = 'cheap-eval-source-map';
      }

      if (!isDev && isClient) {
        // 如果不是开发环境且当前是客户端（服务端是不会用cdn加载的，也用不了cdn加载），则使用cdn加载这些库
        // WARN 版本问题不可控，为了安全起见，还是别调用第三方的cdn了
        config.externals = config.externals || {};
        // Object.assign(config.externals, {
        //   vue: 'Vue',
        //   vuex: 'Vuex',
        //   'vue-router': 'VueRouter',
        //   axios: 'axios',
        // });
      }
    },
  },
};
