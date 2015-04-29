var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task("all", function () {
    gulp.src('dist/*').pipe(clean());
    gulp.src(['app/*.js','Scripts/kendo/2015.1.318/*.js'])
    .pipe(concat("combined.js"))
    .pipe(jshint())
    .pipe(uglify())
    .pipe(rename({
        extname:'.min.js'
    }))
    .pipe(gulp.dest('dist'))
});