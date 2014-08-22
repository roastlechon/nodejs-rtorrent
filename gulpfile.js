var gulp = require('gulp');
var bump = require('gulp-bump');
var browserify = require('browserify');
var watchify = require('watchify');

var source = require('vinyl-source-stream');
var replace = require('gulp-replace');
var spawn = require('child_process').spawn;
var es = require('event-stream');
var sass = require('gulp-ruby-sass');
var clean = require('gulp-clean');
var preprocess = require('gulp-preprocess');

// General error handling function
var handleError = function(err) {
	console.log(err.name, ' in ', err.plugin, ': ', err.message);
	this.emit('end');
};

// Clean
gulp.task('clean', function() {
	return gulp.src('app', {
		read: false
	}).pipe(clean());
});

// Copy
gulp.task('copy', ['clean'], function() {
	return es.concat(
		// copy template files
		gulp.src('src/client/partials/**/*.html')
		.pipe(gulp.dest('app/client/partials')),
		// copy assets
		gulp.src('src/assets/**/*')
		.pipe(gulp.dest('app/client')),
		// copy server
		gulp.src('src/server/**/*')
		.pipe(gulp.dest('app/server'))
	);
});

gulp.task('preprocess_dev', ['copy'], function() {
	return es.concat(
		gulp.src('src/client/index.html')
		.pipe(preprocess({
			context: {
				NODE_ENV: 'development'
			}
		}))
		.pipe(gulp.dest('app/client')),
		gulp.src('src/vendor/underscore/underscore.js')
		.pipe(gulp.dest('app/client/vendor/underscore')),
		gulp.src('src/vendor/jquery/dist/jquery.js')
		.pipe(gulp.dest('app/client/vendor/jquery/dist')),
		gulp.src('src/vendor/angular/angular.js')
		.pipe(gulp.dest('app/client/vendor/angular'))
	);
});

gulp.task('preprocess_prod', ['copy'], function() {
	return gulp.src('src/client/index.html')
		.pipe(preprocess({
			context: {
				NODE_ENV: 'production'
			}
		}))
		.pipe(gulp.dest('app/client'));
});

// Sass
gulp.task('sass', ['copy'], function() {
	return gulp.src(['src/sass/styles.scss'])
		.pipe(sass({
			style: 'compressed'
		}).on('error', handleError))
		.pipe(gulp.dest('app/client/css'));
});

// Scripts
gulp.task('scripts_prod', ['sass', 'preprocess_prod'], function() {
	return browserify({
			entries: './src/client/app.js'
		})
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('app/client/js'));
});

gulp.task('scripts_dev', ['sass', 'preprocess_prod'], function() {
	var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: './src/client/app.js'
  });

  var w = watchify(b);

	w.on('update', rebundle);

	function rebundle(ids) {
    console.log(ids)
		var stream = w.bundle()
    stream.on('error', handleError);

    return stream
      .pipe(source('app.js'))
			.pipe(gulp.dest('./app/client/js'));
	}

  rebundle();

});

// Update bower, component, npm at once:
gulp.task('bump', function() {
	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump())
		.pipe(gulp.dest('./'));
});

// Default
gulp.task('default', ['scripts_dev']);