var keystone = require('keystone');
var operation = keystone.list('Operation');
var process = keystone.list('Processteg');
var content = keystone.list('Processinnehall');
var article = keystone.list('Artikel');
var prepare = keystone.list('Förberedelse');
var mongoose = require('mongoose');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'create';

  locals.scripts = [
    'jquery.tagsinput.js',
    'lib/jQuery-TE_v.1.4.0/jquery-te-1.4.0.min.js',
    'updown-counter.js',
    'edit.js'
  ];

  locals.css = [
    'site/edit.css'
  ];

  view.on('post', function (next) {

    
    console.log( req.body);
    
      operation.model.findOneAndUpdate({_id: typeof req.body._id !== 'undefined' ? req.body._id : mongoose.Types.ObjectId()}, {
        title: req.body.name,
        tags: req.body.tags,
        specialty: req.body.specialty
      }, {upsert: true}, function (err, data) {
        if (err) {
          console.log('Operationen kunde inte skapas.!');
          return;
        }
        for (var i = 0; typeof req.body['process' + i] !== 'undefined'; ++i) {
          console.log(typeof req.body['processId'+i] !== 'undefined');
          console.log(req.body['processId'+i]);
          console.log(mongoose.Types.ObjectId());
          console.log(typeof req.body['processId'+i] !== 'undefined' ? req.body['processId'+i] : mongoose.Types.ObjectId());
          var newProcess = process.model.findOneAndUpdate({_id: typeof req.body['processId'+i] !== 'undefined' ? req.body['processId'+i] : mongoose.Types.ObjectId()}, {
            title: req.body['process' + i],
            operation: data._id,
            slug: mongoose.Types.ObjectId()
          }, {upsert: true});
          
          var call = function (index) {

            var savedProcess = function (err, data) {
              if (err) {
                console.log('Processen '+index+' kunde inte skapas!');
                console.log(req.body['processId'+index]);
                console.log(req.body['processId'+index]);
                console.log(err);
                return;
              }

              for (var j = 0; typeof req.body['content' + index + 'title' + j] !== 'undefined'; ++j) {
                if(!req.body['content' + index + 'title' + j].length) continue;
                var id = typeof req.body['content'+ index +'Id' + j] !== 'undefined' ? req.body['content'+ index +'Id' + j] : mongoose.Types.ObjectId();
                var newContent = content.model.findOneAndUpdate({_id: id}, {
                  order: j,
                  title: req.body['content' + index + 'title' + j],
                  text: req.body['content' + index + 'text' + j],
                  process: data._id,
                  slug: mongoose.Types.ObjectId()
                }, {upsert: true}).exec(function (err, data) {
                    if (err) {
                      console.log('Content kunde inte skapas.!');
                      console.log(err);
                      return;
                    }
                  });
              }
            };
            
            newProcess.exec(savedProcess);
          };
          call(i);
        }
      });
  });

  view.on('init', function (next) {
    operation.model.find({
      slug: req.params.slug
    }).populate('specialty')
      .exec(function (err, data) {
        if (err) {
          console.log('DB error');
          console.log(err);
          return;
        } else if (data.length) {
          locals.data = data[0];
        }
        next(err);
      });
  });

  view.on('init', function (next) {
    if (typeof locals.data === 'undefined') {
      next();
      return;
    }
    article.model.find({
      operation: locals.data._id
    }).populate('kartotek')
      .exec(function (err, articleData) {
        if (err) {
          console.log('DB error');
          console.log(err);
          return;
        }
        locals.articles = articleData;
        next(err);
      });
  });

  view.on('init', function (next) {
    if (typeof locals.data === 'undefined') {
      next();
      return;
    }
    process.model.find({
      operation: locals.data._id
    })
      .exec(function (err, processData) {
        if (err) {
          console.log('DB error');
          console.log(err);
          return;
        }
        //console.log(processData);
        locals.processes = processData;
        //console.log(locals.processes);
        next(err);
      });
  });

  view.on('init', function (next) {
    if (typeof locals.data === 'undefined') {
      next();
      return;
    }
    locals.processes.forEach(function (e, i) {
      view.on('init', function (next) {
        content.model.find({
          process: e._id
        })
          .exec(function (err, contentData) {
            if (err) {
              console.log('DB error');
              console.log(err);
              return;
            }
            //console.log(contentData);
            e.contents = contentData;
            next(err);
          });
      });
    });
    next(null);
  });


  view.on('init', function (next) {
    if (typeof locals.data === 'undefined') {
      next();
      return;
    }
    locals.processes.forEach(function (e, i) {
      view.on('init', function (next) {
        prepare.model.find({
          process: e._id
        })
          .exec(function (err, prepareData) {
            if (err) {
              console.log('DB error');
              console.log(err);
              return;
            }
            e.prepares = prepareData;
            next(err);
          });
      });
    });
    next(null);
  });

  view.on('init', function (next) {
    if (typeof locals.processes === 'undefined') locals.processes = [];
    /*locals.processes.push({
     title: 'Ny'
     });*/
    // TODO, add standard processes.
    next();
  });

  // Render the view
  view.render('edit');
};
