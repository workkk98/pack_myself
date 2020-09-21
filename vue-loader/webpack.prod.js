const merge = require('webpack-merge');
const common = require('./webpack.config');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge.merge(common, {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
});