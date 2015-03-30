var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Specialty = new keystone.List('Specialitet', {
  plural: 'Specialiteter',
  autokey: { from: 'name', path: 'key' }
});

Specialty.add({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true, initial: true }
});

Specialty.relationship({ ref: 'Operation', path: 'operations', refPath: 'speciality'});

Specialty.schema.statics.search = function(text, callback) {
  var search = new RegExp(text, 'ig');
  return this.model('Specialitet').find({
    $or: [{
      name: search
    }, {
      abbreviation: search
    }]
  });
};

Specialty.register();

var rest = require('keystone-rest');
rest.addRoutes(Specialty, 'get post put delete');
