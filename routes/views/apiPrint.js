/**
 * Created by abbe on 2015-03-25.
 */
var keystone = require('keystone');
var wkhtmltopdf = require('wkhtmltopdf');

exports = module.exports = function (req, res) {
  wkhtmltopdf('http://localhost:3000/info/' + req.params.slug, { printMediaType: true, output: req.params.slug + '.pdf'});
  console.log('Print');
  
  res.send('saved to pdf');

};
