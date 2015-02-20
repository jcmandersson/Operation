var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Process = new keystone.List('Processteg', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true
});

Process.add({
  title: { type: String, required: true },
  operation: { type: Types.Relationship, ref: 'Operation', refPath: 'title', required: true, initial: true, index: true },
  content: { type: Types.Html, wysiwyg: true, height: 400 }
});

/**
 Relationships
 =============
 */

Process.defaultColumns = 'title, operation|20%';
Process.register();

var rest = require('keystone-rest');
rest.addRoutes(Process, 'get post put delete');
