'use strict';

const keystone = require('keystone');
const moment = require('moment');

exports = module.exports = function(req, res) {

  const Code = keystone.list('Code');

  const view = new keystone.View(req, res);
  const locals = res.locals;

  locals.reactData.app.view = 'create';

  // **********************************************************************************************

  view.on('get', function(next) {

    locals.reactData.view.expirationTime = locals.course.expireTime;
    locals.reactData.view.csrf = locals.csrf_token_value;
    locals.reactData.view.staff = locals.staff === true;

    if (req.params.code) {
      const query = { _id: req.params.code, course: locals.course._id, user: locals.user._id };

      Code.model.findOne(query).lean().exec(function(err, code) {

        if (err || !code) {
          req.flash('error', 'alert-code-not-found-edit');
          res.redirect('/koodisailo/my');
          return;
        }

        locals.reactData.view.codeTitle = code.title;
        locals.reactData.view.content = code.content;
        locals.reactData.view.codeId = req.params.code;
        locals.reactData.view.public = code.public === true;

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
        locals.reactData.view.codeCount = count;
      } else {
        locals.reactData.view.codeCount = 0;
      }

      next();

    });

  });

  // **********************************************************************************************

  view.on('post', { 'action': 'save' }, function(next) {

    locals.reactData.view.codeTitle = req.body.title;
    locals.reactData.view.content = req.body.content;
    locals.reactData.view.expirationTime = locals.course.expireTime;
    locals.reactData.view.csrf = locals.csrf_token_value;
    locals.reactData.view.staff = locals.staff === true;

    if (!locals.staff) {
      req.body.public = false;
    }

    if ((req.body.content || '').length > 1024 * 20) {
      req.flash('error', 'alert-code-too-long');
      next();
      return;
    }

    // update or insert?
    if (req.params.code) {
      const query = {
        _id: req.params.code,
        user: locals.user._id,
        course: locals.course._id
      };

      Code.model.findOne(query).exec(function(err, code) {

        if (code) {
          code.title = req.body.title || '?';
          code.content = req.body.content;
          code.expires = moment().add(locals.course.expireTime, 'd').toDate();
          code.createdAt = moment().toDate();
          code.public = req.body.public === 'public';
          code.save(function(err) {
            if (!err) {
              req.flash('success', 'alert-code-saved');
              res.redirect('/koodisailo/view/' + code._id.toString());
              return;
            } else {
              req.flash('error', 'alert-save-failed');
              next();
            }
          });
        } else {
          req.flash('error', 'alert-save-failed');
          next();
        }

      });

    } else {

      if (locals.codeCount >= 50) {
        req.flash('error', 'alert-too-many-codes');
        next();
        return;
      }

      const newCode = new Code.model();
      newCode.set({
        user: locals.user._id,
        course: locals.course._id,
        title: req.body.title || '?',
        content: req.body.content || '',
        public: req.body.public === 'public',
        expires: moment().add(locals.course.expireTime, 'd').toDate(),
      });

      newCode.save(function(err) {
        if (!err) {
          req.flash('success', 'alert-new-code-saved');
          res.redirect('/koodisailo/view/' + newCode._id.toString());
          return;
        } else {
          req.flash('error', 'alert-save-failed');
          next();
        }
      });

    }

  });

  // **********************************************************************************************

  view.render('reactView', locals);

};
