var keystone = require('keystone');


/*var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);*/

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';
  locals.checks = [
    { articleName: "Abs Cilikonförband 5X12,5Cm Självhäftande",     storage: "NS", section: "39", shelf: "F", tray: "1", id: "check0", isChecked: false},
    { articleName: "Abs sökongörband 5 x 12,5Cm självhäftande",     storage: "SS", section: "32", shelf: "D", tray: "2", id: "check1", isChecked: false },
    { articleName: "Abs. Material , Strässel (T. Kemikalier)",      storage: "NO", section: "B", shelf: "B4", tray: "2", id: "check2", isChecked: false },
    { articleName: "Abs.Skydd Föxerinfbyxa",                        storage: "NO", section: "B", shelf: "B3", tray: "11", id: "check3", isChecked: false },
    { articleName: "Abs.Skydd Får Herrar Räbot",                    storage: "NO", section: "B", shelf: "B2", tray: "4", id: "check4", isChecked: false },
    { articleName: "Abs-fårband 10x10 cm",                          storage: "SS", section: "33", shelf: "F", tray: "2", id: "check5", isChecked: false },
    { articleName: "Abs-Forband 12X10Cm (S)",                       storage: "NS", section: "38", shelf: "A", tray: "1", id: "check6", isChecked: false },
    { articleName: "Abs-förband 11x20cm",                           storage: "SS", section: "33", shelf: "F", tray: "1", id: "check7", isChecked: false },
    { articleName: "Abs-förband 24x40",                             storage: "SS", section: "33", shelf: "G", tray: "1", id: "check8", isChecked: false },
    { articleName: "Abs-Förband 28X40Cm (S)",                       storage: "NS", section: "38", shelf: "A", tray: "2", id: "check9", isChecked: false },
    { articleName: "Abs-Förband Haft 10X35Cm (S)",                  storage: "NS", section: "38", shelf: "B", tray: "4", id: "check10", isChecked: false },
    { articleName: "Absorber Co3",                                  storage: "NO", section: "42", shelf: "F+G", tray: "", id: "check11", isChecked: false },
    { articleName: "Absorbtionshalk, Infinity ID CLICK absorbtion", storage: "SO", section: "45", shelf: "D", tray: "", id: "check12", isChecked: false }
  ];
  
  var sendCheckboxes = function(){
    keystone.io.emit('getCheckboxes', locals.checks);
  };
  keystone.io.on('connection', function(socket){
    sendCheckboxes();
    socket.on('checkboxClick', function(id){
      var idNumber = id.match(/\d+/)[0];  //Remove all non-digits in string.
      var isChecked = !locals.checks[idNumber].isChecked;
      locals.checks[idNumber].isChecked = isChecked;
      keystone.io.emit('checkboxClick', {id:id, isChecked: isChecked});
    });
  });

  // Render the view
  view.render('index');

};
