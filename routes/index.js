/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {

	// Views
  app.get('/', routes.views.overview);
  app.get('/create', routes.views.create);
  app.get('/kartotek', routes.views.kartotek);
  app.get('/db', routes.views.dbExamples);
  app.get('/info/:slug', routes.views.info);
  app.get('/specialiteter', routes.views.specialiteter);
  app.all('/login', routes.views.login);
  app.get('/list', routes.views.list);
  app.get('/index', routes.views.index);
  
  // ADMIN
  app.all('/new', middleware.requireUser, routes.views.new);
  app.all('/edit/:slug', middleware.requireUser, routes.views.edit);
  app.all('/user/create', middleware.requireUser, routes.views.editUser);
  app.all('/user/edit/:_id', middleware.requireUser, routes.views.editUser);
  app.get('/user/list', middleware.requireUser, routes.views.listUser);
  
  // API
  app.get('/api/print', routes.views.apiPrint);
  app.get('/api/search/:model', routes.views.apiSearch);
  app.get('/api/update/:model/:slug', routes.views.apiUpdate);
  app.get('/api/mongoose/id', routes.views.apiMongoose);
  app.all('/api/upload', routes.views.apiUpload);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
