'use strict';

const keystone = require('keystone');
const moment = require('moment');

exports = module.exports = function(req, res) {

  const Code = keystone.list('Code');

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // **********************************************************************************************

  view.on('init', function(next) {

    locals.reactData.app.view = 'my';

    Code.model.find({ user: locals.user._id, course: locals.course._id }).sort('-createdAt').lean().exec(function(err, results) {
      locals.reactData.view.codes = [];
      locals.reactData.view.expirationTime = locals.course.expireTime;

      if (results) {
        results.forEach(function(code) {
          locals.reactData.view.codes.push({
            id: code._id.toString(),
            title: code.title,
            public: code.public === true,
            time: moment(code.createdAt).valueOf(),
            expiresSoon: moment().add(locals.course.expireTime * 24 * 0.25, 'h').isAfter(moment(code.expires))
          });
        });
      }

      next();

    });

  });

  // **********************************************************************************************

  view.render('reactView', locals);

};
