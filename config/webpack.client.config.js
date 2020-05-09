const webpack = require("webpack");
const path = require("path");
// const webpack = require("webpack");
const merge = require("webpack-merge");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const base = require("./webpack.base.config");
const srcPath = path.resolve(process.cwd(), "src/web");
const SWPrecachePlugin = require("sw-precache-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";

const config = merge(base, {
  entry: {
    client: path.join(srcPath, "client-entry.js"),
  },

  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "create-api": "./create-api-client.js",
    },
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.VUE_ENV": '"client"',
    }),
    new VueSSRClientPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
});

if (isProd) {
  config.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: "vue-hn",
      filename: "service-worker.js",
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: "/",
          handler: "networkFirst",
        },
        {
          urlPattern: /\/(top|new|show|ask|jobs)/,
          handler: "networkFirst",
        },
        {
          urlPattern: "/item/:id",
          handler: "networkFirst",
        },
        {
          urlPattern: "/user/:id",
          handler: "networkFirst",
        },
      ],
    })
  );
}

module.exports = config;
