var gulp = require('gulp');
var bower = require('gulp-bower');
var browserify  = require('gulp-browserify');
var replace = require('gulp-replace');
var spawn = require('child_process').spawn;
var es = require('event-stream');
var sass = require('gulp-ruby-sass');
var clean = require('gulp-clean');

var handleError = function (err) {
  console.log(err.name, ' in ', err.plugin, ': ', err.message);
  this.emit('end');
};

gulp.task('bump-version', function () {
  spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD']).stdout.on('data', function (data) {

    // Get current branch name
    var branch = data.toString();

    // Verify we're on a release branch
    if (/^release\/.*/.test(branch)) {
      var newVersion = branch.split('/')[1].trim();

      var updateJson = function (file) {
        gulp.src(file)
          .pipe(replace(/("version" *: *")([^"]*)(",)/g, '$1' + newVersion + '$3'))
          .pipe(gulp.dest('./'));
      };

      updateJson('./bower.json');
      updateJson('./package.json');

      console.log('Successfully bumped to ' + newVersion);
    } else {
      console.error('This task should be executed on a release branch!');
    }
  });
});

// Clean
gulp.task('clean', function() {
  return es.concat(
    gulp.src('dist', {
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
      .pipe(gulp.dest('dist/client')),
    // copy template files
    gulp.src(['src/client/partials/**/*.html'])
      .pipe(gulp.dest('dist/client/partials')),
    // copy assets
    gulp.src(['src/assets/**/*'])
      .pipe(gulp.dest('dist/client')),
    // copy server
    gulp.src(['src/server/**/*'])
      .pipe(gulp.dest('dist/server')),
    // copy index.js
    gulp.src(['src/index.js'])
      .pipe(gulp.dest('dist'))
  );
});

// Sass
gulp.task('sass', ['copy'], function() {
  return gulp.src(['src/sass/styles.scss'])
    .pipe(sass({
      style: 'compressed'
    }).on('error', handleError))
    .pipe(gulp.dest('dist/client/css'));
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
    .pipe(gulp.dest('dist/client/js'));
});

// Default
gulp.task('default', ['scripts']);