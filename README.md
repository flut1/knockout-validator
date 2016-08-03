[![Travis](https://img.shields.io/travis/flut1/knockout-validator.svg?maxAge=2592000)](https://travis-ci.org/flut1/knockout-validator)
[![Code Climate](https://img.shields.io/codeclimate/github/flut1/knockout-validator.svg?maxAge=2592000)](https://codeclimate.com/github/flut1/knockout-validator)
[![Coveralls](https://img.shields.io/coveralls/flut1/knockout-validator.svg?maxAge=2592000)](https://coveralls.io/github/flut1/knockout-validator?branch=master)
[![npm](https://img.shields.io/npm/v/knockout-validator.svg?maxAge=2592000)](https://www.npmjs.com/package/knockout-validator)
[![npm](https://img.shields.io/npm/dm/knockout-validator.svg?maxAge=2592000)](https://www.npmjs.com/package/knockout-validator)

# knockout-validator

TODO


## Installation

### npm

```sh
npm i -S knockout-validator
```

### other

Browser, amd, commonjs, umd, systemjs and es6 versions of this module 
are available on the [Github Releases](https://github.com/flut1/knockout-validator/releases).

## Usage

TODO


## Documentation

TODO


## Building

In order to build knockout-validator, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/flut1/knockout-validator.git
```

Change to the knockout-validator directory:
```sh
cd knockout-validator
```

Install dev dependencies:
```sh
npm install
```

Use one of the following main scripts:
```sh
npm run build   		# build this project
npm run generate   		# generate all artifacts (compiles ts, webpack, docs and coverage)
npm run typings			# install .d.ts dependencies (done on install)
npm run test-unit    	# run the unit tests
npm run validate		# runs validation scripts, including test, lint and coverage check
npm run lint			# run tslint on this project
npm run doc				# generate typedoc and yuidoc documentation
npm run typescript-npm	# just compile the typescript output used in the npm module
```

When installing this module, it adds a pre-commit hook, that runs the `validate`
script before committing, so you can be sure that everything checks out.

## Contribute

View [CONTRIBUTING.md](./CONTRIBUTING.md)


## Changelog

View [CHANGELOG.md](./CHANGELOG.md)


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © Floris Bernard


