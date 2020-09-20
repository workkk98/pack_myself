const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map', // 打开工具 查看错误行数
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  output: {
    path: path.resolve('./', 'dist'),
    filename: '[name]-[hash:8].js'
  },
  module: {
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin()
  ]
}