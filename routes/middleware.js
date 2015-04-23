/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');


/**
 Initialises the standard view locals

 The included layout depends on the navLinks array to generate
 the navigation in the header, you may wish to change this array
 or replace it with your own templates / logic.
 */

exports.initLocals = function (req, res, next) {

  var locals = res.locals;

  locals.navLinks = [
    {label: 'Översikt', key: 'oversikt', href: '/'},
    {label: 'Handböcker', key: 'list', href: '/list'},
    {label: 'Kartotek', key: 'kartotek', href: '/kartotek'}
  ];

  if (typeof req.user === 'undefined') {
    locals.navLinks.push({
      label: 'Logga in',
      key: 'login',
      href: '/login'
    });
    return next();
  } else if (req.user.isAdmin) {
    locals.navAdmin = [
      {label: 'Skapa Handbok', key: 'new', href: '/new'},
      {label: 'Granska', key: 'Granskning', href: '/list?state=Granskning'},
      {label: 'Utkast', key: 'Utkast', href: '/list?state=Utkast'},
      {label: 'Användare', key: 'listUser', href: '/user/list'},
      {label: 'Skapa användare', key: 'editUser', href: '/user/create'},
      {label: 'Redigera mall', key: 'edit', href: '/edit/mall'},
      {label: 'Logga ut', key: 'login', href: '/login?logout'}
    ];
  } else {
    locals.navAdmin = [
      {label: 'Skapa Handbok', key: 'new', href: '/new'},
      {label: 'Granska', key: 'Granskning', href: '/list?state=Granskning'},
      {label: 'Användare', key: 'listUser', href: '/user/list'},
      {label: 'Logga ut', key: 'login', href: '/login?logout'}
    ];
  }

  locals.user = req.user;

  next();
}
;


/**
 Fetches and clears the flashMessages before a view is rendered
 */

exports.flashMessages = function (req, res, next) {
  var flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error')
  };
  res.locals.messages = flashMessages.info.length + flashMessages.success.length + flashMessages.warning.length + flashMessages.error.length > 0 ? flashMessages : false;

  next();
};


/**
 Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function (req, res, next) {

  if (!req.user) {
    req.flash('error', 'Du måste logga in för att nå denna sida.'); 
    res.redirect('/login?redirect=' + encodeURIComponent(req.url));
  } else {
    next();
  }

};
