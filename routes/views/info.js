/**
 * Created by pal on 2015-02-26.
 */
var keystone = require('keystone');
var operation = keystone.list('Operation');
var process = keystone.list('Processteg');


exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'info';
  
  operation.model.find({
    slug: req.params.slug
  }).populate('specialty processes')
    .exec(function (err, data) {
      if (err) {
        console.log('DB error');
        console.log(err);
        return;
      } else if (data.length === 0) {
        locals.data = {title: "Sidan finns ej"}
        view.render('info');
      } else {
        locals.data = data[0];
        console.log(data);

        process.model.find({
          operation: data[0]._id
        })
          .exec(function (err, processData) {
            if (err) {
              console.log('DB error');
              console.log(err);
              return;
            }
            console.log(processData);
            locals.processes = processData;

            view.render('info');
          });
      }

    });

};
