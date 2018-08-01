'use strict';

const keystone = require('keystone');

exports = module.exports = function(req, res) {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // **********************************************************************************************

  view.on('init', function(next) {
    locals.reactData.app.view = 'settings';
    locals.reactData.view = {
        csrf: locals.csrf_token_value,
        course: {
          name: locals.course.name,
          combined: locals.course.combined,
          language: locals.course.language,
          expireTime: locals.course.expireTime,
          courseId: locals.course.courseId
        }
    };
    next();
  });

  // **********************************************************************************************

  view.on('post', { 'action': 'saveSettings' }, function(next) {


    locals.reactData.view.course.name = req.body.name;
    locals.reactData.view.course.combined = req.body.combined;
    locals.reactData.view.course.language = req.body.language;

    locals.course.name = req.body.name;
    locals.course.combined = req.body.combined;
    locals.course.language = req.body.language;
    locals.course.expireTime = +req.body.expireTime;

    if (!/^\d+/.test(locals.reactData.view.course.expireTime) || locals.reactData.view.course.expireTime < 1) {
      req.flash('warning', 'alert-too-short-expiration');
      locals.course.expireTime = 1;
    }

    if (locals.reactData.view.course.expireTime > 365) {
      req.flash('warning', 'alert-too-long-expiration');
      locals.course.expireTime = 365;
    }

    locals.reactData.view.course.expireTime = locals.course.expireTime;

    locals.course.save(function(err) {
      if (!err) {
        req.flash('success', 'alert-settings-saved');
      } else {
        req.flash('error', 'alert-settings-save-failed');
      }

      next();

    });


  });


  // **********************************************************************************************

  view.render('reactView', locals);

};
