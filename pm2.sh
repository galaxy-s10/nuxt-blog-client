#!/usr/bin/env bash
###
# Author: shuisheng
# Date: 2022-04-26 01:54:48
# Description: https://github.com/galaxy-s10/sh/blob/master/pm2.sh
# Email: 2274751790@qq.com
# FilePath: /github/nuxt-blog-client/pm2.sh
# Github: https://github.com/galaxy-s10
# LastEditTime: 2022-10-16 11:38:06
# LastEditors: shuisheng
###

# 生成头部文件快捷键：ctrl+cmd+i

# 静态部署的项目，一般流程是在jenkins里面执行build.sh进行构建，
# 构建完成后会连接ssh，执行/node/sh/frontend.sh，frontend.sh会将构建的完成资源复制到/node/xxx。
# 复制完成后，frontend.sh会执行清除buff/cache操作

# node项目，一般流程是在jenkins里面执行build.sh进行构建，
# 构建完成后会连接ssh，执行/node/sh/node.sh，node.sh会将构建的完成资源复制到/node/xxx，并且执行/node/xxx/pm2.sh。
# 最后，node.sh会执行清除buff/cache操作

# 注意:JOBNAME=$1,这个等号左右不能有空格！
JOBNAME=$1      #约定$1为任务名
ENV=$2          #约定$2为环境
WORKSPACE=$3    #约定$3为Jenkins工作区
PORT=$4         #约定$4为端口号
TAG=$5          #约定$5为git标签
PUBLICDIR=/node #约定公共目录为/node

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

if ! type pm2 >/dev/null 2>&1; then
  echo 'pm2未安装,先全局安装pm2'
  npm install pm2 -g
  pm2 update
else
  echo 'pm2已安装'
fi

echo 查看pm2版本:
pm2 -v

# 注意：要先进入项目所在的目录，然后再执行pm2命令!!!
# 否则的话约等于在其他目录执行npm run dev,如果所在的目录没有package.json文件就会报错！
if [ $ENV != 'null' ]; then
  cd $PUBLICDIR/$JOBNAME/$ENV
else
  cd $PUBLICDIR/$JOBNAME/
fi

echo 删除旧的pm2服务:
pm2 del $JOBNAME-$ENV-$PORT

# 上传七牛云cdn：https://github.com/qiniu/qshell/blob/master/docs/qupload.md
# 注意--rescan-local这个参数，不设置它的话可能文件不发生更改就不会覆盖
qshell qupload2 --src-dir=$PUBLICDIR/$JOBNAME/.nuxt/dist/client --bucket=hssblog --overwrite=true --key-prefix=$JOBNAME/$TAG/ --rescan-local=true

echo 使用pm2维护:
pm2 start npm --name $JOBNAME-$ENV-$PORT -- run start
pm2 save
# pm2 start npm --name $JOBNAME -- run dev
