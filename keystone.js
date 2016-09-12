require('dotenv').load();
var keystone = require('keystone'),
  swig = require('swig');

// Disable swig's bulit-in template caching, express handles it
swig.setDefaults({
  cache: false
});

keystone.init({

  'name': 'Koodisäilö',
  'brand': 'Koodisäilö',

  'less': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'swig',

  'custom engine': swig.renderFile,

  'auto update': true,
  'session': true,
  'session store': 'connect-mongo',
  'auth': true,
  'user model': 'User',
  'trust proxy': true,
  'cookie secret': 'lf3HqglBkku8IYPhnbbCpYgTs5qKyOnjVPF44O3Y0jj1sRJtSIUe0vihYgTLSh5c',
  'port': 3001,

  'session options': {
    'key': 'koodisailo.sid'
  },

  // Change these!
  'lti key': 'koodisailo',
  'lti secret': 'koodisailo2016'

});

keystone.import('models');

keystone.set('locals', {
  _: require('underscore'),
  env: keystone.get('env'),
  utils: keystone.utils
});

keystone.set('routes', require('./routes/routes.js'));

keystone.start(function() {

  var moment = require('moment');
  var Code = keystone.list('Code');

  setInterval(function() {

    // Clean old codes
    Code.model.remove({ expires: { $lt: moment().toDate() } }).exec(function() {});
  }, 1000 * 60 * 5);

});
