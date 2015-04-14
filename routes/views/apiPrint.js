/**
 * Created by abbe on 2015-03-25.
 */
var keystone = require('keystone');
var pdfCreate = require('./../../lib/pdfCreate.js');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {  
  operation.model.findOne({
    _id: req.query.id
  }).populate('-updatedAt specialty').exec(function(err, data) {
    if (err || data === null) {
      console.log('Operation not found');      
    } else {
      pdfCreate(data);
    }
    res.send('saved to pdf');
  });  
};


