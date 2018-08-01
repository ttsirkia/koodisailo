'use strict';

const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.initReactData);
keystone.pre('routes', keystone.security.csrf.middleware.init);
keystone.pre('routes', middleware.CSRFValidate);
keystone.pre('render', middleware.flashMessages);
keystone.pre('render', middleware.transformReactData);


// Import Route Controllers
const routes = {views: importRoutes('./views')};

keystone.set('404', middleware.handle404);
keystone.set('500', middleware.handle500);

// Setup Route Bindings
exports = module.exports = function(app) {

  // Views

  // For all
  app.all('/', routes.views.index);
  app.post('/login/lti', routes.views.loginLTI);
  app.all('/view/:code', routes.views.code);  // because of public snippets !!!

  // For all after course is selected
  app.all('/my', middleware.requireCourse, routes.views.my);
  app.all('/create', middleware.requireCourse, routes.views.create);
  app.all('/edit/:code', middleware.requireCourse, routes.views.create);

  // For teacher
  app.all('/settings', middleware.requireTeacher, routes.views.settings);

};
