import { createApp } from "./app";
const isDev = process.env.NODE_ENV !== "production";

export default (context) => {
  // since there could potentially be asynchronous route hooks or
  // components, we will be returning a Promise so that the server can
  // wait until everything is ready before rendering.
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now();

    const { app, router, store } = createApp(context);

    // metadata is provided by vue-meta plugin
    // const meta = app.$meta();
    // context.meta = meta;

    const { url } = context;
    const { fullPath } = router.resolve(url).route;
    if (fullPath !== url) {
      return reject({ url: fullPath });
    }

    // 设置服务器端 router 的位置
    router.push(url);

    // wait until router has resolved possible async components and hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(
        matchedComponents.map(
          ({ asyncData }) =>
            asyncData &&
            asyncData({
              store,
              route: router.currentRoute,
            })
        )
      )
        .then(() => {
          isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`);

          // 状态添加到 render 的 context中，
          // 1. 暴露state
          // 2.请求时，template 能通过context 拿到state数据
          // 3.防止 client-side store 和 server-side store 重复获取初始数据
          context.state = store.state;
          resolve(app);
        })
        .catch(reject);
    }, reject);
  });
};
