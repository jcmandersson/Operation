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
    'Förberedelse',
    'Artikel',
    'Kommentar'
  ],
  'Kartotek': [
    'Kartotekartikel'
  ]
});

// Start Keystone to connect to your database and initialise the web server

keystone.start({
  onHttpServerCreated: function() {
    /*var checklist = keystone.list('CheckArticle');
    
    //Starta socket.io
    keystone.io = require('socket.io').listen(keystone.httpServer);

    var sendCheckboxes = function(){ //Send checkboxes to clients
      checklist.model.find()
        .exec(function(err, checkboxes) {
          if(err) {
            console.log('DB error');
            console.log(err);
          }
          else {
            keystone.io.emit('getCheckboxes', checkboxes);
          }
        });
    };

    keystone.io.on('connection', function(socket){
      sendCheckboxes();
      socket.on('checkboxClick', function(id){ //Update checked status in database and send to clients.
        checklist.model.findOne({ _id: id }, function (err, checkbox){
          if(err){
            console.log('ID: '+id +  ' kunde inte hittas');
            console.log(err);
            return;
          }
          checkbox.checked = !checkbox.checked;
          checkbox.save();
          keystone.io.emit('checkboxClick', {id:id, isChecked: checkbox.checked});
        });
      });
    });*/


    var checklist = keystone.list('Artikel');

//Start socket.io
    keystone.io = require('socket.io').listen(keystone.httpServer);

    var sendCheckboxes = function(){ //Send checkboxes to clients
      checklist.model.find()
        .exec(function(err, checkboxes) {
          if(err) {
            console.log('DB error when trying to send checklist from server to client.');
            console.log(err);
          }
          else {
            keystone.io.emit('getCheckboxes', checkboxes);
          }
        });
    };

    keystone.io.on('connection', function(socket){
      socket.on('checkboxClick', function(checkObject){ //Update checked status in database and send to clients.
        checklist.model.findOne({ _id: checkObject.id }, function (err, checkbox){
          if(err){
            console.log('ID: '+id +  ' kunde inte hittas');
            console.log(err);
            return;
          }
          checkbox.checked = !checkbox.checked;
          checkbox.save();
          keystone.io.to(checkObject.operationId).emit('checkboxClick', {id:checkObject.id, isChecked: checkbox.checked});
        });
      });

      socket.on('operationOpen', function(operationId){
        checklist.model.find({operation: operationId})
          .exec(function(err, checkboxes) {
            if(err) {
              console.log('DB error');
              console.log(err);
            }
            else {
              socket.join(operationId);
              keystone.io.to(operationId).emit('getCheckboxes', checkboxes);
            }
          });
      })
    });
  }
});

// Init Rest API
rest.registerRoutes(keystone.app);
