/**
 * Created by abbe on 2015-02-27.
 */
var keystone = require('keystone'),
  Types = keystone.Field.Types;

var ProcessContent = new keystone.List('Processinnehåll', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true  
});

ProcessContent.add({
  order: { type: Number, required: true, default: 0},
  title: { type: String, required: true },
  text: { type: Types.Html, wysiwyg: true, height: 400},
  process: { type: Types.Relationship, ref: 'Processteg', many: true, initial: true, required: true}
});

ProcessContent.schema.statics.fromTemplate = function fromTemplate(processId, newProcessId, callback) {
  var thisDoc = this;

  this.model('Processinnehåll').find({
    process: processId
  }).exec(function(err, docs) {
    if(err) console.log(err);
    console.log(docs);
    for(var i = 0; i < docs.length; ++i) {
      var doc = docs[i];
      var newObject = JSON.parse(JSON.stringify(doc));
      delete newObject._id;
      newObject.process = newProcessId;
      newObject.template = false;

      var newDoc = new ProcessContent.model(newObject);
      newDoc.save(function(err, savedDoc){
        if(err) console.log(err);

      });
    }
  });
};

ProcessContent.register();

var rest = require('keystone-rest');
rest.addRoutes(ProcessContent, 'get post put delete');