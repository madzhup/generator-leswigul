# Web app generator [![Build Status](https://secure.travis-ci.org/madzhup/generator-leswigul.svg?branch=master)](https://travis-ci.org/madzhup/generator-leswigul)

> [Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app using [gulp](http://gulpjs.com/) for the build process


## Features

Please see our [gulpfile.js](app/templates/gulpfile.js) for up to date information on what we support.

* Swig templates
* CSS Autoprefixing
* Media Queries Packing
* Built-in preview server with BrowserSync
* Automagically compile [Less](http://lesscss.org)
* Automagically lint your scripts
* Map compiled CSS to source stylesheets with source maps
* Awesome image optimization
* Automagically wire-up dependencies installed with [Bower](http://bower.io)

*For more information on what this generator can do for you, take a look at the [gulp plugins](app/templates/_package.json) used in our `package.json`.*


## Getting Started

- Install dependencies: `npm install --global yo bower`
- Install the generator: `npm install --global generator-leswigul`
- Run `yo leswigul` to scaffold your webapp
- Run `gulp serve` to preview and watch for changes
- Run `bower install --save <package>` to install frontend dependencies
- Run `gulp` to build your webapp for production


## Docs

* [getting started](docs/README.md) with this generator
* [details](docs/bower.md) about our Bower setup


## Options

- `--skip-welcome-message`
  Skips Yeoman's greeting before displaying options.
- `--skip-install-message`
  Skips the the message displayed after scaffolding has finished and before the dependencies are being installed.
- `--skip-install`
  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.
- `--test-framework=<framework>`
  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.


## Contribute

See the [contributing docs](contributing.md).


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
