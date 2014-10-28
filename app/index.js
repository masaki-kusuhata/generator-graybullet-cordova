'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var cordova = new (require('./cordovaAdapter.js'))('cordova');
var OptionBuilder = require('./optionBuilder.js');
var promptConfig = require('./promptConfig.js');

var GraybulletCordovaGenerator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // Delegate options from generator-webapp.
    this.optionBuilder = new OptionBuilder(this, this.env.create('webapp'));
    this.optionBuilder.copyDelegatedDefines();
  },

  initializing: function () {
    this.pkg = require('../package.json');

    this.projectOptions = {};
  },

  prompting: {
    /**
     * Prompting project information.
     */
    promptingProject: function () {
      var done = this.async();

      this.log(yosay('Welcome to the Apache Cordova generator!'));

      var prompts = [
        {
          name: 'name',
          message: 'What is the name of Apache Cordova App?',
          'default': 'HelloCordova'
        }, {
          name: 'id',
          message: 'What is the ID of Apache Cordova App?',
          'default': 'io.cordova.hellocordova'
        }
      ];

      this.prompt(prompts, function (props) {
        this.projectOptions.name = props.appName;
        this.projectOptions.id = props.id;

        done();
      }.bind(this));
    },

    /**
     * Create Apache Cordova project to 'cordova' directory.
     */
    createCordovaProject: function () {
      var done = this.async();

      cordova.create(this.projectOptions.id, this.projectOptions.name, done);
    },

    /**
     * Prompting adding platforms.
     */
    promptingAddPlatforms: function () {
      var done = this.async();

      var prompt = function (platforms) {
        var prompts = [
          promptConfig.getPlatforms(platforms, {
            name: 'platforms',
            message: 'What app of the platform to be created?'
          })
        ];

        this.prompt(prompts, function (props) {
          this.projectOptions.platforms = props.platforms;

          done();
        }.bind(this));
      }.bind(this);

      cordova.getAvailablePlatforms(prompt);
    },

    /**
     * Add Cordova Platforms to Apache Cordova Project.
     */
    addPlatforms: function () {
      if (this.projectOptions.platforms.length > 0) {
        var done = this.async();

        cordova.addPlatform(this.projectOptions.platforms, done);
      }
    },

    createWebappProject: function () {
      // Delegate options to generator-webapp.
      var options = this.optionBuilder.getDelegatedValues();

      this.composeWith('webapp', {options: options});
    }
  }
});

module.exports = GraybulletCordovaGenerator;
