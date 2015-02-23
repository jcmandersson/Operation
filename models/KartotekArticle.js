var keystone = require('keystone'),
  Types = keystone.Field.Types;

var KartotekArticle = new keystone.List('Kartotek artikel', {
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true
});

KartotekArticle.add({
  name: { type: String, required: true, initial: true },
  tags: { type: String, initial: true },
  storage: { label: 'Förråd', type: String, required: true, initial: true },
  section: { label: 'Sektion', type: Types.Number, required: true, initial: true },
  shelf: { label: 'Hylla', type: Types.Number, required: true, initial: true },
  tray: { label: 'Fack', type: Types.Number, required: true, initial: true },
  price: { label: 'Pris', type: Types.Money, required: true, initial: true }
});

/**
 Relationships
 =============
 */

KartotekArticle.relationship({ref: 'Artikel', path: 'kartotek'});

KartotekArticle.schema.statics.search = function(text, callback) {
  var search = new RegExp(text, 'ig');
  this.model('Kartotek artikel').find({
    $or: [{
      title: search
    }, {
      tags: search
    }]
  })
    .sort('name')
    .exec(callback);
};

KartotekArticle.defaultColumns = 'operation, name, createdBy|20%, createdAt|20%';
KartotekArticle.register();

var rest = require('keystone-rest');
rest.addRoutes(KartotekArticle, 'get post put delete');
