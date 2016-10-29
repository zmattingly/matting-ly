// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var angularFilesort = require('gulp-angular-filesort');

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(rename('all.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('assets/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['!src/js/**/*.spec.js', 'src/js/**/*.js'])
        .pipe(angularFilesort())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(gulp.dest('assets/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'watch']);
