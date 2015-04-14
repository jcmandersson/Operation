var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'listUser'

  locals.scripts = [
    'listUser.js'
  ];

  locals.css = [
    'site/list.css'
  ];

  var searchObject = {
    
  };
  
  var currentPage = typeof req.query.page !== 'undefined' ? req.query.page - 1 : 0;
  var limit = typeof req.query.limit !== 'undefined' ? req.query.limit : 25;
  locals.addToIndex = parseInt(currentPage*limit + 1);
  locals.limit = limit;
  locals.currentQuery = '';
  for(key in req.query){
    if(key[0] == '_' || key == 'limit' || key == 'page' || key == 'sort') continue;
    locals.currentQuery += key+'='+req.query[key]+'&';
  }
  
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : 'name';
  locals.sort = sort;

  view.on('init', function (next) {
    if (typeof req.query.state !== 'undefined') {
      searchObject.state = req.query.state;
    }
    next();
  });
  
  view.on('init', function(next){
    User.model.count(searchObject, function(err, c){
      locals.pagination = {
        page: currentPage + 1,
        pageCount: limit != 0 ? c/limit : 0
      };
      next();
    });
  });

  view.on('init', function (next) {
    User.model.find(searchObject)
      .sort(sort)
      .skip(currentPage*limit)
      .limit(limit)
      .exec(function (err, docs) {
        locals.users = docs;
        next();
      });
  });

  view.render('listUser');
};
