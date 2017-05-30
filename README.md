# moxai

[![Moxai (mɒks-eɪ) - Express Middleware for API mocks using Open API Initiative (OAI)](https://img.shields.io/badge/moxai-(m%C9%92ks--e%C9%AA)-ff69b4.svg)](README.md)
[![npm](https://img.shields.io/npm/v/moxai.svg)](https://www.npmjs.com/package/moxai)
[![TravisCI](https://travis-ci.org/nci-ats/moxai.svg?branch=dev)](https://travis-ci.org/nci-ats/moxai)
[![Code Climate](https://codeclimate.com/github/nci-ats/moxai/badges/gpa.svg)](https://codeclimate.com/github/nci-ats/moxai)
[![Code Climate Coverage](https://codeclimate.com/github/nci-ats/moxai/badges/coverage.svg)](https://codeclimate.com/github/nci-ats/moxai/coverage)
[![Codecov](https://codecov.io/gh/nci-ats/moxai/branch/dev/graph/badge.svg)](https://codecov.io/gh/nci-ats/moxai)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ff4303a2eb3e43c9928d6d91e1000c66)](https://www.codacy.com/app/nci-ats/moxai)
[![bitHound Overall Score](https://www.bithound.io/github/nci-ats/moxai/badges/score.svg)](https://www.bithound.io/github/nci-ats/moxai)
[![bitHound Dependencies](https://www.bithound.io/github/nci-ats/moxai/badges/dependencies.svg)](https://www.bithound.io/github/nci-ats/moxai/dependencies/npm)
[![Gemnasium Dependency Status](https://gemnasium.com/badges/github.com/nci-ats/moxai.svg)](https://gemnasium.com/github.com/nci-ats/moxai)
[![VersionEye Dependency Status](https://www.versioneye.com/user/projects/58fd85f3710da23fe20fe874/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58fd85f3710da23fe20fe874)
[![GitHub Tags](https://img.shields.io/github/tag/nci-ats/moxai.svg)](https://github.com/nci-ats/moxai/tags)
[![GitHub Contributors](https://img.shields.io/github/contributors/nci-ats/moxai.svg)](https://github.com/nci-ats/moxai/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/nci-ats/moxai.svg)](https://github.com/nci-ats/moxai/issues)
[![Semver](https://img.shields.io/badge/SemVer-2.0-blue.svg)](http://semver.org/spec/v2.0.0.html)
[![license](https://img.shields.io/badge/license-CC0--1.0-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

Moxai (mɒks-eɪ) - [Express Middleware](https://expressjs.com/en/guide/using-middleware.html) for API mocks using [Open API Initiative (OAI)](https://www.openapis.org/)

* [Installation](#installation)
* [Usage](#usage)
* [Options](#options)
  * [dir](#dir)
  * [file](#file)
  * [random](#random)
* [Testing](#testing)
  * [Scripts](#scripts)
  * [Test Data](#test-data)
* [Dependencies](#dependencies)
  * [Modules](#modules)
  * [Application](#application)
  * [Package](#package)
  * [Dependency Trackers](#dependency-trackers)
* [Contact](#contact)
  * [Point of Contact](#point-of-contact)
  * [Notifications](#notifications)
* [Contributing](#contributing)
* [Acknowledgements](#acknowledgements)
* [License](#license)

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/). Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally).

```sh
npm install moxai --save
```

## Usage

Setup as standard [third-party middleware](https://expressjs.com/en/guide/using-middleware.html#middleware.third-party) which requires Express and mounting on a route, such as _'/mocks'_.

```javascript
var express = require('express');
var moxai = require('moxai');
var app = express();

app.use('/mocks', moxai());

app.listen(8000, function () {
  console.log('Express web server with Moxai listening on port 8000');
})
```

## Options

Options are passed as an object to moxai and all arguments are optional. 

```javascript
var opts = {
 'dir': 'mocks',
 'file': 'api',
 'random': false
};

app.use('/mocks', moxai(opts));

```

| Option | Type | Default | Argument | Description |
| ---- | ---- | ---- | ---- | ---- |
| dir | string | mocks | optional | The directory location of OAI files relative to parent directory. |
| file | string | api | optional | The name of OAI JSON file. Must be located within directory location. |
| random | boolean | false | optional | Use random output for regex values in OAI JSON file. |

### dir

The directory where the files are stored.  This is relative to the parent directory and the default is _mocks_. In most applications, simply add a _mocks_ directory in the root of the application.

```sh
/
├── mocks/
├── app.js|index.js
└── package.json
```

### file

The file of the OAI (formerly Swagger) JSON file to use. This is compatible with OAI [version 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md). This must have a .json extension and the default is _api_, therefore the default file is _api.json_. The file must be in the designated [directory](#dir), which defaults to _mocks_.  

```sh
/
├── mocks/
    └── api.json
├── app.js|index.js
└── package.json
```

Mock output should be in the response examples section of the OAI JSON. This should be the exact JSON output expected by the mock API request.

```json
{
  "swagger": "2.0",
  "paths": {
    "/api/": {
      "get": {
        "responses": {
          "200": {
            "examples": {
              "application/json": {
                "key": "value"
              }
            }
          }
        }
      }
    }
  }
}
```

### random

Randomizes the output from the OAI JSON using regular expressions. Only randomizes values that are valid regex and are enclosed in forward slashes (/).  Back slashes (\\) must be escaped by using double backslash (\\\\). Ignores any flags such as /i (ignore case) and /g (global). If error with regex, then will output original string.

```json
{
  "swagger": "2.0",
  "paths": {
    "/api/": {
      "get": {
        "responses": {
          "200": {
            "examples": {
              "application/json": {
                "alphanumeric": "/^[a-z0-9]{2,10}$/",
                "titlecase": "/^[A-Z][a-z]{4,16}$/",
                "phonenumber": "/^[1-9]\\d{2}-\\d{3}-\\d{4}/",
                "integer": "/[0-9]{1,7}/",
                "boolean": "/true|false/",
                "ignore": "/[[[ignore/"
              }
            }
          }
        }
      }
    }
  }
}
```

## Testing

### Scripts

* `npm test` to run [Mocha](https://mochajs.org/) unit tests.
* `npm run coverage` for [Istanbul](https://github.com/gotwarlost/istanbul) code coverage. *Results in `/coverage` folder.*
* `npm run lint` for [ESLint](http://eslint.org/) static code analysis. *Results in `/lint` folder.*
* `npm run docs` to run [JSDoc](http://usejsdoc.org/) code documentation. *Results in `/docs` folder*

### Test Data

* Files: Test [JSON](http://www.json.org/) files are stored in [test/mocks](https://github.com/nci-ats/moxai/tree/dev/test/mocks) directory

## Dependencies

### Modules

* Matchstick: [matchstick](https://matchstickjs.com/) >= [1.2.x](https://www.npmjs.com/package/matchstick)
* RandExp: [randexp](http://fent.github.io/randexp.js/) >= [0.4.x](https://www.npmjs.com/package/randexp)
* Traverse: [traverse](https://github.com/substack/js-traverse) >= [0.6.x](https://www.npmjs.com/package/traverse)

### Application

* Runtime: [Node.js](https://nodejs.org) >= [4.x](https://nodejs.org/en/download/releases/)
* Engine: [NPM](https://www.npmjs.com) >= [3.x](https://github.com/npm/npm/releases)
* Framework: [Express.js](https://expressjs.com/) >= [4.x](https://github.com/expressjs/express/releases)

### Package

* [package.json](https://github.com/nci-ats/moxai/blob/dev/package.json)
* [npm-shrinkwrap.json](https://github.com/nci-ats/moxai/blob/dev/npm-shrinkwrap.json)

### Dependency Trackers

* [Gemnasium](https://gemnasium.com/github.com/nci-ats/moxai/)
* [VersionEye](https://www.versioneye.com/user/projects/58fd85f3710da23fe20fe874)
* [Bithound](https://www.bithound.io/github/nci-ats/moxai/dependencies/npm)

## Contact

### Point of Contact

You can report issues and submit questions by opening a new [Issue](https://help.github.com/articles/creating-an-issue/) in GitHub.

### Notifications

You can [Watch](https://help.github.com/articles/watching-repositories/) this repo to receive notifications from GitHub when a new issue is posted, when an existing issue’s status is updated, and when a pull request is created.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Acknowledgements

This open source project was developed for the [U.S. Forest Service](https://www.fs.fed.us/) [ePermit API](https://github.com/nci-ats/fs-middlelayer-api) project under the General Services Administration ([GSA](https://www.gsa.gov)) Technology Transformation Service ([TTS](https://www.gsa.gov/tts)) [18F](https://18f.gsa.gov/) Agile Delivery Services Blanket Purchase Agreement ([Agile BPA](https://ads.18f.gov/)). Moxai is a testing dependency for the ePermit API which used this package as a temporary, placeholder mock API. Moxai is published as an independent [npm package](https://www.npmjs.com/package/moxai) that can be used with any [Express](https://expressjs.com/) application. 

## License

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
