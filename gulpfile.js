var gulp = require('gulp');
var bump = require('gulp-bump');
var bower = require('gulp-bower');
var zip = require('gulp-zip');
var browserify  = require('gulp-browserify');
var replace = require('gulp-replace');
var spawn = require('child_process').spawn;
var es = require('event-stream');
var sass = require('gulp-ruby-sass');
var clean = require('gulp-clean');

// General error handling function
var handleError = function (err) {
  console.log(err.name, ' in ', err.plugin, ': ', err.message);
  this.emit('end');
};

// Clean
gulp.task('clean', function() {
  return es.concat(
    gulp.src('app', {
      read: false
    })
      .pipe(clean()),
    gulp.src('src/vendor/**/*', {
      read: false
    })
      .pipe(clean())
  );
});

// Bower
gulp.task('bower', ['clean'], function() {
  return bower();
});

// Copy
gulp.task('copy', ['bower'], function () {
  return es.concat(
    // update index.html to work when built
    gulp.src(['src/client/index.html'])
      .pipe(gulp.dest('app/client')),
    // copy template files
    gulp.src(['src/client/partials/**/*.html'])
      .pipe(gulp.dest('app/client/partials')),
    // copy assets
    gulp.src(['src/assets/**/*'])
      .pipe(gulp.dest('app/client')),
    // copy server
    gulp.src(['src/server/**/*'])
      .pipe(gulp.dest('app/server'))
  );
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
gulp.task('scripts', ['sass'], function() {
  return gulp.src('src/client/app.js')
    .pipe(browserify({
      transform: ['debowerify'],
      insertGlobals: true,
      debug: true,
      shim: {
        underscore: {
          path: "src/vendor/underscore/underscore.js",
          exports: "_"
        },
        jquery: {
          path: "src/vendor/jquery/dist/jquery.js",
          exports: "$"
        },
        angular: {
          path: "src/vendor/angular/angular.js",
          exports: "angular",
          depends: {
            jquery: "$"
          }

        }
      }
    }))
    .pipe(gulp.dest('app/client/js'));
});

// Update bower, component, npm at once:
gulp.task('bump', function() {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

// Default
gulp.task('default', ['scripts']);