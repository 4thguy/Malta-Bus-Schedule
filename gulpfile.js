'use strict';

/* Gulp */
var argv 			= require('yargs').argv;
var browserSync 	= require('browser-sync');
var concat 			= require('gulp-concat');
var del 			= require('del');
var fs 				= require("fs");
var extender 		= require('gulp-html-extend');
var gulp 			= require('gulp');
var gulpif 			= require('gulp-if');
var htmlreplace 	= require('gulp-html-replace');
var imagemin 		= require('gulp-imagemin');
var jshint 			= require('gulp-jshint');
var minifycss 		= require('gulp-minify-css');
var rename 			= require("gulp-rename");
var reload 			= browserSync.reload;
var runSequence 	= require('run-sequence');
var size 			= require('gulp-size');
var sourcemaps 		= require('gulp-sourcemaps');
var uglify 			= require('gulp-uglify');

/* PostCSS */
var postcss 		= require('gulp-postcss');
var atImport 		= require('postcss-import');
var autoprefixer 	= require('autoprefixer-core');
var nestedcss		= require('postcss-nested');
var vars  			= require('postcss-simple-vars')

/* Config */
var variables 		= require('./src/styles/base/variables');

var basePaths = {
	src: 'src/',
	dest: 'build/'
};

var paths = {
	styles: {
		src: basePaths.src + 'styles/',
		dest: basePaths.dest + 'css/'
	},
	scripts: {
		src: basePaths.src + 'scripts/',
		dest: basePaths.dest + 'js/'
	},
	images: {
		src: basePaths.src + 'images/',
		dest: basePaths.dest + 'img/'
	},
	fonts: {
		src: basePaths.src + '../bower_components/font-awesome/fonts/',
		dest: basePaths.dest + 'css/fonts/'
	}
};

/* Tasks */
gulp.task('clean', function (cb) {
	del([basePaths.dest], cb);
});

gulp.task('html', function () {
	gulp.src(basePaths.src + '*.html')
	.pipe(extender({annotations:true,verbose:false}))
	.pipe(gulpif(argv.production, htmlreplace({
		'styles_production': 'css/styles.min.css',
		'js_production': 'js/main.min.js'
	})))
	.pipe(gulp.dest((basePaths.dest)));
});

gulp.task('styles', function () {

	var processors = [
		atImport({path: "bower_components"}),
		vars({ variables: variables }),
		nestedcss,
		autoprefixer({browsers: ['last 2 version']}),
	];

	return gulp.src([
		paths.styles.src + 'styles.css',
	])
	.pipe(postcss(processors))
	.pipe(gulpif(argv.dev, sourcemaps.init()))
	.pipe(gulpif(argv.production, rename({suffix: '.min'})))
	.pipe(gulpif(argv.production, minifycss({keepBreaks:false})))
	.pipe(gulpif(argv.dev, sourcemaps.write()))
	.pipe(gulp.dest((paths.styles.dest)))
	.pipe(reload({stream: true}))
	.pipe(size({title: 'styles'}));
});

var scriptsSrc = [
	/* jQuery */
	'bower_components/jquery/dist/jquery.min.js',
	/* Bootstrap */
	'bower_components/bootstrap/dist/js/bootstrap.min.js',
	'bower_components/knockout/dist/knockout.js',
	/* Custom  */
	paths.scripts.src + 'main.js'
];

gulp.task('scripts', function () {
	return gulp.src( scriptsSrc )
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('default'))
	.pipe(size({title: 'scripts'}))
	.pipe(gulpif(argv.production, concat('main.js')))
	.pipe(gulpif(argv.production, rename({suffix: '.min'})))
	.pipe(gulpif(argv.production, uglify({preserveComments: 'some'})))// Keep some comments
	.pipe(gulp.dest((paths.scripts.dest)))
	.pipe(size({title: 'scripts'}));
});


gulp.task('images', function () {
	return gulp.src(paths.images.src + '**/*.*')
	.pipe(imagemin({
		progressive: true,
		optimizationLevel : 8
	}))
	.pipe(gulp.dest(paths.images.dest))
	.pipe(size({title: 'images'}));
});

gulp.task('custom-fonts', function() {
	gulp.src(paths.fonts.src + '**/*.*')
	.pipe(gulp.dest('build/fonts/'))
	.pipe(size({title: 'fonts'}));
});


gulp.task('default', ['builder'], function() {
	browserSync({
		server: {
			baseDir: basePaths.dest
		}
	});
	gulp.watch(basePaths.src + '**/*.html', ['html', reload]);
	gulp.watch(basePaths.src + '*.html', ['styles']);
	gulp.watch(paths.styles.src + '**/*.css', ['styles']);
	gulp.watch(paths.scripts.src + '**/*.js', ['scripts', reload]);
	gulp.watch(paths.images.src + '**/*.*', ['images', reload]);
	gulp.watch(paths.fonts.src + '**/*', ['fonts', reload]);
});

gulp.task('builder', ['clean'], function (cb) {
	runSequence(['html', 'styles', 'scripts', 'images'], cb);
});
