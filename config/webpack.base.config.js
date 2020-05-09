const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const autoprefixer = require("autoprefixer");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const srcPath = path.resolve(process.cwd(), "src/web");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/dist/",
    filename: "[name].[hash:6].js",
  },
  devtool: isProd ? false : "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        include: [srcPath],
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [srcPath],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer],
            },
          },
          "sass-loader",
        ],
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "/[path][name].[hash:6].[ext]",
              context: srcPath,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "[name].[hash:6].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:6].css",
      chunkFilename: "[id].[contenthash:6].css",
      hmr: !isProd,
    }),
  ],
  optimization: {
    noEmitOnErrors: true,
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        // paraller: true,
        sourceMap: true,
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: { removeAll: true },
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          // 生成的共享模块bundle的名字
          name: "styles",
          test: /\.css$/,
          reuseExistingChunk: true,
        },
        vendor: {
          name: "vendormanifest",
          // initial”,：优化时只选择初始的chunks
          // async：优化时只选择所需要的chunks
          // all：优化时选择所有chunks 。
          chunks: "initial",
          // split前，有共享模块的chunks的最小数目 ，默认值是1
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
  performance: {
    hints: false,
  },
};
