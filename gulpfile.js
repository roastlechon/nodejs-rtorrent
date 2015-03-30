var bump = require('gulp-bump');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
// var karma = require('karma').server;
// var react = require('gulp-react');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var ngHtml2Js = require('gulp-ng-html2js');
var rimraf = require('gulp-rimraf');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var path = require('path');
var tinylr = require('tiny-lr')();
var mainBowerFiles = require('main-bower-files');
var wrap = require('gulp-wrap');
var series = require('stream-series');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var angularFilesort = require('gulp-angular-filesort');
var packageJson = require('./package.json');
var preprocess = require('gulp-preprocess');

var jsfilewrap = '(function() {\'use strict\'; <%= contents %>})();';

gulp.task('clean', function () {
	return gulp.src('dist', {
			read: false
		})
		.pipe(rimraf());
});

// Copy assets to dist folder
gulp.task('copy', function () {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist'));
});

// Compile sass from src and copy to dist
gulp.task('scss', function () {
	return gulp.src(['src/sass/styles.scss'])
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', gutil.log))
		.pipe(gulp.dest('dist/css'));
});

// Preprocess index.html from src to dist
gulp.task('preprocess', function () {
	return gulp.src('src/client/index.html')
		.pipe(preprocess({
			context: {
				VERSION: packageJson.version
			}
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
  return series(
      gulp.src(mainBowerFiles({
          filter: '**/*.js'
        }, {
          base: 'src/vendor'
        })
        .concat('src/client/**/*.tpl.html')),
      gulp.src('src/client/**/*.js')
        // .pipe(gulpif('**/*.js', jshint()))
        // .pipe(jshint.reporter('default'))
        // .pipe(gulpif(gutil.env.production, jshint.reporter('fail')))
        // .pipe(gulpif('**/*.jsx.js', react()))
        .pipe(gulpif('**/*.js', angularFilesort()))
        .pipe(gulpif('**/*.js', wrap(jsfilewrap))))
    .pipe(gulpif('**/*.tpl.html', ngHtml2Js({
      moduleName: 'njrt.templates'
    })))
    .pipe(gulpif(gutil.env.production, ngAnnotate()))
    .pipe(gulpif(gutil.env.production, uglify()))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('dev', ['copy', 'scripts', 'preprocess', 'scss'], function () {

});

gulp.task('watch', ['dev'], function () {
  tinylr.listen(4002);

  // watch scss and copy to dist/css/styles.css
  watch('src/sass/styles.scss', function () {
    gulp.start('scss');
  });

  // watch js and copy to dist/js/app.js
  watch(mainBowerFiles({
          filter: '**/*.js'
        }, {
          base: 'src/vendor'
        })
    .concat('src/client/**/*.tpl.html')
    .concat('src/client/**/*.js'), function () {
    gulp.start('scripts');
  });

  // watch dist/js/app.js and trigger livereload
  gulp.watch(['./dist/js/app.js', './dist/css/styles.css'], function (e) {
    var fileName = path.relative(__dirname, e.path);
    tinylr.changed({
      body: {
        files: [fileName]
      }
    });
  });

  // start express server and restart if there are
  // changes to src/node
  nodemon({
    script: './index.js',
    ext: 'js html',
    ignore: [
      'dist/**/*',
      'node_modules/**/*',
      'src/client/**/*',
      'src/assets/**/*',
      'src/sass/**/*',
      'src/vendor/**/*',
      'gulpfile.js'
    ]
  });

});

// Update bower, component, npm at once:
gulp.task('bump', function () {
	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump())
		.pipe(gulp.dest('./'));
});
