/**
 * Created by abbe on 2015-04-14.
 */

var utils = require('mongo-utils');
var config = require('./../config.js');

var backup = function() {
  var date = new Date();
  var dateFormatted = date.getFullYear() + '-' + ((date.getMonth() < 9) ? '0' : '') + (date.getMonth() + 1)
    + '-' + ((date.getDate() < 10) ? '0' : '') + date.getDate();
  // Address to the database.
  var connectionString = config.mongodbConnStr;
  // Path to where the dump will be created.
  var path =  config.pathToBackup + dateFormatted;
  utils.dumpDatabase(connectionString, path, function(err, stdout, stderr) {
    if (err) console.log(err);
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
  });
};

backup();
setInterval(backup, config.timeBetweenBackups);


