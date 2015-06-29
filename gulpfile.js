var gulp = require('gulp');
var concat = require('gulp-concat');

var scripts = [
  './src/main.js',
  './src/core/core.js'
];

gulp.task('concat', function () {
  return gulp.src(scripts)
    .pipe(concat('f7k.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('default', ['concat'])