import 'mdn-polyfills/dist/Array.find';
require<any>('es6-promise').polyfill();
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

// require all unit test files
const unitTestContext = require.context(
	'./unit/',
	true,
	/Spec\.ts/
);
unitTestContext.keys().forEach(unitTestContext);

// require all integration test files
const integrationTestContext = require.context(
	'./integration/',
	true,
	/Test\.ts/
);
integrationTestContext.keys().forEach(integrationTestContext);

// require all source files
const sourcesContext = require.context(
	'../src/',
	true,
	/\.ts$/
);

sourcesContext.keys().forEach(sourcesContext);
