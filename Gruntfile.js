module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
      jasmine: {
        test: {
          src: './public/js/*.js',
          options: {
            specs: 'test/*-spec.js'
          }
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
}
