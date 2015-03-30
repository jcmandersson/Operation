/**
 * Created by abbe on 2015-03-25.
 */
var keystone = require('keystone');
var wkhtmltopdf = require('wkhtmltopdf');

exports = module.exports = function (req, res) {
  if (os.platform === 'win32') {
    //Change to the filepath of wkhtmltopdf.exe if you are on windows. 
    wkhtmltopdf.command = 'c:/program files/wkhtmltopdf/bin/wkhtmltopdf.exe';
  }
  //As this is sending the address to another program a relative address cannot be used here.
  wkhtmltopdf('http://localhost:3000/info/' + req.params.slug, { printMediaType: true, output: req.params.slug + '.pdf'});
  console.log('Print');
  
  res.send('saved to pdf');

};