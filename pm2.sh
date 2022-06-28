#!/usr/bin/env bash
###
# Author: shuisheng
# Email: 2274751790@qq.com
# Github: https://github.com/galaxy-s10
# Date: 2022-01-10 15:25:30
# LastEditTime: 2022-06-28 22:58:09
# Description: pm2维护脚本
###

# 约定$1为任务名, $2为环境, $3为Jenkins工作区, $4为端口号
JOBNAME=$1 # 注意: JOBNAME=$1,这个等号左右不能有空格！
ENV=$2
WORKSPACE=$3
PORT=$4
PUBLICDIR=/node

if ! type pm2 >/dev/null 2>&1; then
  echo pm2未安装,先全局安装pm2
  npm i pm2 -g
else
  echo pm2已安装
fi

# 注意：要先进入项目所在的目录，然后再执行pm2命令!!!
# 否则的话约等于在其他目录执行npm run dev,如果所在的目录没有package.json文件就会报错！
if [ $ENV != 'null' ]; then
  cd $PUBLICDIR/$JOBNAME/$ENV
else
  cd $PUBLICDIR/$JOBNAME/
fi

echo 删除旧的pm2服务:
pm2 del $JOBNAME-$ENV-$PORT

echo 开始构建:
yarn build

echo 使用pm2维护:
pm2 start npm --name $JOBNAME-$ENV-$PORT -- run start
pm2 save
# pm2 start npm --name $JOBNAME -- run dev
