/*eslint-disable */
var path = require('path');

module.exports = function()
{
	return {
		devtool: 'inline-source-map',
		resolve: {
			extensions: ['', '.ts', '.js']
		},
		entry: './test/index.ts',
		verbose: true,
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
		}
	};
};
