const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

function resolve(name) {
  return path.resolve(__dirname,`./${name}`)
}


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    contentBase: 'dist',
    hot: true
  },
  output: {
    path: resolve('dist'),
    filename: '[name]-[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'multi-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  resolveLoader: {
    modules: ['node_modules','./'],
  }
}