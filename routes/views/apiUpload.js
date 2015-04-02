var keystone = require('keystone');
var operation = keystone.list('Operation');
var process = keystone.list('Processteg');
var content = keystone.list('Processinnehall');
var article = keystone.list('Artikel');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
if(typeof path.exist === 'undefined'){
  path = fs;
}

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;
  
  console.log(req.files);

  fs.readFile(req.files.file.path, function (err, data) {
    var newPath = __dirname + "/../../public/uploads/" + req.files.file.name;

    var i = 1;
    while (path.existsSync(newPath)) {
      newPath = __dirname + "/../../public/uploads/" + (i++) + '-' + req.files.file.name;
    }
    console.log(newPath);
    fs.writeFile(newPath, data, function (err) {
      console.log('success');
      res.status(200).send('{"error":false,"path": "/uploads/'+req.files.file.name+'"}');
    });
  });
};
