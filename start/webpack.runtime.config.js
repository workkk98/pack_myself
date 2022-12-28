const path = require('path')

module.exports = {
  entry: "./src/async-import.js",
  mode: "development",
  devtool: false,
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
};