var keystone = require('keystone');
var operation = keystone.list('Operation')
var specialty = keystone.list('Specialitet');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = typeof req.query.state === 'undefined' ? 'list' : req.query.state;

  locals.scripts = [
    'list.js'
  ];

  locals.css = [
    'site/list.css'
  ];

  var searchObject = {
    slug: {$ne: 'mall'},
    template: true
  };
  if (!locals.user) searchObject['state'] = 'Publicerad';
  
  var currentPage = typeof req.query.page !== 'undefined' ? req.query.page - 1 : 0;
  var limit = typeof req.query.limit !== 'undefined' ? req.query.limit : 25;
  locals.addToIndex = parseInt(currentPage*limit + 1);
  locals.limit = limit;
  locals.currentQuery = '';
  for(key in req.query){
    if(key[0] == '_' || key == 'limit' || key == 'page' || key == 'sort') continue;
    locals.currentQuery += key+'='+req.query[key]+'&';
  }
  
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : 'title';
  locals.sort = sort;  

  var state = typeof req.query.state !== 'undefined' ? req.query.state : 'Alla tillstånd';
  locals.state = state;

  var spec = typeof req.query.specialty !== 'undefined' ? req.query.specialty : 'Alla specialiteter';
  locals.spec = spec;

  view.on('init', function (next) {
    if (typeof req.query.state !== 'undefined') {
      searchObject.state = req.query.state;
    }
    next();
  });

  view.on('init', function (next) {
    if (typeof req.query.specialty !== 'undefined') {
      specialty.model.find({
        name: req.query.specialty
      }, function (err, docs) {
        if (err || !docs.length) {
          next();
          return;
        }
        searchObject.specialty = docs[0]._id;
        next();
      });
    } else {
      next();
    }
  });
  
  view.on('init', function(next){
    operation.model.count(searchObject, function(err, c){
      locals.pagination = {
        page: currentPage + 1,
        pageCount: limit != 0 ? c/limit : 0
      };
      next();
    });
  });

  view.on('init', function (next) {
    operation.model.find(searchObject)
      .sort(sort)
      .skip(currentPage*limit)
      .limit(limit)
      .populate('createdBy updatedBy specialty')
      .exec(function (err, docs) {
        locals.operations = docs;
        next();
      });
  });

  view.render('list');
};
