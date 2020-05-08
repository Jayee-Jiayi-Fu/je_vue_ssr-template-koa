const path = require("path");
// const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");
const isProduction = process.env.NODE_ENV === "production";
const srcPath = path.resolve(process.cwd(), "src/web");

module.exports = merge(base, {
  entry: {
    app: path.join(srcPath, "client-entry.js"),
  },
  output: {
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "/public",
    filename: isProduction ? "[name].[hash:6].js" : "[name].js",
    sourceMapFilename: isProduction
      ? "[name].[hash:6].js.map"
      : "[name].js.map",
  },
  resolve: {
    extensions: [".js", ".vue"],
  },
  optimization: {
    // splitChunks: {
    //   chunks: "all",
    // },

    // 自定义一组一组的 cache group来配对应的共享模块
    splitChunks: {
      cacheGroups: {
        commons: {
          // 生成的共享模块bundle的名字
          name: "vendor",
          // split前，有共享模块的chunks的最小数目 ，默认值是1
          minChunks: function (module) {
            return (
              /node_modules/.test(module.context) &&
              !/.css$/.test(module.request)
            );
          },
        },
      },
      cacheGroups: {
        commons: {
          name: "manifest",
          // initial”,：优化时只选择初始的chunks
          // async：优化时只选择所需要的chunks
          // all：优化时选择所有chunks 。
          chunks: "initial",
          // split前，有共享模块的chunks的最小数目 ，默认值是1
          // minChunks: 2,
        },
      },
    },
  },
});
