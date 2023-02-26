FROM node:16.19.0
EXPOSE 3000

WORKDIR /node/nuxt-blog-client

RUN cd /node/nux-blog-client

RUN npm i pnpm -g

RUN pnpm i pm2 -g

RUN npm run build

CMD ["./pm2.sh"]
