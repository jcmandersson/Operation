var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Specialty = new keystone.List('Specialitet', {
  plural: 'Specialiteter',
  autokey: { from: 'name', path: 'key' }
});

Specialty.add({
  name: { type: String, required: true },
  abbrevation: { type: String, required: true, initial: true }
});

Specialty.relationship({ ref: 'Operation', path: 'specialty' });

Specialty.register();

var rest = require('keystone-rest');
rest.addRoutes(Specialty, 'get post put delete');
