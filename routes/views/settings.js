var keystone = require('keystone');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // **********************************************************************************************

  view.on('post', { 'action': 'saveSettings' }, function(next) {


    locals.course.name = req.body.name;
    locals.course.combined = req.body.combined;
    locals.course.language = req.body.language;
    locals.course.expireTime = +req.body.expireTime;

    if (isNaN(locals.course.expireTime) || locals.course.expireTime < 1) {
      req.flash('warning', 'Säilymisaika ei ollut kelvollinen. Asetettiin koodien säilymisajaksi yksi päivä.');    
      locals.course.expireTime = 1;
    }

    if (locals.course.expireTime > 365) {
      req.flash('warning', 'Säilymisaika ei ollut kelvollinen. Asetettiin koodien säilymisajaksi yksi vuosi.');
      locals.course.expireTime = 365;
    }

    locals.course.save(function(err) {
      if (!err) {
        req.flash('success', 'Kurssin asetukset on tallennettu.');
      } else {
        req.flash('error', 'Kurssin asetusten tallentaminen ei onnistunut.');
      }

      next();

    });


  });


  // **********************************************************************************************

  view.render('settings', locals);

};
