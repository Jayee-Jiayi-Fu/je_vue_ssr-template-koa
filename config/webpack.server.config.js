// config/webpack.server.config.js
const nodeExternals = require("webpack-node-externals");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const path = require("path");
const merge = require("webpack-merge");

const base = require("./webpack.base.config");
const srcPath = path.resolve(process.cwd(), "src/web");

module.exports = merge(base, {
  entry: path.join(srcPath, "server-entry.js"),
  target: "node",
  devtool: "source-map",
  // This tells the server bundle to use Node-style exports
  output: {
    libraryTarget: "commonjs2",
  },

  // 防止将某些 import的包打包到bundle中，
  // 而是在运行时(runtime)再去外部获取这些扩展依赖(external dependencies)
  // 可以通过多种编写方式实现：string,array,object,function,regex。
  externals: nodeExternals({
    // 通过列入白名单， 允许 webpack 将 node_modules 下所需文件打包
    whitelist: /\.css$/,
  }),

  // This is a plugin that turns the entire output of the server build
  // into a single JSON file. The default file name will be
  // `vue-ssr-server-bundle.json`
  plugins: [new VueSSRServerPlugin()],
});
