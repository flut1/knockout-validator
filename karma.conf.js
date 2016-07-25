var path = require('path');

module.exports = function (config)
{
	config.set({
		frameworks: ['mocha', 'chai'],
		files: [
			'./test/index.ts'
		],
		exclude: [],
		preprocessors: {
			'./src/**/*.ts': [
				'webpack',
				'coverage',
				'sourcemap'
			],
			'./test/**/*.ts': [
				'webpack',
				'sourcemap'
			]
		},
		webpack: require('./config/webpack.config.test')(),
		webpackServer: { noInfo: true },
		reporters: ['progress', 'coverage', 'karma-remap-istanbul'],
		coverageReporter: {
			dir: 'coverage',
			reporters: [
				{ type: 'json', subdir: '.' },
				{ type: 'text' }
			]
		},
		remapIstanbulReporter: {
			src: 'coverage/coverage-final.json',
			reports: {
				lcovonly: 'coverage/lcov.info',
				html: 'coverage/report'
			},
			timeoutNotCreated: 5000,
			timeoutNoMoreFiles: 1000
		},
		logLevel: config.LOG_INFO,
		browsers: ['PhantomJS'],
		port: 9876,
		colors: true,
		autoWatch: true,
		singleRun: false,
		concurrency: Infinity
	})
};
