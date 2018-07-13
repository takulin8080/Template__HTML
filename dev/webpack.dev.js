const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const config = {
	mode: 'development',
	cache: true,
	devtool: 'source-map'
};
module.exports = merge(common, config);