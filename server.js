// const express = require("express");
const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const mount = require("koa-mount");
const path = require("path");
const fs = require("fs");
const LRU = require("lru-cache");
const compress = require("koa-compress");
const { createBundleRenderer } = require("vue-server-renderer");

const isProd = process.env.NODE_ENV === "production";
const port = 3000;
const app = new Koa();
const router = new Router();
const templatePath = path.resolve(__dirname, "./index.html");
const serverInfor = `koa/${
  require("koa/package.json").version
} vue-server-renderer/${require("vue-server-renderer/package.json").version}`;

let renderer;
let readypromise;

function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      cache: new LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15,
      }),
      basedir: path.resolve(__dirname, "./dist"),
      runInNewContext: false,
    })
  );
}

// 根据环境确定 renderer
// 生产环境中可直接用于生产返回
// 开发环境是一个promise
if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");
  const template = fs.readFileSync(templatePath, "utf-8"),
    renderer = createRenderer(serverBundle, { clientManifest, template });
} else {
  // 开发环境中：开启dev server 来热重载
  readyPromise = require("./config/setup-dev-server")(
    app,
    templatePath,
    (serverBundle, options) => {
      renderer = createRenderer(serverBundle, options);
    }
  );
}

// 调用renderer，组装响应
async function render(ctx, next) {
  ctx.type = "html";
  ctx.append("Server", serverInfor);

  let context = ctx.content || {};
  context = Object.assign({ url: ctx.originalUrl }, context);

  const result = await renderer.renderToString(context);
  console.log("result..........", result);
  ctx.response.body = result;
}

app.use(
  compress({
    threshold: 0,
  })
);
app.use(compress({ threshold: 0 }));
app.use(serve("./public"));
app.use(serve("./dist"));

router.get(
  "*",
  isProd ? render : (ctx, next) => readyPromise.then(() => render(ctx, next))
);
app.use(router.routes());
// const blogApp = new Koa();
// blogApp.use(router.routes());
// app.use(mount("/blog", blogApp));

// const assetsApp = new Koa();
// assetsApp.use(serve(path.resolve(__dirname, "./dist")));
// app.use(mount("/public", assetsApp));

app.on("error", (err, ctx) => {
  if (err.url) {
    ctx.redirect(err.url);
  } else if (err.code === 404) {
    ctx.status = 404;
    ctx.body = "404 | Page Not Found";
  } else {
    // Render Error Page or Redirect
    ctx.status = 500;
    ctx.body = "500 | Internal Server Error";
    console.error(`error during render : ${ctx.url}`);
    console.error(err.stack);
  }
});

app.listen(port, () => {
  console.log(`Listening on: ${port}`);
  console.log(`Open in browser: http://localhost:${port}`);
});
