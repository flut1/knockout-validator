/*eslint-disable */
var webpack = require('webpack');
var path = require('path');

module.exports = function()
{
	return {
		resolve: {
			extensions: ['', '.ts', '.js']
		},
		entry: [
			'./src/index.ts'
		],
		output: {
			library: "KnockoutValidator"
		},
		module: {
			loaders: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					loader: 'awesome-typescript-loader',
					query: {
						tsconfig: 'config/tsconfig.webpack.json'
					}
				}
			]
		},
		plugins: [],
		stats: {
			colors: true
		}
	};
};
