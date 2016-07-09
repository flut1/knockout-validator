[![Travis](https://img.shields.io/travis/mediamonks/knockout-validator.svg?maxAge=2592000)](https://travis-ci.org/mediamonks/knockout-validator)
[![Code Climate](https://img.shields.io/codeclimate/github/mediamonks/knockout-validator.svg?maxAge=2592000)](https://codeclimate.com/github/mediamonks/knockout-validator)
[![Coveralls](https://img.shields.io/coveralls/mediamonks/knockout-validator.svg?maxAge=2592000)](https://coveralls.io/github/mediamonks/knockout-validator?branch=master)
[![npm](https://img.shields.io/npm/v/knockout-validator.svg?maxAge=2592000)](https://www.npmjs.com/package/knockout-validator)
[![npm](https://img.shields.io/npm/dm/knockout-validator.svg?maxAge=2592000)](https://www.npmjs.com/package/knockout-validator)

# knockout-validator

Add a description here...


## Installation

### npm

```sh
npm i -S knockout-validator
```

### manual

You can clone this repository and build the distribution files for use in
the browser yourself, and grab one of the following files from the
`/dist/` folder:

```sh
git clone git@github.com:mediamonks/knockout-validator.git
cd knockout-validator
npm i
npm run build-dist
```

- **/dist/umd** (bundled with webpack)
- **/dist/amd** (bundled with webpack)
- **/dist/commonjs2** (bundled with webpack, but why don't you use npm?)
- **/dist/browser** (bundled with webpack, available as `window.KnockoutValidator`)
- **/dist/system**
- **/dist/es6**

## Usage

```ts
import KnockoutValidator from 'knockout-validator';
// import KnockoutValidator from 'knockout-validator/lib/classname';

// do something with KnockoutValidator
```


## Documentation

View the [generated documentation](https://rawgit.com/mediamonks/knockout-validator/master/doc/typedoc/index.html).


## Building

In order to build knockout-validator, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/mediamonks/knockout-validator.git
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

[MIT](./LICENSE) © MediaMonks


