import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    routes: [
      {
        path: "/blog",
        component: () => import("../views/home/index.vue"),
        name: "home",
      },
      {
        path: "/blog/about",
        component: () => import("../views/about/index.vue"),
        name: "about",
      },
    ],
  });
}
