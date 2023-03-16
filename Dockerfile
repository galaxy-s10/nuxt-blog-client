FROM node:16.19.0
EXPOSE 3000

ARG BILLD_JOBNAME
ARG BILLD_ENV
ARG BILLD_PORT

# https://medium.com/@yangcar/arg-in-dockerfile-cmd-db22c2bc7b62
# https://stackoverflow.com/questions/35560894/is-docker-arg-allowed-within-cmd-instruction/35562189#35562189
ENV BILLD_JOBNAME ${BILLD_JOBNAME}
ENV BILLD_ENV ${BILLD_ENV}
ENV BILLD_PORT ${BILLD_PORT}

# https://github.com/pnpm/pnpm/issues/4495
ENV PNPM_HOME="/billd/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

WORKDIR /billd/nuxt-blog-client

COPY package.json .
COPY pnpm-lock.yaml .
COPY .npmrc .

RUN cd /billd/nuxt-blog-client

RUN echo 开始全局安装pnpm:
RUN npm i pnpm -g

RUN echo 开始全局安装pm2:
RUN pnpm i pm2 -g

COPY . .

RUN echo node版本:    $(node -v)
RUN echo npm版本:     $(npm -v)
RUN echo pnpm版本:    $(pnpm -v)
RUN echo pm2版本:     $(pm2 -v)
RUN echo git版本:     $(git --version)

RUN echo 当前路径:     $(pwd)
RUN echo 当前文件:     $(ls -l)

RUN echo JOBNAME:     ${BILLD_JOBNAME}
RUN echo ENV:         ${BILLD_ENV}
RUN echo PORT:        ${BILLD_PORT}

# WARN 再执行pm2-runtime时，先执行一下pm2 list或者pm2 save或者pm2 -v，否则的话直接执行pm2-runtime可能会导致报错，原因未知！！！
CMD pnpm i && npm run deploy:prod &&  pm2 -v && pm2 list && pm2-runtime start './node_modules/nuxt/bin/nuxt.js' --name ${BILLD_JOBNAME}-${BILLD_ENV}-${BILLD_PORT} -i max -- start

# CMD一个文件中只能有一条指令Dockerfile。如果您列出多个，CMD 则只有最后一个CMD会生效。

# 会退出容器
# CMD pm2 start './node_modules/nuxt/bin/nuxt.js' --name nuxt-blog-client-null-3000  -i max -- start

# 单线程没问题，OK
# CMD pm2-runtime start './node_modules/nuxt/bin/nuxt.js' --name nuxt-blog-client-null-3000 -- start

# 多线程报错，nuxt路径拼接错误：/Users/huangshuisheng/Desktop/hss/galaxy-s10/nuxt-blog-client/node_modules/nuxt/bin/nuxt.js/.nuxt/dist/server.
# CMD pm2-runtime start './node_modules/nuxt/bin/nuxt.js' --name nuxt-blog-client-null-3000 -i max -- start

# 没问题，OK
# CMD pm2-runtime start ecosystem.config.js
