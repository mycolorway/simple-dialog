module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    sass:
      styles:
        options:
          bundleExec: true
          style: 'expanded'
          sourcemap: 'none'
        files:
          'styles/dialog.css': 'styles/dialog.scss'

    coffee:
      options:
        bare: true
      src:
        files:
          'lib/dialog.js': 'src/dialog.coffee'
      spec:
        files:
          'spec/dialog-spec.js': 'spec/dialog-spec.coffee'

    watch:
      styles:
        files: ['styles/*.scss']
        tasks: ['sass']
      scripts:
        files: ['src/*.coffee', 'spec/*.coffee']
        tasks: ['coffee', 'umd']
      jasmine:
        files: [
          'styles/dialog.css'
          'lib/dialog.js'
          'specs/*.js'
        ],
        tasks: 'jasmine:test:build'

    jasmine:
      test:
        src: ['lib/dialog.js']
        options:
          outfile: 'spec/index.html'
          styles: 'styles/dialog.css'
          specs: 'spec/dialog-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js'
            'vendor/bower/simple-module/lib/module.js'
          ]

    umd:
      all:
        src: 'lib/dialog.js'
        template: 'umd.hbs'
        amdModuleId: 'simple-dialog'
        objectToExport: 'dialog'
        globalAlias: 'dialog'
        deps:
          'default': ['$', 'SimpleModule']
          amd: ['jquery', 'simple-module']
          cjs: ['jquery', 'simple-module']
          global:
            items: ['jQuery', 'SimpleModule']
            prefix: ''


  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-umd'

  grunt.registerTask 'default', ['sass', 'coffee', 'umd', 'jasmine:test', 'watch']
  grunt.registerTask 'test', ['sass', 'coffee', 'umd', 'jasmine:test']
