var keystone = require('keystone');
var async = require('async');
var artikel = keystone.list('Artikel');

exports = module.exports = function(done) {
  artikel.model.collection.drop();
};

exports.__defer__ = true;
