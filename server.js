// const express = require("express");
const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const mount = require("koa-mount");
const path = require("path");
const fs = require("fs");
const vueServerRenderer = require("vue-server-renderer");
const setupDevServer = require("./config/setup-dev-server");

const port = 3000;
const app = new Koa();
const router = new Router();

const createRenderer = (bundle) =>
  vueServerRenderer.createBundleRenderer(bundle, {
    runInNewContext: false,
    template: fs.readFileSync(
      path.resolve(__dirname, "dist/index.html"),
      "utf-8"
    ),
  });
let renderer;

if (process.env.NODE_ENV === "development") {
  setupDevServer(app, (serverBundle) => {
    renderer = createRenderer(serverBundle);
  });
} else {
  renderer = createRenderer(require("./dist/vue-ssr-server-bundle.json"));
}

// you may want to serve static files with nginx or CDN
router.get("/", async (ctx, next) => {
  const context = {
    url: "/blog",
    state: {
      title: "Vue SSR Simple Steps",
      users: [],
    },
  };
  ctx.body = await renderer.renderToString(context);
});
router.get("/about", async (ctx, next) => {
  const context = {
    url: "/blog/about",
    state: {
      title: "Vue SSR Simple Steps",
      users: [],
    },
  };
  ctx.body = await renderer.renderToString(context);
});

router.get("/users", async (ctx, next) => {
  ctx.type = "json";
  ctx.body = JSON.stringify([
    {
      name: "Albert",
      lastname: "Einstein",
    },
    {
      name: "Isaac",
      lastname: "Newton",
    },
    {
      name: "Marie",
      lastname: "Curie",
    },
  ]);
});

const assets = new Koa();
assets.use(serve(__dirname + "/dist/"));

const blogApp = new Koa();
blogApp.use(router.routes()).use(router.allowedMethods());

app.use(mount("/public", assets));
app.use(mount("/blog", blogApp));

app.on("error", (error, ctx) => {
  // console.error("server error", error);
  if (error.code === 404) {
    ctx.status = 404;
    ctx.body = "404 | Page Not Found";
  } else {
    ctx.status = 500;
    ctx.body = "500 | Internal Server Error";
  }
});

app.listen(port, () => {
  console.log(`Listening on: ${port}`);
  console.log(`Open in browser: http://localhost:${port}`);
});
