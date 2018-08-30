const path = require('path');
const config = {
	entry: './src/common/js/app.js',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			query: {
				compact: false
			},
			exclude: /node_modules/
		}, {
			test: /\.(css|scss)$/,
			use: ['style-loader', 'css-loader', 'sass-loader?sourceMap!import-glob-loader']
		}, {
			test: /\.(eot|svg|woff|woff2|ttf|gif)$/,
			use: 'url-loader'
		}]
	},
	resolve: {
		modules: [
			path.resolve('./node_modules')
		]
	},
	performance: {
		hints: false
	}
};
module.exports = config;