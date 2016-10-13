var keystone = require('keystone');
var lti = require('ims-lti');
var utils = keystone.utils;

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  var User = keystone.list('User');
  var Course = keystone.list('Course');

  // **********************************************************************************************
  // Helper functions

  var loginOK = function() {
    res.redirect('/koodisailo/my');
  };

  var loginFailed = function() {
    req.flash('error', 'LTI-kirjautuminen epäonnistui.');
    res.redirect('/koodisailo');
  };

  // Check the course and if it doesn't exist, create a new course
  var checkCourse = function(next) {

    var courseId = req.body.context_id;
    var courseName = req.body.context_title;

    if (req.session.teacher) {

      Course.model.findOrCreate({ 'courseId': courseId }, { 'name': courseName, 'createdBy': req.user._id, 'expireTime': 7 },
        function(err, course, created) {

          if (!err && course) {

            if (created) {
              req.flash('success', 'Luotiin uusi kurssi. Tarkista kurssin asetukset.');
            }

            req.session.courseId = course._id;
            req.course = course;
            next();

          } else {

            loginFailed();

          }

        });

    } else {

      Course.model.findOne({ 'courseId': courseId }, function(err, course) {

        if (!err && course) {

          // Is this a combined code vault and we should redirect user to another course?
          if (!course.combined) {

            req.session.courseId = course._id;
            req.course = course;
            next();

          } else {

            Course.model.findOne({ 'courseId': course.combined }, function(err, course) {
              if (err || !course) {
                req.flash('error', 'Koodisäilö ei ole käytössä tällä kurssilla.');
                res.redirect('/koodisailo');
              } else {
                req.session.courseId = course._id;
                req.course = course;
                next();
              }
            });

          }

        } else if (!err && !course) {

          req.flash('error', 'Koodisäilö ei ole käytössä tällä kurssilla.');
          res.redirect('/koodisailo');

        } else {

          loginFailed();

        }

      });

    }
  };

  // Checks the user and if it doesn't exist, create a new user
  var checkUser = function(next) {

    var email = req.body.lis_person_contact_email_primary;
    var name = req.body.lis_person_name_full;
    var userId = req.body.user_id;
    var otherSystem = req.body.tool_consumer_instance_guid || '';
    var combined = otherSystem + '|' + userId;
    var newUser = { 'name.full': name, 'email': email, 'password': utils.randomString(10), 'ltiId': combined };

    User.model.findOrCreate({ 'ltiId': combined }, newUser, function(err, user) {

      if (!err && user) {
        req.session.userId = user._id;
        req.user = user;
        req.session.cookie.maxAge = 1000 * 3600 * 24 * 14;

        if (user.name.full !== name || user.email !== email) {
          user.name.full = name;
          user.email = email;
          user.save();
        }

        next();

      } else {

        loginFailed();

      }

    });
  };

  // **********************************************************************************************
  // Check the LTI request

  // This is needed because of the URL rewrite in Nginx
  req.originalUrl = '/koodisailo/login/lti';

  provider = new lti.Provider(keystone.get('lti key'), keystone.get('lti secret'));
  provider.valid_request(req, function(err, isValid) {

    if (isValid) {

      checkUser(function() {
        req.session.teacher = /Instructor/.test(req.body.roles) || req.user.isAdmin;
        req.session.assistant = /TeachingAssistant|TA/.test(req.body.roles) || req.user.isAdmin;
        req.session.staff = req.session.teacher || req.session.assistant;
        checkCourse(loginOK);
      });

    } else {

      loginFailed();

    }

  });

};
