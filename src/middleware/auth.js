export default function ({ store, redirect }) {
  console.log('========auth中间件========');
  const app = store.state.app;
  if (app.apiError.errorCode !== -1) {
    return redirect('/error');
  }
  if (app.frontendData && app.frontendData.allow_shutdown_modal.value === '1') {
    return redirect('/error');
  }
}
