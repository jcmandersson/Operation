module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      jasmine: {
        test: {
          src: './public/js/*.js',
          options: {
            vendor: [
              'public/js/lib/jquery/jquery-2.1.1.js',
              'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
            ],
            specs: 'test/*-spec.js'
          }
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
}
