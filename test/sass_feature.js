/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Gulp webapp generator: less feature', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'less'), function (err) {
      if (err) {
        done(err);
        return;
      }

      this.webapp = helpers.createGenerator('leswigul:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      this.webapp.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  var assertFileExists = function (app, fileExt, features, done) {
    var expected = [
      'app/styles/main.' + fileExt
    ];

    helpers.mockPrompt(app, {
      features: features
    });

    app.run(function () {
      helpers.assertFile(expected);
      done();
    });
  };

  it('should create less file', function (done) {
    assertFileExists(this.webapp, 'less', ['includeLess'], done);
  });

  it('should create css file', function (done) {
    assertFileExists(this.webapp, 'css', [], done);
  });
});
