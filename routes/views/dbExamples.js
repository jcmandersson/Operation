var keystone = require('keystone');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'dbExamples';

  operation.model.find()
    .where('title', 'Blindtarmsinflammation')
    .exec(function (err, data) {
      if (err) {
        console.log('DB error');
        console.log(err);
        return;
      }
      
      console.log(data);
      //Tar bort operationen ifall den finns för att inte få dubletter
      if (data.length) {
        operation.model
          .where('_id', data[0]._id)
          .remove(function (err, data) {
            console.log(data);
            if (!err) {
              console.log('Operationen är borttagen.');
            }
          });
      }

      //Skapar en ny operation
      var newOperation = new operation.model({
        title: 'Blindtarmsinflammation',
        tags: 'appendix',
        template: false
      }).save(function (err) {
          if (err) {
            console.log('Operationen kunde inte skapas.!');
            return;
          }
          console.log('Operation skapad!');
        });

    });

  //Söker efter operation med hjälp av den statiska sökfunkitonen som jag skapat i modellen. Söker i både taggar och titeln
  operation.model.search('ACI Ar', function (err, data) { 
    if (err) {
      console.log('DB error');
      return;
    }
    console.log(data);
    locals.db = data.toString();
    view.render('dbExamples');
  });
};
