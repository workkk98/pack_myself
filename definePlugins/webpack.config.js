const path = require('path')
const resolve = function (...args) {
  return path.resolve('./', ...args)
}

const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: resolve('dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      TARGET: JSON.stringify(process.env.NODE_ENV),
      VERSION: JSON.stringify('5fa3b9'),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: '1+1',
      'typeof window': JSON.stringify('object'),
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      'typeof mobile': JSON.stringify('mobile')
    })
  ]
}