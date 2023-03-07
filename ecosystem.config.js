module.exports = {
  apps: [
    {
      name: 'nuxt-blog-client-null-3000',
      exec_mode: 'cluster', // cluster,fork
      instances: '3',
      // cwd: `/Users/huangshuisheng/Desktop/hss/galaxy-s10/nuxt-blog-client`,
      // cwd: `${process.cwd()}`,
      script: './node_modules/nuxt/bin/nuxt.js',
      args: `start`,
      // watch: false,
      env: {
        BASE_ENV: 'prod',
      },
    },
  ],
};
