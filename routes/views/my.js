var keystone = require('keystone');
var moment = require('moment');

exports = module.exports = function(req, res) {

  var Code = keystone.list('Code');

  var view = new keystone.View(req, res);
  var locals = res.locals;

  moment.locale('fi');


  // **********************************************************************************************

  view.on('init', function(next) {

    Code.model.find({ user: locals.user._id, course: locals.course._id }).sort('-createdAt').lean().exec(function(err, results) {
      locals.codes = [];

      if (results) {
        results.forEach(function(code) {
          locals.codes.push({
            id: code._id.toString(),
            title: code.title,
            time: moment(code.createdAt).fromNow(),
            expiresSoon: moment().add(locals.course.expireTime * 24 * 0.25, 'h').isAfter(moment(code.expires))
          });
        });
      }

      next();

    });

  });

  // **********************************************************************************************

  view.render('my', locals);

};
