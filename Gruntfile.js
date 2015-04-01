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
            keepRunner: true,
            specs: 'test/*-spec.js',
            template: 'test/template/spec-template.tmpl'
          }
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
}
