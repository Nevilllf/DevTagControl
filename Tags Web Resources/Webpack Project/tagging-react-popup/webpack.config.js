const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production", // ensures minification and tree shaking
  entry: "./src/index.tsx",
  output: {
    filename: "tagging_popup_loader.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // this already deletes old files in webpack 5+
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // fully clears dist
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "tagging_popup.html",
      inject: "body", // ensures scripts go at end of body
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
};
