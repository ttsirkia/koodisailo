var keystone = require('keystone');
var moment = require('moment');

exports = module.exports = function(req, res) {

  var Code = keystone.list('Code');

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // **********************************************************************************************

  view.on('get', function(next) {

    if (req.params.code) {
      var query = { _id: req.params.code, course: locals.course._id, user: locals.user._id };

      Code.model.findOne(query).lean().exec(function(err, code) {

        if (err || !code) {
          req.flash('error', 'Pyydettyä koodia ei löytynyt tai sinulla ei ole oikeutta muokata sitä.');
          res.redirect('/koodisailo/my');
          return;
        }

        locals.codeTitle = code.title;
        locals.content = code.content;
        locals.codeId = req.params.code;
        next();

      });
    } else {
      next();
    }

  });

  // **********************************************************************************************

  view.on('init', function(next) {

    Code.model.find({user: locals.user._id, course: locals.course._id}).count().exec(function(err, count) {

      if (!err) {
        locals.codeCount = count;
      } else {
        locals.codeCount = 0;
      }

      next();

    });

  });

  // **********************************************************************************************

  view.on('post', { 'action': 'save' }, function(next) {

    locals.codeTitle = req.body.title;
    locals.content = req.body.content;
    if ((req.body.content || '').length > 1024 * 20) {
      req.flash('error', 'Lähettämäsi koodi on liian pitkä, tallennus epäonnistui.');
      next();
      return;
    }

    if (locals.codeCount >= 50) {
      req.flash('error', 'Tallennettujen koodien enimmäismäärä on täynnä. Jotta voit tallentaa uusia koodeja, sinun täytyy poistaa nykyisiä koodeja palvelusta..');
      next();
      return;
    }

    // update or insert?
    if (req.params.code) {
      var query = {
        _id: req.params.code,
        user: locals.user._id,
        course: locals.course._id
      };

      Code.model.findOne(query).exec(function(err, code) {

        if (code) {
          code.title = req.body.title || '(nimetön)';
          code.content = req.body.content;
          code.expires = moment().add(locals.course.expireTime, 'd').toDate();
          code.createdAt = moment().toDate();
          code.save(function(err) {
            if (!err) {
              req.flash('success', 'Koodi on tallennettu.');
              res.redirect('/koodisailo/view/' + code._id.toString());
              return;
            } else {
              req.flash('error', 'Tallentaminen epäonnistui.');
              next();
            }
          });
        } else {
          req.flash('error', 'Tallentaminen epäonnistui.');
          next();
        }

      });

    } else {
      var newCode = new Code.model();
      newCode.set({
        user: locals.user._id,
        course: locals.course._id,
        title: req.body.title || '(nimetön)',
        content: req.body.content || '',
        expires: moment().add(locals.course.expireTime, 'd').toDate()
      });

      newCode.save(function(err) {
        if (!err) {
          req.flash('success', 'Koodi on tallennettu. Mikäli haluat jakaa tämän koodin kurssihenkilökunnalle, voit antaa linkin tälle sivulle. Muut opiskelijat eivät voi nähdä koodia.');
          res.redirect('/koodisailo/view/' + newCode._id.toString());
          return;
        } else {
          req.flash('error', 'Tallentaminen epäonnistui.');
          next();
        }
      });

    }

  });

  // **********************************************************************************************

  view.render('create', locals);

};
