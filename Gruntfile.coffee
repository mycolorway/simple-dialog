module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    sass:
      dialog:
        options:
          style: 'expanded'
        files:
          'styles/dialog.css': 'styles/dialog.scss'

    coffee:
      dialog:
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
        tasks: ['coffee']
      jasmine:
        files: [
          'styles/dialog.css'
          'lib/dialog.js'
          'specs/*.js'
        ],
        tasks: 'jasmine:test:build'

    jasmine:
      terminal:
        src: ['lib/dialog.js']
        options:
          specs: 'spec/dialog-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js'
            'vendor/bower/simple-module/lib/module.js'
          ]
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

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'default', ['sass', 'coffee', 'jasmine:test:build', 'watch']
  grunt.registerTask 'test', ['sass', 'coffee', 'jasmine:terminal']
