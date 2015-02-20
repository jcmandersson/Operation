var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Specialty = new keystone.List('Specialty', {
  autokey: { from: 'name', path: 'key' }
});

Specialty.add({
  name: { type: String, required: true }
});

Specialty.relationship({ ref: 'Operation', path: 'specialty' });

Specialty.register();
