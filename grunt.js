
require('exists-patch').patch();

module.exports = exports = function(grunt) {
	grunt.loadNpmTasks('grunt-css');
	init(grunt);
};

exports.javascripts = [
	// 'public/javascripts/jquery-1.7.2.min.js',
	// 'public/javascripts/jquery.animation-enhanced.min.js',
	// 'public/javascripts/lodash.js',
	// 'public/javascripts/placeholder.js',
	// 'public/javascripts/lodash.js',
	// 'public/javascripts/app.js',
];

function init(grunt) {

	grunt.initConfig({
	// CSS Lint
		csslint: {
			all: {
				src: exports.stylesheets,
				rules: {
					'import': false,
					'overqualified-elements': 2
				}
			}
		},
	// CSS Min
		cssmin: {
			main: {
				src: [
					'public/stylesheets/foundation.css',
					'public/stylesheets/app.css'
				],
				dest: 'public/style.min.css'
			},
			resume: {
				src: [
					'public/stylesheets/foundation.css',
					'public/stylesheets/resume.css'
				],
				dest: 'public/resume.min.css'
			}
		},
	// JS Lint
		lint: {
			all: ['public/javascripts/app.js']
		},
		jshint: {
			options: {
				browser: true
			}
		},
	// JS Min
		min: {
			all: {
				src: exports.javascripts,
				dest: 'public/app.min.js'
			}
		}
	});

	// grunt.registerTask('default', 'cssmin lint min');
	grunt.registerTask('default', 'cssmin');


// Clean
	grunt.registerTask('clean', function() {
		var fs    = require('fs');
		var path  = require('path');

		fs.unlink(relpath('public/style.min.css'));
		fs.unlink(relpath('public/resume.min.css'));
		fs.unlink(relpath('public/app.min.js'));

		function relpath(file) {
			return path.join(__dirname, file);
		}
	});

}

