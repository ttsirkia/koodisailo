'use strict';

const keystone = require('keystone');
const moment = require('moment');

exports = module.exports = function(req, res) {

  // The existence of locals.user or locals.course is not guaranteed here as
  // anyone is allowed to see public code snippets!

  const Code = keystone.list('Code');

  const view = new keystone.View(req, res);
  const locals = res.locals;

  locals.reactData.app.view = 'code';

  locals.additionalResources = `<link rel="stylesheet" href="/koodisailo/scripts/highlight/styles/monokai-sublime.css">
<script src="/koodisailo/scripts/jquery-3.3.1.min.js"></script>
<script src="/koodisailo/scripts/highlight/highlight.pack.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js"></script>`;

  // **********************************************************************************************

  view.on('get', function(next) {

    const query = { _id: req.params.code };

    Code.model.findOne(query).populate('user').lean().exec(function(err, code) {

      const userOK = locals.user && code && code.user._id.toString() === locals.user._id.toString();
      const staffOK = locals.course && locals.staff && code && code.course.toString() === locals.course._id.toString();
      const publicOK = code && code.public === true;
      const staffPermissionsOK = code && req.session.staffPermissions && req.session.staffPermissions[code.course.toString()];
      const viewOK = userOK || staffOK || publicOK || staffPermissionsOK;

      if (err || !code || !viewOK) {
        req.flash('error', 'alert-code-not-found');
        res.redirect('/koodisailo');
        return;
      }

      locals.reactData.view.csrf = locals.csrf_token_value;
      locals.reactData.view.language = (locals.course || { language: '' }).language;
      locals.reactData.view.codeTitle = code.title;
      locals.reactData.view.content = code.content.replace(/\r/g, '');  // Highlight.js need this
      locals.reactData.view.codeId = code._id.toString();
      locals.reactData.view.created = moment(code.createdAt).valueOf();
      locals.reactData.view.userName = code.user.name.first + ' ' + code.user.name.last;
      locals.reactData.view.myCode = locals.user && code.user._id.toString() === locals.user._id.toString();

      if (!locals.course || code.course.toString() !== locals.course._id.toString()) {
        locals.reactData.course = {};
      }

      next();

    });

  });

  // **********************************************************************************************

  view.on('post', { 'action': 'remove' }, function() {

    if (!locals.course || !locals.user) {
      req.flash('error', 'alert-code-not-found-delete');
      res.redirect('/koodisailo');
      return;
    }

    const query = { _id: req.params.code, course: locals.course._id, user: locals.user._id };

    Code.model.findOne(query).exec(function(err, code) {

      if (err || !code) {
        req.flash('error', 'alert-code-not-found-delete');
        res.redirect('/koodisailo/my');
        return;
      }

      code.remove(function(err) {
        if (!err) {
          req.flash('success', 'alert-code-removed');
          res.redirect('/koodisailo/my');
          return;
        } else {
          req.flash('error', 'alert-remove-failed');
          res.redirect('/koodisailo/my');
          return;
        }
      });

    });

  });

  // **********************************************************************************************

  view.render('reactView', locals);

};
