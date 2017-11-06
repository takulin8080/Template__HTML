var path = require("path");
var webpack = require("webpack");
module.exports = {
	cache: true,
	entry: {
		app: './src/common/js/app.js'
	},
	output: {
		sourceMapFilename: "./dst/common/js/[name].js.map",
		filename: '[name].js',
	},
	module: {
		loaders: [{
			test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
			loader: 'url-loader'
		}, {
			test: /\.html$/,
			loader: 'html-loader'
		}, {
			test: /\.css$/,
			loaders: ['style-loader', 'css-loader']
		}, ]
	}
};
