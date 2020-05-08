// config/webpack.server.config.js
const nodeExternals = require("webpack-node-externals");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const path = require("path");
const merge = require("webpack-merge");

const base = require("./webpack.base.config");
const srcPath = path.resolve(process.cwd(), "src/web");

module.exports = merge(base, {
  entry: path.join(srcPath, "server-entry.js"),
  target: "node",
  // This tells the server bundle to use Node-style exports
  output: {
    libraryTarget: "commonjs2",
  },

  // This is a plugin that turns the entire output of the server build
  // into a single JSON file. The default file name will be
  // `vue-ssr-server-bundle.json`
  plugins: [new VueSSRServerPlugin(), new VueLoaderPlugin()],
});
