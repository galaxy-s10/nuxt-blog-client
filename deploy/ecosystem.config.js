module.exports = {
  apps: [
    {
      name: 'billd-blog',
      exec_mode: 'fork', // cluster,fork
      instances: '1',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: `start`,
      env: {
        BASE_ENV: 'prod',
        PORT: 3000,
      },
    },
  ],
};
