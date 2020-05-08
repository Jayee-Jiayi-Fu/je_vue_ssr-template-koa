import { createApp } from "./app";

const { app, router } = createApp({ state: window.__INITIAL_STATE__ });

import "./assets/styles/global.scss";

router.onReady(() => {
  app.$mount("#app");
});
