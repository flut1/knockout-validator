/*eslint-disable */
var path = require('path');
var webpack = require('webpack');

module.exports = function()
{
	return {
		resolve: {
			extensions: ['', '.ts', '.js']
		},
		module: {
			loaders: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					loader: 'awesome-typescript-loader',
					query: {
						tsconfig: 'config/tsconfig.test.json'
					}
				}
			],
			postLoaders: [
				{
					test: /\.ts$/,
					loader: 'istanbul-instrumenter-loader',
					exclude: [
						/node_modules/,
						/test/,
						/Spec\.ts$/
					]
				}
			]
		},
		plugins: [
			new webpack.SourceMapDevToolPlugin({
				filename: null, // if no value is provided the sourcemap is inlined
				test: /\.(ts|js)($|\?)/i // process .js and .ts files only
			})
		]
	};
};
