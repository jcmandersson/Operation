/**
 * Created by abbe on 2015-04-14.
 */
var keystone = require('keystone');
var operation = keystone.list('Operation');
var os = require('os');
var wkhtmltopdf = require('wkhtmltopdf');
var mkdirp = require('mkdirp');

var pdfCreate = exports = module.exports = function(data) {
  if (os.platform() === 'win32') {
    // Change to the filepath of wkhtmltopdf.exe if you are on windows. 
    wkhtmltopdf.command = "C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe";
  }

  // Path to the folder where the pdfs will be store. Folder need to exist.
  var pdfPath = 'pdf-kopior/';
  var path = pdfPath + data.specialty.name + '/' + data.title;
  mkdirp(path, function (err) {
    if (err) {
      if (err != 'EEXIST') {
        console.log(err);
        console.log('Error when creating folder');
        return;
      }
    }
    if (data.lastPrinted < data.lastUpdated) {
      data.version = Math.round((data.version + 0.1) * 10) / 10;
      data.lastPrinted = new Date();
      data.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          // As this is sending the address to another program a relative address cannot be used here.
          /*wkhtmltopdf('http://localhost:3000/info/' + data.slug, {
            printMediaType: true, output: path + '/' + data.slug + '-v' + data.version + '.pdf'
          });*/

        }
      });
    }
  });
};

var oneHour = 3600000;
var interval = function() {
  operation.model.find({
    template: true,
    state: 'Publicerad'
  }).populate('-updatedAt specialty').exec(function (err, data) {
    if (err) {
      console.log(err);
    } else if (data === null) {
      console.log('No operations found');
    } else {
      data.forEach(function (operation) {
        pdfCreate(operation);
      });
    }
  });
  console.log('PDF Updated');
};
setInterval(interval, oneHour);
interval();
