/**
 * Created by abbe on 2015-04-23.
 */

var config = {};

config.port = 3000;

// This needs to be set to the path of wkhtmltopdf.exe if the application is used on windows.
config.pathToWkHtml = 'C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe';
config.pathToMongodump = '';
config.pathToBackup = '../backup/';
config.mongodbConnStr = 'mongodb://localhost:27017/operation';
config.timeBetweenBackups = 24 * 3600000; // One day in milliseconds
config.timeBetweenPdfUpdate = 3600000; // One hour in milliseconds
config.pathToPdf = 'pdf-kopior/';
// Needs to end with /
config.siteUrl = 'http://localhost:'+config.port+'/';

module.exports = config;
