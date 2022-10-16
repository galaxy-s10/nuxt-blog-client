#!/usr/bin/env bash

###
# Author: shuisheng
# Date: 2022-04-26 01:54:48
# Description: https://github.com/galaxy-s10/sh/blob/master/build.sh
# Email: 2274751790@qq.com
# FilePath: /nuxt-blog-client/build.sh
# Github: https://github.com/galaxy-s10
# LastEditTime: 2022-10-16 10:21:15
# LastEditors: shuisheng
###

# 生成头部文件快捷键：ctrl+cmd+i

# 该pm2.sh文件会在Jenkins构建完成后被执行
# 注意:JOBNAME=$1,这个等号左右不能有空格！
JOBNAME=$1      #约定$1为任务名
ENV=$2          #约定$2为环境
WORKSPACE=$3    #约定$3为Jenkins工作区
PORT=$4         #约定$4为端口号
TAG=$5          #约定$5为git标签
PUBLICDIR=/node #约定公共目录为/node

echo 删除node_modules:
rm -rf node_modules

echo 查看node版本:
node -v

echo 查看npm版本:
npm -v

echo 设置npm淘宝镜像:
npm config set registry https://registry.npm.taobao.org/

echo 查看当前npm镜像:
npm get registry

if ! type pnpm >/dev/null 2>&1; then
  echo 'pnpm未安装,先全局安装pnpm'
  npm i pnpm -g
else
  echo 'pnpm已安装'
fi

echo 查看pnpm版本:
pnpm -v

echo 设置pnpm淘宝镜像:
pnpm config set registry https://registry.npm.taobao.org/
pnpm config set @billd:registry http://registry.hsslive.cn/

echo 查看当前pnpm镜像:
pnpm config get registry
pnpm config get @billd:registry

echo 开始安装依赖:
pnpm install

echo 开始构建:
npx cross-env JENKINS_WORKSPACE=$3 nuxt build

echo 清除buff/cache:

sync
echo 3 >/proc/sys/vm/drop_caches
