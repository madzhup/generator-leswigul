'use strict';
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile.js to build your app.'));
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Swig',
        value: 'includeSwig',
        checked: true
      }, {
        name: 'Less',
        value: 'includeLess',
        checked: true
      }, {
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }, {
        name: 'Normalize CSS',
        value: 'includeNormalizeCss',
        checked: true
      }, {
        name: 'FontAwesome',
        value: 'includeFontAwesome',
        checked: true
      }]
    }, {
      type: 'list',
      name: 'frameworks',
      message: 'Choose a framework:',
      default: 'none',
      choices: [{
        name: 'Bootstrap',
        value: 'includeBootstrap'
      }, {
        name: 'Uikit',
        value: 'includeUikit'
      }, {
        name: 'None',
        value: 'none'
      }]
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;
      var frameworks = answers.frameworks;

      var hasFeature = function (feat) {
        return features.indexOf(feat) !== -1;
      };
      var hasFramework = function (feat) {
        return frameworks.indexOf(feat) !== -1;
      };

      this.includeBootstrap = hasFramework('includeBootstrap');
      this.includeUikit = hasFramework('includeUikit');

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeSwig = hasFeature('includeSwig');
      this.includeLess = hasFeature('includeLess');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeNormalizeCss = hasFeature('includeNormalizeCss') && !this.includeBootstrap;
      this.includeFontAwesome = hasFeature('includeFontAwesome') && ! this.includeBootstrap;

      done();
    }.bind(this));
  },

  writing: {
    gulpfile: function () {
      this.template('gulpfile.js');
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    git: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },

    bower: function () {
      var bower = {
        name: this._.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if (this.includeBootstrap) {
        bower.dependencies.bootstrap = '~3.3.4';
      } else if(this.includeUikit){
        bower.dependencies.uikit = '~2.19.0';
        bower.overrides = {
          uikit: {
            main: [
              'less/core/*.less',
              'js/core/core.js',
              'js/core/touch.js',
              'js/core/utility.js',
              'js/core/smooth-scroll.js',
              'js/core/scrollspy.js',
              'js/core/toggle.js',
              'js/core/alert.js',
              'js/core/button.js',
              'js/core/dropdown.js',
              'js/core/grid.js',
              'js/core/modal.js',
              'js/core/nav.js',
              'js/core/offcanvas.js',
              'js/core/switcher.js',
              'js/core/tab.js',
              'js/core/cover.js'
            ]
          }
        }
      } else {
        if(this.includeNormalizeCss){
          bower.dependencies['normalize-css'] = '~3.0.3';
        }
        if(this.includeFontAwesome){
          bower.dependencies['font-awesome'] = '~4.3.0';
        }
        bower.dependencies.jquery = '~2.1.1';
      }

      if (this.includeModernizr) {
        bower.dependencies.modernizr = '~2.8.1';
      }

      this.copy('bowerrc', '.bowerrc');
      this.write('bower.json', JSON.stringify(bower, null, 2));
    },

    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    h5bp: function () {
      this.copy('favicon.ico', 'app/favicon.ico');
      this.copy('apple-touch-icon.png', 'app/apple-touch-icon.png');
      this.copy('robots.txt', 'app/robots.txt');
    },

    mainStylesheet: function () {
      var css = 'main';

      if (this.includeLess) {
        css += '.less';
      } else {
        css += '.css';
      }

      this.copy(css, 'app/styles/' + css);
    },

    writeIndex: function () {
      this.indexFile = this.src.read('index.html');
      this.indexFile = this.engine(this.indexFile, this);

      // wire Bootstrap plugins
      if (this.includeBootstrap) {
        var bs = '/bower_components/bootstrap/js/';

        this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
          bs + 'affix.js',
          bs + 'alert.js',
          bs + 'dropdown.js',
          bs + 'tooltip.js',
          bs + 'modal.js',
          bs + 'transition.js',
          bs + 'button.js',
          bs + 'popover.js',
          bs + 'carousel.js',
          bs + 'scrollspy.js',
          bs + 'collapse.js',
          bs + 'tab.js'
        ]);
      }

      // wire Uikit plugins
      if (this.includeUikit) {
        var jspath = '/bower_components/uikit/js/core/';

        // this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
        //   jspath + 'core.js',
        //   jspath + 'touch.js',
        //   jspath + 'utility.js',
        //   jspath + 'smooth-scroll.js',
        //   jspath + 'scrollspy.js',
        //   jspath + 'toggle.js',
        //   jspath + 'alert.js',
        //   jspath + 'button.js',
        //   jspath + 'dropdown.js',
        //   jspath + 'grid.js',
        //   jspath + 'modal.js',
        //   jspath + 'nav.js',
        //   jspath + 'offcanvas.js',
        //   jspath + 'switcher.js',
        //   jspath + 'tab.js',
        //   jspath + 'cover.js'
        // ]);
      }

      this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        optimizedPath: 'scripts/main.js',
        sourceFileList: ['scripts/main.js']
      });

      this.write(this.includeSwig ? 'app/_layout.html' : 'app/index.html', this.indexFile);
    },

    app: function () {
      this.mkdir('app');
      this.mkdir('app/scripts');
      this.mkdir('app/styles');
      this.mkdir('app/images');
      this.mkdir('app/fonts');
      this.copy('main.js', 'app/scripts/main.js');

      if(this.includeSwig){
        this.mkdir('app/pages');
        this.copy('page.html', 'app/pages/index.html');
      }
    }
  },

  install: function () {
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('gulp wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }

    this.installDependencies({
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });

    this.on('end', function () {
      var bowerJson = this.dest.readJSON('bower.json');

      // wire Bower packages to .html
      wiredep({
        bowerJson: bowerJson,
        directory: 'bower_components',
        exclude: ['uikit.min.cs', 'uikit.min.js', 'bootstrap.js'],
        ignorePath: /^(\.\.\/)*\.\./,
        src: this.includeSwig ? 'app/_layout.html' : 'app/index.html'
      });

      if (this.includeLess) {
        // wire Bower packages to .less
        wiredep({
          bowerJson: bowerJson,
          directory: 'bower_components',
          ignorePath: /^(\.\.\/)+/,
          src: 'app/styles/*.less'
        });
      }

      // ideally we should use composeWith, but we're invoking it here
      // because generator-mocha is changing the working directory
      // https://github.com/yeoman/generator-mocha/issues/28
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install']
        }
      });
    }.bind(this));
  }
});
