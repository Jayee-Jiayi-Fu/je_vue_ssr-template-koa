// import Vue from "vue";
// import Vuex from "vuex";
// import Meta from "vue-meta";
// import App from "./App.vue";
// import { createRouter } from "./router";
// import createStore from "./store";

// Vue.use(Vuex);
// Vue.use(Meta, {
//   ssrAppId: 1,
// });

// export const createApp = (context) => {
//   const router = createRouter();
//   const store = createStore(context.state);

//   const app = new Vue({
//     store,
//     router,
//     render: (h) => h(App),
//   });

//   return { app, router, store };
// };

import Vue from "vue";
import App from "./App.vue";
import { createStore } from "./store";
import { createRouter } from "./router";
import { sync } from "vuex-router-sync";
import titleMixin from "./util/title";
import * as filters from "./util/filters";

// mixin for handling title
Vue.mixin(titleMixin);

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

export function createApp() {
  const store = createStore();
  const router = createRouter();

  // sync the router with the vuex store.
  // this registers `store.state.route`
  //提供路由的状态管理
  sync(store, router);

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store };
}
