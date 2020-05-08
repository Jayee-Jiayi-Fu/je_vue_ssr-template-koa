const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const srcPath = path.resolve(process.cwd(), "src/web");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: isProduction ? "source-map" : "eval-source-map",
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
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
              name: "/[path][name].[hash:7].[ext]",
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
              name: "[name].[hash:7].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: "[name].[contenthash:6].css",
          }),
          new HtmlWebpackPlugin({
            template: path.resolve(process.cwd(), "index.html"),
            minify: false,
          }),
        ]
      : [
          new MiniCssExtractPlugin({
            filename: "[name].css",
            hmr: true,
          }),
        ]),
  ],
  optimization: {
    minimize: true,
  },
  performance: {
    hints: "error",
  },
};
