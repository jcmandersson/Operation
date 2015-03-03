var keystone = require('keystone');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'oversikt';

  locals.scripts = [
    'oversikt.js'
  ];

  view.on('init', function (next) {
    operation.model.find({
      //template: false
    }).populate('specialty')
      .exec(function (err, docs) {
        console.log(docs);
        docs.forEach(function (e, i) {

        });
        locals.operations = docs;
        next();
      });
  });

  view.render('oversikt');
};
