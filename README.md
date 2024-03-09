# 简介

基于 nuxt2.x + elementui 搭建的博客

# 预览

线上地址：[https://www.hsslive.cn](https://www.hsslive.cn)

# 功能

- [x] 登录/注册
  - [x] qq 登录
  - [x] github 登录
- [x] 文章
- [x] 作品
- [x] 标签
- [x] 留言
- [x] 互动
- [x] 点赞
- [x] 流量/访客/用户信息

# 运行

> 注意：需要在本地启动一个 3300 端口的接口服务：[vue3-blog-server](https://github.com/galaxy-s10/vue3-blog-server)

## billd 依赖

```sh
pnpm i billd-utils@latest billd-scss@latest billd-deploy@latest billd-html-webpack-plugin@latest
```

| 包名                                                                                 | 版本                                                                                                                      |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [billd-html-webpack-plugin](https://github.com/galaxy-s10/billd-html-webpack-plugin) | [![npm](https://img.shields.io/npm/v/billd-html-webpack-plugin)](https://www.npmjs.com/package/billd-html-webpack-plugin) |
| [billd-utils](https://github.com/galaxy-s10/billd-utils)                             | [![npm](https://img.shields.io/npm/v/billd-utils)](https://www.npmjs.com/package/billd-utils)                             |
| [billd-scss](https://github.com/galaxy-s10/billd-scss)                               | [![npm](https://img.shields.io/npm/v/billd-scss)](https://www.npmjs.com/package/billd-scss)                               |
| [billd-deploy](https://github.com/galaxy-s10/billd-deploy)                           | [![npm](https://img.shields.io/npm/v/billd-deploy)](https://www.npmjs.com/package/billd-deploy)                           |

## 安装依赖

```sh
pnpm install
```

## 开发

```sh
pnpm run dev
```

## 构建

```sh
pnpm run build
```

## 运行

```sh
pnpm run start
```

# 部署

## ~~docker~~

```sh
sh build.sh nuxt-blog-client null workspace 3000 v0.0.1
```

```sh
sh docker.sh nuxt-blog-client null workspace 3000 v0.0.1
```

# 服务器环境

> 使用 docker 部署。

- ~~操作系统：CentOS Linux release 8.2.2004~~
- ~~nginx 版本：1.21.4~~
- ~~node 版本：14.19.0~~
- ~~redis 版本：5.0.3~~
- ~~mysql 版本：8.0.26~~
- ~~pm2 版本：5.1.2~~

# 注意

该项目是 nuxt2 项目，nuxt2 是基于 vue2 的，如果 vscode 安装了 vue3 的 Vue Language Features (Volar)插件，请禁用该插件，不然的话点击类似 components/NoHeadImg/index.vue 的路径会跳转不到对应的 vue 文件
