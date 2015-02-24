var keystone = require('keystone');
var kartotek = keystone.list('Kartotekartikel');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';
  
  kartotek.model.find()
    .exec(function(err, data) {
    if(err) {
      console.log('DB error');
      console.log(err);
      return;
    }
    else {
        console.log(data);
        locals.checks = data;
        view.render('index');      

    }
     
  });
  
  /**locals.checks = [];
    { articleName: "Abs Cilikonförband 5X12,5Cm Självhäftande",     storage: "NS", section: "39", shelf: "F", tray: "1" },
    { articleName: "Abs sökongörband 5 x 12,5Cm självhäftande",     storage: "SS", section: "32", shelf: "D", tray: "2" },
    { articleName: "Abs. Material , Strässel (T. Kemikalier)",      storage: "NO", section: "B", shelf: "B4", tray: "2" },
    { articleName: "Abs.Skydd Föxerinfbyxa",                        storage: "NO", section: "B", shelf: "B3", tray: "11" },
    { articleName: "Abs.Skydd Får Herrar Räbot",                    storage: "NO", section: "B", shelf: "B2", tray: "4" },
    { articleName: "Abs-fårband 10x10 cm",                          storage: "SS", section: "33", shelf: "F", tray: "2" },
    { articleName: "Abs-Forband 12X10Cm (S)",                       storage: "NS", section: "38", shelf: "A", tray: "1" },
    { articleName: "Abs-förband 11x20cm",                           storage: "SS", section: "33", shelf: "F", tray: "1" },
    { articleName: "Abs-förband 24x40",                             storage: "SS", section: "33", shelf: "G", tray: "1" },
    { articleName: "Abs-Förband 28X40Cm (S)",                       storage: "NS", section: "38", shelf: "A", tray: "2" },
    { articleName: "Abs-Förband Haft 10X35Cm (S)",                  storage: "NS", section: "38", shelf: "B", tray: "4" },
    { articleName: "Absorber Co3",                                  storage: "NO", section: "42", shelf: "F+G", tray: "" },
    { articleName: "Absorbtionshalk, Infinity ID CLICK absorbtion", storage: "SO", section: "45", shelf: "D", tray: "" },
  ];*/

  // Render the view
  //view.render('index');

};  
