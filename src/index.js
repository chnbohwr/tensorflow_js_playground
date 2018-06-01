import App from './app.js';
App();
if (module.hot) {
  module.hot.accept(function () {
    console.log('模块或其依赖项之一刚刚更新时');
    import('./app').then((App)=>{
      App.default();
    });
  });
}
console.log('app running');