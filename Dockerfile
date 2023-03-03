FROM node:16.19.0
EXPOSE 3000

ARG BILLD_JOBNAME
ARG BILLD_ENV
ARG BILLD_PROT


# https://github.com/pnpm/pnpm/issues/4495
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

WORKDIR /Users/huangshuisheng/Desktop/hss/galaxy-s10/nuxt-blog-client

COPY . /Users/huangshuisheng/Desktop/hss/galaxy-s10/nuxt-blog-client

RUN cd /Users/huangshuisheng/Desktop/hss/galaxy-s10/nuxt-blog-client

RUN echo 开始全局安装pnpm:
RUN npm i pnpm -g

RUN echo 开始pnpm安装依赖:
RUN pnpm i

RUN echo 开始全局安装pm2:
RUN pnpm i pm2 -g

RUN echo node版本:     $(node -v)
RUN echo npm版本:     $(npm -v)
RUN echo pnpm版本:    $(pnpm -v)
RUN echo pm2版本:     $(pm2 -v)

RUN echo 当前路径:     $(pwd)
RUN echo 当前文件:     $(ls -l)

RUN npm run build

# CMD ["npm", "run","start"]

# CMD一个文件中只能有一条指令Dockerfile。如果您列出多个，CMD 则只有最后一个CMD会生效。
# CMD ["sh","./pm2.sh"]
CMD ["pm2","start","'./node_modules/nuxt/bin/nuxt.js'",'--name']


