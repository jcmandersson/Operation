// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();


// Require keystone
var keystone = require('keystone'),
  	handlebars = require('express-handlebars'),
    rest = require('keystone-rest');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'Operation',
	'brand': 'Operation',
	
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',
	
	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs'
	}).engine,
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'b1MD7rtB%T24J:3=4Hly4JZU^t8;.OTTM6oP"]mIxXr3e1Gt)])Ks!h-`Oq&|*EF'

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'Användare': 'users',
  'Operationer': [
    'Specialitet',
    'Operation',
    'Processteg',
    'Artikel',
    'Kommentar',
    'Processinnehall'
  ],
  'Kartotek': [
    'Kartotekartikel'
  ]
});

// Start Keystone to connect to your database and initialise the web server

keystone.start({
  onHttpServerCreated: function() {
    var checklist = require('./lib/checklist.js'); // Load socket.io for checklists.
    checklist(keystone);
  }
});

// Init Rest API
rest.registerRoutes(keystone.app);


