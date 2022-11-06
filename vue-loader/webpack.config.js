// webpack.config.js
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: path.resolve(__dirname, 'src/app.vue'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name:6]-[contenthash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              // localIdentName: '[local]_[hash:base64:8]',
            }
          }
        ]
      },
      {
        resourceQuery: /blockType=markdown/,
        use: [
         {
            options: {
              name: 'prettier'
            },
            loader: 'prettierscript-loader'
          },
          'html-loader',
          'markdown-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolveLoader: {
    modules: ['node_modules','./'],
  }
}