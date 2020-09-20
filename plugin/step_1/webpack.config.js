const path = require('path')
const resolve = function (...args) {
  return path.resolve('./', ...args)
}
const BasicPlugin = require('./plugin/basic');
const Other = require('./plugin/other');


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: resolve('dist'),
    filename: '[name]-[hash:8].js'
  },
  plugins: [
    new BasicPlugin(),
    new Other()
  ]
}