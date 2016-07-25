import 'mdn-polyfills/dist/Array.find';
require('es6-promise').polyfill();
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

// require all test files
const testsContext = require.context(
	'./',
	true,
	/Spec\.ts/
);

testsContext.keys().forEach(testsContext);

// require all source files
const sourcesContext = require.context(
	'../src/',
	true,
	/\.ts$/
);

sourcesContext.keys().forEach(sourcesContext);
