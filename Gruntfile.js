module.exports = function(grunt) {

	// Configure Grunt
	grunt.config.init({
		pkg: grunt.file.readJSON('package.json'),
		//secret: grunt.file.readJSON('secret.json'),
		watch : {
			js : {
				files : ['js/app/*.js', 'js/libs/*.js', 'js/main.js']
			},
			sass : {
				files : ['sass/**/*.scss'],
				tasks : ['compass:dev']
			}
		},
		compass : {
			options : {
				config : 'config/config.rb'
			},
			dev : {},
			dist : {
				options : {
					outputStyle : 'compressed'
				}
			}
		},
		requirejs: {
			options: {
				baseUrl: 'js/libs',
				name : '../main',
				mainConfigFile : 'js/main.js'
			},
			dist: {
				options: {
					optimize: 'uglify2',
					preserveLicenseComments: false,
					generateSourceMaps: false,
					compress: {
						dead_code: true,
						unused: true
					},
					out: 'js/app.min.js'
				}
			}
		},
		copy : {
			main : {
				files : [
					{ expand: true, src: ['./*', '!./secret.json', '!./Gruntfile.js', '!./package.json'], dest: 'build/', filter: 'isFile' },
					{ expand: true, src: ['./js/require.js', './js/app.min.js', './js/libs/modernizr.min.js'], dest: 'build/', filter: 'isFile' },
					{ expand: true, src: ['./css/**'], dest: 'build/' }
				]
			},
			base : {
				files : [
					{ expand: true, src: ['./*', '!./secret.json', '!./Gruntfile.js', '!./package.json'], dest: 'build/', filter: 'isFile' }
				]
			},
			js : { 
				files : [
					{ expand: true, src: ['./js/require.js', './js/app.min.js', './js/libs/modernizr.min.js'], dest: 'build/', filter: 'isFile' }
				]
			},
			css : { 
				files : [
					{ expand: true, src: ['./css/**'], dest: 'build/' }
				]
			}
		},
		clean : {
			build : ['./build']
		},
		imagemin : {
			main : {
				options: {
					optimizationLevel: 3,
					cache: false
				},
				files : [
					{ expand: true, src: ['./img/**/*.{png,jpg,gif}'], dest: './build' }
				]
			}
		},
		htmlbuild: {
			dist: {
				src: 'index.html',
				dest: 'build/',
				options: {
					prefix : '/',
					beautify: true,
					relative: false,
					scripts: {
						require: 'js/require.js',
						maindist: 'js/app.min.js'
					}
				}
			}
		},
		sftp: {
			options: {
				path: '<%= secret.tmp %>',
				host: '<%= secret.host %>',
				username: '<%= secret.username %>',
				password: '<%= secret.password %>',
				showProgress: true,
				createDirectories: true,
				directoryPermissions: parseInt(755, 8),
				srcBasePath: "build/"
			},
			base: {
				files: {
					'./': ['build/*']
				},
				options: {
					createDirectories: false
				}
			},
			css: {
				files: {
					'./': ['build/css/**']
				}
			},
			js: {
				files: {
					'./': ['build/js/**']
				}
			},
			img: {
				files: {
					'./': ['build/img/**']
				}
			}
		},
		sshexec: {
			options: {
				host: '<%= secret.host %>',
				username: '<%= secret.username %>',
				password: '<%= secret.password %>'
			},
			test: {
				command: 'whoami',
			},
			movetmp : {
				command : 'cp -vR <%= secret.tmp %>/* <%= secret.path %>'
			}
		}
	});

	// Load Grunt plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-html-build');

	// Register Grunt tasks
	// Development Tasks
	grunt.task.registerTask('default', ['compass:dev', 'watch']);

	//Compilation Tasks
	grunt.task.registerTask('compile', ['compass:dev', 'requirejs:dist']);

	//Build Tasks
	grunt.task.registerTask('build', ['clean:build', 'compass:dist', 'requirejs:dist', 'imagemin:main', 'copy:main', 'htmlbuild:dist']);
	grunt.task.registerTask('buildbase', ['clean:build', 'copy:base', 'htmlbuild:dist']);
	grunt.task.registerTask('buildjs', ['clean:build', 'requirejs:dist', 'copy:js']);
	grunt.task.registerTask('buildcss', ['clean:build', 'compass:dist', 'copy:css']);
	grunt.task.registerTask('buildimg', ['clean:build', 'imagemin:main']);

	// Deployment Tasks
	grunt.task.registerTask('dist', [
		'build',
		'sftp:base',
		'sftp:css',
		'sftp:js',
		'sftp:img',
		'sshexec:movetmp'
	]);
	grunt.task.registerTask('dist_base', [
		'buildbase',
		'sftp:base',
		'sshexec:movetmp'
	]);
	grunt.task.registerTask('dist_img', [
		'buildimg',
		'sftp:img',
		'sshexec:movetmp'
	]);
	grunt.task.registerTask('dist_js', [
		'buildjs',
		'sftp:js',
		'sshexec:movetmp'
	]);
	grunt.task.registerTask('dist_css', [
		'buildcss',
		'sftp:css',
		'sshexec:movetmp'
	]);

	//Server Connection Test
	grunt.task.registerTask('test', ['sshexec:test']);
};