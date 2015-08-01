var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('connect', function() {
  connect.server({
    port: 8080
  });
});

gulp.task('js', function() {
  browserify(['./src/app.js'])
    .transform(reactify)
    .bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.end();
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['js']);
});

gulp.task('default', ['js', 'connect', 'watch']);
