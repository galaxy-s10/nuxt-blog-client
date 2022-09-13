import path from 'path';

import { VERSION as axiosVersion } from 'axios';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { version as vueVersion } from 'vue';
import { version as vueRouterVersion } from 'vue-router';
import vuex from 'vuex';
import webpack from 'webpack';

import InjectProjectInfoPlugin from './InjectProjectInfoPlugin';
import pkg from './package.json';
import { QINIU_CDN_URL } from './src/constant';

const isDevelopment = process.env.NODE_ENV === 'development';

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
    // 如果不是开发环境，则使用cdn加载这些库
    script: !isDevelopment && [
      { src: `https://unpkg.com/vue@${vueVersion}/dist/vue.runtime.min.js` },
      { src: `https://unpkg.com/vuex@${vuex.version}/dist/vuex.min.js` },
      {
        src: `https://unpkg.com/vue-router@${vueRouterVersion}/dist/vue-router.min.js`,
      },
      { src: `https://unpkg.com/axios@${axiosVersion}/dist/axios.min.js` },
    ],
  },
  alias: {
    '@': path.resolve(__dirname, './src/'),
    components: path.resolve(__dirname, './src/components'),
    layouts: path.resolve(__dirname, './src/layouts'),
  },
  corejs: 3,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // 'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/main.scss',
    'normalize.css/normalize.css',
  ],
  srcDir: 'src/',
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/element-ui',
    '@/plugins/vue-lazyload',
    '@/plugins/filters',
    '@/plugins/router',
    { src: '@/plugins/tip' },
  ],
  // router: {
  //   // Run the middleware/auth.js on every page
  //   middleware: 'auth',
  // },

  loading: { color: '#0984e3' },

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
    '/prodapi': {
      target: 'http://42.193.157.44:3200',
      secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
      changeOrigin: true,
      pathRewrite: {
        '^/prodapi': '', // 效果：/api/link/list ==> http://42.193.157.44:3200/link/list
      },
    },
    '/betaapi': {
      target: 'http://42.193.157.44:3300',
      secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
      changeOrigin: true,
      pathRewrite: {
        '^/betaapi': '', // 效果：/api/link/list ==> http://42.193.157.44:3300/link/list
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: `${QINIU_CDN_URL}${pkg.name}/v${pkg.version}`,

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
      new InjectProjectInfoPlugin({ isProduction: isDevelopment }),
    ].filter(Boolean),

    babel: {
      plugins: [
        [
          'component',
          { libraryName: 'element-ui', styleLibraryName: 'theme-chalk' },
        ],
      ],
    },
    extractCSS: false, // true:单独提取css为文件，省点cdn流量，不提取。
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
        config.externals = config.externals || {};
        Object.assign(config.externals, {
          vue: 'Vue',
          vuex: 'Vuex',
          'vue-router': 'VueRouter',
          axios: 'axios',
        });
      }
    },
  },
};
