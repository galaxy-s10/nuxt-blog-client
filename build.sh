#!/usr/bin/env bash
###
# Author: shuisheng
# Email: 2274751790@qq.com
# Github: https://github.com/galaxy-s10
# Date: 2022-01-10 14:13:00
# LastEditTime: 2022-02-08 02:18:00
# Description: https://gitee.com/galaxy-s10/nuxtblog-client
###

# 约定$1为任务名, $2为环境, $3为Jenkins工作区
JOBNAME=$1 # 注意: JOBNAME=$1,这个等号左右不能有空格！
ENV=$2
WORKSPACE=$3
PUBLICDIR=/node

echo 删除node_modules:
rm -rf node_modules

echo 查看npm版本:
npm -v

echo 设置npm淘宝镜像:
npm config set registry http://registry.npm.taobao.org/

echo 查看当前npm镜像:
npm get registry

if ! type yarn >/dev/null 2>&1; then
  echo yarn未安装,先全局安装yarn
  npm i yarn -g
else
  echo yarn已安装
fi

echo 查看yarn版本:
yarn -v

echo 设置yarn淘宝镜像:
yarn config set registry https://registry.npm.taobao.org

echo 查看当前yarn镜像:
yarn config get registry

echo 开始安装依赖:
yarn install
