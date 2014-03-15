'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var VVVGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  welcome: function () {
    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re generating site setups for VVV!'));
  },

  getSiteInfo: function () {
    var done = this.async();

    var prompts = [
      {
        name:    'siteName',
        message: 'What will your site be called?',
        default: 'Wondering Geniuses'
      },
      {
        name:    'siteUrl',
        message: 'What would you like your domain to be?',
        default: 'genius.dev'
      },
      {
        name:    'liveUrl',
        message: 'What is the live domian? (genius.com - blank if none)'
      },
      {
        type:    'confirm',
        name:    'multisite',
        message: 'Will this be a network install?',
        default: false
      }
    ];
    // gather initial settings
    this.prompt(prompts, function (props) {
      this.site = {
        name:      props.siteName,
        url:       props.siteUrl,
        liveUrl:   props.liveUrl,
        multisite: props.multisite
      };
      done();
    }.bind(this));
  },

  checkMultisite: function () {
    // if multisite, what kind?
    if (this.site.multisite) {
      var done = this.async();
      var prompts = [{
        type:    'confirm',
        name:    'sudomain',
        message: 'Is this a sudomain install?',
        default: false
      }];
      this.prompt(prompts, function (props) {
        this.site.sudomain = props.sudomain;
        done();
      }.bind(this));
    }
  },

  getDBInfo: function () {
    var done = this.async();

    var prompts = [
      {
        name:    'dbName',
        message: 'What should I call the database?',
        default: 'genius_db'
      },
      {
        name:    'dbUser',
        message: 'Who is the user for this database?',
        default: 'genius_db_user'
      },
      {
        name:    'dbPass',
        message: 'What will the database user\'s password be?',
        default: 'genius_db_pass'
      }
    ];

    this.prompt(prompts, function (props) {
      this.db = {
        name: props.dbName,
        user: props.dbUser,
        pass: props.dbPass
      };

      done();
    }.bind(this));
  },

  config: function () {
    this.mkdir('config');

    this.copy('org-plugins',  'config/org-plugins');
    this.copy('wp-constants', 'config/wp-constants');
    this.template('_wp-ms-constants', 'config/wp-ms-constants');
    this.template('_vvv-nginx.conf', 'vvv-nginx.conf');
    this.template('_site-vars.sh', 'config/site-vars.sh');
    this.template('_vvv-hosts', 'config/vvv-hosts');
  },

  src: function () {
    this.mkdir('src');
    this.mkdir('src/data');
    this.mkdir('src/dropins');
    this.mkdir('src/plugins');
    this.mkdir('src/themes');

    this.template('readmes/_readme.md', 'readme.md');
    this.copy('readmes/data-readme.md', 'src/data/readme.md');
    this.copy('readmes/dropins-readme.md', 'src/dropins/readme.md');
    this.copy('readmes/plugins-readme.md', 'src/plugins/readme.md');
    this.copy('readmes/themes-readme.md', 'src/themes/readme.md');
  },

  setup: function () {
    this.copy('_package.json', 'package.json');
    this.copy('vvv-init.sh', 'vvv-init.sh');
  }
});

module.exports = VVVGenerator;