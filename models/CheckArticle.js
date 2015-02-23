var keystone = require('keystone'),
  Types = keystone.Field.Types;

var CheckArticle = new keystone.List('Artikel', {
  plural: 'Artiklar',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true
});

CheckArticle.add({
  operation: { type: Types.Relationship, ref: 'Operation', refPath: 'title', required: true, initial: true, index: true },
  name: { type: String, required: true, initial: true },
  checked: { type: Types.Boolean, default: false },
  template: { type: Types.Boolean, default: true },
  kartotek: { type: Types.Relationship, ref: 'Kartotekartikel', refPath: 'name', initial: true}
});


/**
 Relationships
 =============
 */

CheckArticle.schema.methods.copyTemplate = function(operationId) {
  if(!this.template){
    console.log('Error: Article is not a template');
    return;
  }
  var newOperation = objectIdDel(JSON.parse(JSON.stringify(this)));
  newOperation.operation = operationId;
  newOperation.template = false;
  return new CheckArticle.model(newOperation).save(function(err, data){
    if(err){
      console.log('Unable to copy');
      return;
    }
    console.log('Copied!');
  });
};

CheckArticle.defaultColumns = 'operation, name, createdBy|20%, createdAt|20%';
CheckArticle.register();

var rest = require('keystone-rest');
rest.addRoutes(CheckArticle, 'get post put delete');
