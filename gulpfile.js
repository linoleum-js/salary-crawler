var gulp = require('gulp');
var concat = require('gulp-concat');

var scripts = [
  './src/main.js',
  './src/core/application.js'
];

var tryFiles = [
  './try/index.html',
  './try/script.js'
];

gulp.task('concat', function () {
  return gulp.src(scripts)
    .pipe(concat('fk.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('copy', function () {
  return gulp.src(tryFiles)
    .pipe(gulp.dest('build/'));
});

gulp.task('default', ['concat']);
gulp.task('try', ['concat', 'copy']);