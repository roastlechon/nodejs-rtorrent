var gulp = require('gulp');
var bump = require('gulp-bump');
var browserify = require('browserify');
var watchify = require('watchify');
var stringify = require('stringify');
var partialify = require('partialify');
var source = require('vinyl-source-stream');
var replace = require('gulp-replace');
var spawn = require('child_process').spawn;
var es = require('event-stream');
var sass = require('gulp-ruby-sass');
var rimraf = require('gulp-rimraf');
var preprocess = require('gulp-preprocess');
var gutil = require('gulp-util');
var templateCache = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');

var packageJson = require('./package.json');

var nodemon = require('gulp-nodemon');

var watch = require('gulp-watch');

// Clean
gulp.task('clean', function() {
	return gulp.src('dist', {
			read: false
		})
		.pipe(rimraf());
});

// Copy
gulp.task('assets', function() {
	return gulp.src('src/assets/**/*')
		.pipe(gulp.dest('dist'))
});

// Sass
gulp.task('sass', function() {
	return gulp.src(['src/sass/styles.scss'])
		.pipe(sass({
			style: 'compressed'
		}).on('error', gutil.log))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('watch_index.html', function() {
	watch('src/client/index.html', function(file) {
		return file.pipe(preprocess({
				context: {
					VERSION: packageJson.version
				}
			}))
			.pipe(gulp.dest('dist'));
	});
	watch(['src/client/**/*.html', '!src/client/index.html'], function() {
		gulp.start('copy_html');
	});
	watch('src/sass/**/*.scss', function() {
		gulp.start('sass');
	});
});

gulp.task('copy_html', function() {
	return gulp.src([
		'src/client/**/*.html',
		'!src/client/index.html'
		])
		.pipe(minifyHTML({
			quotes: true,
			empty: true
		}))
		.pipe(templateCache({
			standalone: true
		}))
		.pipe(gulp.dest('src/client'));
});

// Scripts
gulp.task('scripts_prod', ['sass', 'assets', 'copy_html'], function() {
	return browserify({
			entries: './src/client/app.js'
		})
		.transform(stringify(['.html']))
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts_dev', ['sass', 'assets', 'copy_html'], function() {
	var w = watchify(browserify({
		cache: {},
		packageCache: {},
		fullPaths: true
	})).add('./src/client/app.js');

	w.on('update', function(ids) {
		gutil.log('[watchify] rebundling files: ', ids);
		return w.bundle()
			.on('error', gutil.log)
			.pipe(source('app.js'))
			.pipe(gulp.dest('./dist/js'));
	});

	gulp.start('watch_index.html');

	return w.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('./dist/js'));
});

// Update bower, component, npm at once:
gulp.task('bump', function() {
	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump())
		.pipe(gulp.dest('./'));
});

// Default
gulp.task('default', ['scripts_dev']);