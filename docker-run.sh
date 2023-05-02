#!/usr/bin/env bash
###
# Author: shuisheng
# Date: 2023-03-01 22:42:02
# Description: https://github.com/galaxy-s10/sh/
# Email: 2274751790@qq.com
# FilePath: /nuxt-blog-client/docker-run.sh
# Github: https://github.com/galaxy-s10
# LastEditors: shuisheng
# LastEditTime: 2023-04-21 21:57:47
###

# 生成头部文件快捷键: ctrl+cmd+i

# 静态部署的项目, 一般流程是在jenkins里面执行build.sh进行构建,
# 构建完成后会连接ssh, 执行/node/sh/frontend.sh, frontend.sh会将构建的完成资源复制到/node/xxx
# 最后, 服务器的/node/sh/frontend.sh会执行清除buff/cache操作

# node项目, 一般流程是在jenkins里面执行build.sh进行构建,
# 构建完成后会连接ssh, 执行/node/sh/node.sh, node.sh会将构建的完成资源复制到/node/xxx, 并且执行/node/xxx/node-pm2.sh
# 最后, 服务器的/node/sh/node.sh会执行清除buff/cache操作

# nuxt项目, 一般流程是在jenkins里面执行nuxt-build.sh进行构建,
# 构建完成后会连接ssh, 执行/node/sh/nuxt.sh, nuxt.sh会将构建的完成资源复制到/node/xxx, 并且执行/node/xxx/nuxt-pm2.sh
# 最后, 服务器的/node/sh/nuxt.sh会执行清除buff/cache操作

# docker项目, 一般流程是在jenkins里面执行docker-build.sh进行构建,
# 构建完成后会连接ssh, 执行/node/sh/docker.sh, 并且执行/node/xxx/docker-run.sh
# 最后, 服务器的/node/sh/docker.sh会执行清除buff/cache操作

# 注意: JOBNAME=$1, 这个等号左右不能有空格!
JOBNAME=$1      #约定$1为任务名
ENV=$2          #约定$2为环境
WORKSPACE=$3    #约定$3为Jenkins工作区
PORT=$4         #约定$4为端口号
TAG=$5          #约定$5为git标签
PUBLICDIR=/node #约定公共目录为/node

echo JOBNAME: $JOBNAME
echo ENV: $ENV
echo WORKSPACE: $WORKSPACE
echo PORT: $PORT
echo TAG: $TAG

echo 停掉旧的容器$JOBNAME-$ENV-$PORT-$TAG:
docker stop $JOBNAME-$ENV-$PORT-$TAG

echo 删掉旧的容器$JOBNAME-$ENV-$PORT-$TAG:
docker rm $JOBNAME-$ENV-$PORT-$TAG

echo 启动新的容器$JOBNAME-$ENV-$PORT-$TAG:
docker run --name $JOBNAME-$ENV-$PORT-$TAG -d -p $PORT:$PORT $JOBNAME-$ENV-$PORT
# sh pm2.sh $JOBNAME $ENV $WORKSPACE $PORT $TAG
