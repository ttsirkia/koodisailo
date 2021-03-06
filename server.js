'use strict';

require('dotenv').config();

const keystone = require('keystone');
const cons = require('consolidate');

keystone.init({

  'name': 'Koodisäilö',
  'brand': 'Koodisäilö',

  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates',
  'view engine': '.njk',
  'custom engine': cons.nunjucks,
  'auto update': true,
  'session': true,
  'session store': 'connect-mongo',
  'auth': true,
  'user model': 'User',
  'trust proxy': true,
  'port': process.env.PORT || 3001,
  'unix socket': process.env.UNIX_SOCKET || '',
  'session options': {
    'key': 'koodisailo.sid'
  },
  'languages available': ['fi', 'en'],
  'default language': process.env.DEFAULT_LANGUAGE || 'fi',

  // Length of the session (hours)
  'cookie expiration': (+process.env.COOKIE_EXPIRATION || (24 * 7 * 4)) * 1000 * 3600,

  // Define these environment variables or change default values!
  'lti key': process.env.LTI_KEY || 'koodisailo',
  'lti secret': process.env.LTI_SECRET || 'koodisailo',
  'cookie secret': process.env.COOKIE_SECRET || 'secret',

});

keystone.import('models');

keystone.set('locals', {
  _: require('lodash'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable
});

keystone.set('routes', require('./routes/routes.js'));

keystone.start(function() {

  const Code = keystone.list('Code');

  setInterval(function() {

    // Clean old code snippets
    Code.model.remove({ expires: { $lt: new Date() } }).exec(function() {});
  }, 1000 * 60 * 5);

});
