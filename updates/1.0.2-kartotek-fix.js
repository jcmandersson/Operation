var keystone = require('keystone');
var async = require('async');
var mongoose = require('mongoose');
var kartotek = keystone.list('Kartotekartikel');

exports = module.exports = function(done) {
  kartotek.model.find({}, function(err, docs) {
    for(var i = 0; i < docs.length; ++i){
      e = docs[i];
      e.slug = mongoose.Types.ObjectId();
      e.save();
    }
    done();
  });
};
