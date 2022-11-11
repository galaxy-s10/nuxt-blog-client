export default ({ app }) => {
  const hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?dfb02eddbeccf11629b56d7477284c6d';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hm, s);
  if (process.env.NODE_ENV !== 'development') {
    app.router.afterEach((to, from) => {
      try {
        window._hmt = window._hmt || [];
        window._hmt.push([
          '_trackPageview',
          JSON.stringify({ from: from.fullPath, to: to.fullPath }),
        ]);
      } catch (e) {}
    });
  }
};
