var keystone = require('keystone');
var async = require('async');
var artikel = keystone.list('Artikel');

exports = module.exports = function(done) {
  artikel.model.collection.drop();
  done();
};

//exports.__defer__ = true;
