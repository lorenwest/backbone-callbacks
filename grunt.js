// grunt.js (c) 2012 Loren West and other contributors
// Node-monitor may be freely distributed under the MIT license.
// For all details and documentation:
// http://lorenwest.github.com/node-monitor

var exec = require('child_process').exec;

// This is used in the build automation tasks, and on the server
// when running in dev mode to serve individual files for debugging.
var MODULE_DEF = {
  lib: [
    "lib/Monitor.js",
    "lib/Probe.js",
    "lib/Connection.js",
    "lib/Server.js",
    "lib/Router.js"
  ],
  ext: [
    "node_modules/underscore/underscore.js",
    "node_modules/backbone/backbone.js",
    "node_modules/socket.io-client/dist/socket.io.js"
  ],
  probes: [
    "lib/probes/PollingProbe.js",
    "lib/probes/FileProbe.js",
    "lib/probes/Process.js"
  ]
};

// Build automation tasks
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    monitor: MODULE_DEF,
    meta: {
      banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
    },
    lint: {
      files: ['grunt.js', '<config:monitor.lib>', '<config:monitor.probes>', 'test/*.js']
    },
    test: {
      files: ['test/*.js']
    },
    watch: {
      files: ['grunt.js', 'yuidoc.json', '<config:monitor.lib>', '<config:monitor.probes>', 'config/doc/**', 'test/*.js'],
      tasks: 'doc lint test'
    },
    concat: {
      lib: {
        src: ['<banner>', '<config:monitor.lib>'],
        dest: './dist/monitor-<%= pkg.version %>.js'
      },
      all: {
        src: ['<banner>', '<config:monitor.ext>', '<config:monitor.lib>'],
        dest: './dist/monitor-all-<%= pkg.version %>.js'
      }
    },
    min: {
      lib: {
        src: ['<banner>', './dist/monitor-<%= pkg.version %>.js'],
        dest: './dist/monitor-<%= pkg.version %>-min.js'

      },
      all: {
        src: ['<banner>', './dist/monitor-all-<%= pkg.version %>.js'],
        dest: './dist/monitor-all-<%= pkg.version %>-min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    }
  });

  grunt.registerTask('doc', 'Generate documentation files', function() {
    var t = this, done = t.async(), child, version = grunt.config.get('pkg').version;
    var cmd = 'yuidoc --project-version ' + version;
    child = exec(cmd, function (error, stdout, stderr) {
      console.log(stderr);
      console.log(stdout);
      done();
    });
  });

  grunt.registerTask('rm_dist', 'Remove distribution files', function() {
    var t = this, done = t.async(), child;
    child = exec('rm -f dist/*', function (error, stdout, stderr) {
      console.log(stderr);
      console.log(stdout);
      done();
    });
  });

  // Default task.
  grunt.registerTask('default', 'doc lint test');
  grunt.registerTask('dist', 'rm_dist concat:lib concat:all min:lib min:all');

};

// Expose externally
module.exports.MODULE_DEF = MODULE_DEF;
