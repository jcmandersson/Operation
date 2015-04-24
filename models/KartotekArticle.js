var keystone = require('keystone'),
  Types = keystone.Field.Types;

var KartotekArticle = new keystone.List('Kartotekartikel', {
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true
});

KartotekArticle.add({
  name: { type: String, required: true, initial: true },
  tags: { type: String, initial: true },
  storage: { label: 'Förråd', type: String, required: false, initial: true },
  section: { label: 'Sektion', type: String, required: false, initial: true },
  shelf: { label: 'Hylla', type: String, required: false, initial: true },
  tray: { label: 'Fack', type: String, required: false, initial: true },
  price: { label: 'Pris', type: Types.Money, required: false, initial: true }, //TODO Ändra till required när det är implementerat.
  articleNumber: { type: String, required: false, initial: true },
  supplierArticleNumber: {type: String, required: false, initial: true },
  clinic: {type: String, required: false, initial: true },
  supplier: {type: String, required: false, initial: true },
  orderItem: {type: String, required: false, initial: true },
  amount: {type: Types.Number, required: false, initial: true },
  unit: {type: String, required: false, initial: true },
  peoe: {type: String, requred: false, initial: true}
});

/**
 Relationships
 =============
 */


KartotekArticle.relationship({ref: 'Artikel', path: 'kartotek'});

KartotekArticle.schema.statics.search = function(text, callback) {
  var search = new RegExp(text, 'ig');
  return this.model('Kartotekartikel').find({
    $or: [{
      name: search
    }, {
      tags: search
    }, {
      articleNumber: search
    }]
  }).sort('name');
};

KartotekArticle.defaultColumns = 'operation, name, createdBy|20%, createdAt|20%';
KartotekArticle.register();

var rest = require('keystone-rest');
rest.addRoutes(KartotekArticle, 'get post put delete');
