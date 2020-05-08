import Vue from "vue";
import Router from "vue-router";
import About from "../views/about/index.vue";
import Home from "../views/home/index.vue";

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    routes: [
      {
        path: "/blog",
        component: Home,
        name: "home",
      },
      {
        path: "/blog/about",
        component: About,
        name: "about",
      },
    ],
  });
}
