var gulp = require('gulp');
var bump = require('gulp-bump');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var rimraf = require('gulp-rimraf');
var preprocess = require('gulp-preprocess');
var gutil = require('gulp-util');
var templateCache = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var packageJson = require('./package.json');
var watch = require('gulp-watch');

// Clean tmp folder
gulp.task('clean', function () {
	return gulp.src('.tmp', {
			read: false
		})
		.pipe(rimraf());
});

// Clean tmp folder
gulp.task('clean_dist', function () {
	return gulp.src('dist', {
			read: false
		})
		.pipe(rimraf());
});

// Copy assets to dist folder
gulp.task('copy_assets', ['clean', 'clean_dist'], function () {
	return gulp.src('src/assets/**/*')
		.pipe(gulp.dest('dist'))
});

// Copy client scripts to .tmp folder to build
gulp.task('copy_scripts', ['clean', 'clean_dist'], function () {
	return gulp.src([
		'src/client/**/*', 
		'!src/client/**/*.html'
		])
		.pipe(gulp.dest('.tmp'));
});

gulp.task('watch_scripts', ['clean', 'clean_dist'], function () {
	watch([
		'src/client/**/*',
		'!src/client/**/*.html'
		], function (files) {
			return files.pipe(gulp.dest('.tmp'));
		});
})

// Compile sass from src and copy to dist
gulp.task('compile_sass', ['clean', 'clean_dist'], function () {
	return gulp.src(['src/sass/styles.scss'])
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', gutil.log))
		.pipe(gulp.dest('dist/css'));
});

// Watches sass files and compiles to dist
gulp.task('watch_compile_sass', ['clean', 'clean_dist'], function () {
	watch('src/sass/**/*.scss', function () {
		return gulp.src(['src/sass/styles.scss'])
			.pipe(sass()
			.on('error', gutil.log))
			.pipe(gulp.dest('dist/css'));
	});
});

// Preprocess index.html from src to dist
gulp.task('preprocess_index.html', ['clean', 'clean_dist'], function () {
	return gulp.src('src/client/index.html')
		.pipe(preprocess({
			context: {
				VERSION: packageJson.version
			}
		}))
		.pipe(gulp.dest('dist'));
});

// Watch index.html and preprocess index.html from src to dist
gulp.task('watch_preprocess_index.html', ['clean', 'clean_dist'], function () {
	watch('src/client/index.html', function(file) {
		return file.pipe(preprocess({
				context: {
					VERSION: packageJson.version
				}
			}))
			.pipe(gulp.dest('dist'));
	});
});

// Minify html templates from src to .tmp into templates.js file
gulp.task('minify_templates', ['clean', 'clean_dist'], function () {
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
		.pipe(gulp.dest('.tmp'));
});

// Watch templates from src and minify to .tmp into templates.js file
gulp.task('watch_templates', ['clean', 'clean_dist'], function () {
	watch([
		'src/client/**/*.html',
		'!src/client/index.html'
		], function () {
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
				.pipe(gulp.dest('.tmp'));
		});
});

// Compiles client source using browserify. Minifies and pipes everything 
// to dist folder.
gulp.task('browserify', ['preprocess_index.html', 'copy_assets', 'copy_scripts', 
	'compile_sass', 'minify_templates'], function () {
	return browserify()
		.add('./.tmp/app.js')
		.plugin('minifyify', {
			map: false
		})
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('dist/js'));
});

// Watches file dependencies in app.js in .tmp folder and compiles to
// the dist folder.
gulp.task('watchify', ['watch_preprocess_index.html', 'preprocess_index.html', 'copy_assets', 
	'watch_scripts', 'copy_scripts', 'watch_compile_sass', 'watch_templates', 'minify_templates'], function () {

	function bundle (ids) {

		if (ids) {
			gutil.log('[watchify] rebundling files: ', ids);	
		}
		
		return bundler.bundle()
			.on('error', gutil.log)
			.pipe(source('app.js'))
			.pipe(gulp.dest('./dist/js'));
	}

	var bundler = watchify(browserify({
		cache: {},
		packageCache: {},
		fullPaths: true,
		debug: true
	})).add('./.tmp/app.js');

	bundler.on('update', bundle);

	return bundle();

});

// Update bower, component, npm at once:
gulp.task('bump', function () {
	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump())
		.pipe(gulp.dest('./'));
});

// Dev task that calls watch functions
gulp.task('dev', ['watchify'], function () {
	gutil.log('Finished executing dev run sequence.');
	gutil.log('Watching for changes...');
});

// Default task that calls production build
gulp.task('default', ['browserify'], function () {
	gutil.log('Finished executing prod run sequence.');
});