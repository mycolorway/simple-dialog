module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    connect:
      uses_defaults: {}
    coffee:
      module:
        files:
          'lib/url.js': 'src/dialog.coffee'
          'spec/lib/dialog-spec.js': 'spec/src/dialog-spec.coffee'
    watch:
      scripts:
        files: ['src/**/*.coffee', 'spec/src/**/*.coffee']
        tasks: ['coffee']
    jasmine:
      pivotal:
        src: 'lib/**/*.js'
        options:
          specs: 'spec/lib/dialog-spec.js'
          summary: true
          host : 'http://127.0.0.1:8000/'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.registerTask 'test', ['coffee', 'connect', 'jasmine']
