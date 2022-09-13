export default ({ app, store, $myaxios }) => {
  app.router.beforeEach((to, from, next) => {
    // const isClient = process.client;
    // console.log(isClient);
    // if (isClient) {
    //   // 需要在nuxtServerInit里面用await dispatch('app/getFrontendData');
    //   const shutdown = store.state.app.frontendData.frontend_shutdown;
    //   console.log(shutdown, 'storestore');
    //   console.log('客户端跳转', to.path, from.path);
    //   if (to.path === '/msg') {
    //     next();
    //   } else {
    //     shutdown === 1 ? next('/msg') : next();
    //   }
    // } else {
    //   console.log('服务端跳转', to.path, from.path);
    //   next();
    // }
    next();
  });
};
