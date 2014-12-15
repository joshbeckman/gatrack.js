module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      general: {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> By <%= pkg.author %>, <%= grunt.template.today("dd-mm-yyyy") %>, <%= pkg.repository.url %>, License: <%= pkg.license %> */\n',
          mangle: {
            except: ['gatrack']
          }
        },
        files: {
          'dist/gatrack.min.js': ['src/gatrack.js']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'src/gatrack.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('crush', ['uglify']);
  grunt.registerTask('default', ['jshint', 'uglify']);
};