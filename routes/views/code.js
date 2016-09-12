var keystone = require('keystone');
var moment = require('moment');

exports = module.exports = function(req, res) {

  var Code = keystone.list('Code');

  var view = new keystone.View(req, res);
  var locals = res.locals;

  moment.locale('fi');


  // **********************************************************************************************

  view.on('get', function(next) {

    var query = { _id: req.params.code, course: locals.course._id };

    if (!locals.staff) {
      query.user = locals.user._id;
    }

    Code.model.findOne(query).populate('user').lean().exec(function(err, code) {

      if (err || !code) {
        req.flash('error', 'Pyydettyä koodia ei löytynyt tai sinulla ei ole oikeutta katsoa sitä.');
        res.redirect('/koodisailo/my');
        return;
      }

      locals.codeTitle = code.title;
      locals.content = code.content;
      locals.codeId = code._id.toString();
      locals.created = moment(code.createdAt).fromNow();
      locals.userId = code.user._id.toString();
      locals.userName = code.user.name.first + ' ' + code.user.name.last;
      locals.showRemove = code.user._id.toString() === locals.user._id.toString();

      next();

    });

  });

  // **********************************************************************************************

  view.on('post', { 'action': 'remove' }, function() {

    var query = { _id: req.params.code, course: locals.course._id, user: locals.user._id };

    Code.model.findOne(query).exec(function(err, code) {

      if (err || !code) {
        req.flash('error', 'Pyydettyä koodia ei löytynyt tai sinulla ei ole oikeutta poistaa sitä.');
        res.redirect('/koodisailo/my');
        return;
      }

      code.remove(function(err) {
          if (!err) {
            req.flash('success', 'Koodi on poistettu.');
            res.redirect('/koodisailo/my');
            return;
          } else {
            req.flash('error', 'Koodin poistaminen epäonnistui.');
            res.redirect('/koodisailo/my');
            return;
          }
      });

    });

  });

  // **********************************************************************************************

  view.render('code', locals);

};
