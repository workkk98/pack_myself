const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle-[name].js',
    path: path.resolve(__dirname , './dist'),
  }
}