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
			use: ['style-loader', 'css-loader', 'sass-loader?sourceMap']
		}, {
			test: /\.(eot|svg|woff|woff2|ttf|gif)$/,
			use: 'url-loader'
		}]
	}
};
module.exports = config;