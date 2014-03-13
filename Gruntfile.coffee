module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    sass:
      styles:
        options:
          style: 'expanded'
        files:
          'styles/dialog.css': 'styles/dialog.scss'
    connect:
      uses_defaults: {}
    coffee:
      module:
        files:
          'lib/module.js': 'externals/simple-module/src/module.coffee'
      dialog:
        files:
          'lib/dialog.js': 'src/dialog.coffee'
      spec:
        files:
          'spec/lib/dialog-spec.js': 'spec/src/dialog-spec.coffee'
    watch:
      styles:
        files: ['styles/*.scss']
        tasks: ['sass']
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

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.registerTask 'test', ['coffee', 'connect', 'jasmine']
