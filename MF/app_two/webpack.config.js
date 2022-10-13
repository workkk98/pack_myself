const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map', // 打开工具 查看错误行数
  context: __dirname, // 整个上下文的路径
  entry: {
    app_one_remote: {
      import: './src/index.js',
      // runtime: 'common-runtime'
    },
  },
  output: {
    publicPath: "http://localhost:9011/",
    filename: 'bundle-[name].js',
    path: path.resolve(__dirname , './dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              ['@babel/preset-react']
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'app_two',
      template: 'index.html'
    }),
    new ModuleFederationPlugin({
      name: 'app_one_remote',
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {
        "./dialog": "./src/dialog",
      },
    })
  ],
  resolve: {
    extensions: [".jsx", ".js", ".json"],
    alias: {
      assets: '../assets/'
    }
  },
  optimization: {
    usedExports: true,
    minimize: false,
  }
}
