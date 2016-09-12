(function($) {

  // Activate the current tab
  var path = location.pathname.replace(/\/$/, "");
  $('ul.nav li a[href$="' + path + '"]').parent('li').addClass('active');

})(jQuery);
