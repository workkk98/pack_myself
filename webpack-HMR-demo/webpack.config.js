const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueloaderPlugin = require('vue-loader-plugin');

module.exports = {
	mode: 'development',
	entry: {
		index: './index.js',
		vueDemo: './vueDemo.js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader'
			}
		]
	},
	output: {
		filename: '[name]-bundle.js',
		path: path.join(__dirname, 'dist')
	},
	devServer: {
		contentBase: './dist'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new VueloaderPlugin()
	]
}