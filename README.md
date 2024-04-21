# rs-ui-utils
Webpack based theme export utility library. Designed to be used both in FAM extension and the client app. 

## !Important
Keep in mind, that whenever new build is made, it is necessary to:
* Bump the version number
* Reinstall this dependency on all the projects that use it (currently client and rs-utilities/famextension)

## Requirements
* Node v8.3.0 or higher

## Features
* Webpack 3 based
* ES6 source
* Exports util functions
* Assigns rsUiUtils prop to the window object
* ESLint used

## Setup
Install all the required dependencies
```bash
$ npm install
``` 

## Scripts

* `$ npm run build` - runs the tests and produces production version of rs-ui-utils under the `lib` folder
* `$ npm run dev` - produces development version of rs-ui-utils in a watch mode
* `$ npm run test` - runs the tests under the `test` folder

## Misc
* Inspired from *https://github.com/krasimir/webpack-library-starter*

