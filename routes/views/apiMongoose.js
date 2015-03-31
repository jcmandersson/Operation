var keystone = require('keystone');
var mongoose = require('mongoose');

exports = module.exports = function (req, res) {
  
  var object = {
    newId: mongoose.Types.ObjectId()
  };
  
  res.send(JSON.stringify(object));
};
