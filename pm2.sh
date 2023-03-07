#!/usr/bin/env bash
###
# Author: shuisheng
# Date: 2022-08-09 12:55:48
# Description: https://github.com/galaxy-s10/sh/
# Email: 2274751790@qq.com
# FilePath: /nuxt-blog-client/pm2.sh
# Github: https://github.com/galaxy-s10
# LastEditors: shuisheng
# LastEditTime: 2023-03-07 10:08:14
###

# 生成头部文件快捷键: ctrl+cmd+i

# 静态部署的项目, 一般流程是在jenkins里面执行build.sh进行构建,
# 构建完成后会连接ssh, 执行/node/sh/frontend.sh, frontend.sh会将构建的完成资源复制到/node/xxx
# 复制完成后, frontend.sh会执行清除buff/cache操作

# node项目, 一般流程是在jenkins里面执行build.sh进行构建,
# 构建完成后会连接ssh, 执行/node/sh/node.sh, node.sh会将构建的完成资源复制到/node/xxx, 并且执行/node/xxx/pm2.sh
# 最后, node.sh会执行清除buff/cache操作

# docker项目, 一般流程是在jenkins里面执行build.sh进行构建,
# 构建完成后会连接ssh, 执行/node/sh/docker.sh, 并且执行/node/xxx/docker.sh
# 最后, docker.sh会执行清除buff/cache操作

# 注意: JOBNAME=$1, 这个等号左右不能有空格!
JOBNAME=$1      #约定$1为任务名
ENV=$2          #约定$2为环境
WORKSPACE=$3    #约定$3为Jenkins工作区
PORT=$4         #约定$4为端口号
TAG=$5          #约定$5为git标签
PUBLICDIR=/node #约定公共目录为/node

echo 使用pm2维护:
pm2-runtime start './node_modules/nuxt/bin/nuxt.js' --name nuxt-blog-client-null-3000 -- start
# pm2-runtime start './node_modules/nuxt/bin/nuxt.js' --name $JOBNAME-$ENV-$PORT -i max -- start
