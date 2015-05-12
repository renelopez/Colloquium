'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var htmlReplace = require('gulp-html-replace');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var es = require('event-stream');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');


gulp.task('build', ['htmlreplace', 'bundle:cssVendor', 'bundle:cssProp', 'bundle:scriptsVendor', 'bundle:scriptsProp','images','imagesMaterial','fonts']);





gulp.task('bundle:cssVendor', function() {
    return gulp.src([
            'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
            'app/bower_components/animate.css/animate.min.css',
            'app/bower_components/toastr/toastr.min.css',
            'app/bower_components/breeze-client-labs/breeze.directives.css',
            'app/bower_components/kendo-ui-core/styles/kendo.common.min.css',
            'app/bower_components/kendo-ui-core/styles/kendo.material.min.css'
    ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('bundle:cssProp', function () {
    return gulp.src('app/styles/app.css')
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('clean:dist', function(cb) {
    del(['dist'],cb);
});




gulp.task('bundle:scriptsVendor', function () {
    return gulp.src([
            'app/bower_components/jquery/dist/jquery.min.js',
'app/bower_components/toastr/toastr.min.js',
'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
'app/bower_components/lodash/lodash.min.js',
'app/bower_components/respond/dest/respond.min.js',
'app/bower_components/angular/angular.min.js',
'app/bower_components/angular-animate/angular-animate.min.js',
'app/bower_components/kendo-ui-core/js/kendo.ui.core.min.js',
'app/bower_components/kendo-ui-core/js/kendo.angular.min.js',
'app/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
'app/bower_components/breeze-client/build/breeze.min.js',
'app/bower_components/breeze-client/build/breeze.debug.js',
'app/bower_components/breeze-client/build/adapters/breeze.bridge.angular.js',
'app/bower_components/breeze-client-labs/breeze.directives.js',
'app/bower_components/breeze-client-labs/breeze.saveErrorExtensions.js',
'app/bower_components/moment/min/moment.min.js',
'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
'app/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
'app/bower_components/spin.js/spin.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/scripts'));
});






gulp.task('bundle:scriptsProp', function() {
    return es.merge(
            gulp.src('app/scripts/**/*.html')
            .pipe(templateCache({
                module: 'app',
                root: 'scripts'
            })),
            gulp.src('app/scripts/app.js'),
            gulp.src('app/scripts/**/*.js')
        )
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
});


gulp.task('images', function() {
    return gulp.src(['app/styles/images/**/*',
        'app/bower_components/kendo-ui-core/styles/images/**/*'])
        .pipe(gulp.dest('dist/styles/images'));
});



gulp.task('imagesMaterial', function() {
    return gulp.src('app/bower_components/kendo-ui-core/styles/Material/**/*')
        .pipe(gulp.dest('dist/styles/Material'));
});

gulp.task('fonts', function () {
    return gulp.src('app/bower_components/bootstrap/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});


gulp.task('htmlreplace', function() {
    return gulp.src('app/index.html')
        .pipe(htmlReplace({
            'stylesVendor': 'styles/vendor.css',
            'stylesProp': 'styles/app.css',
            'scriptsVendor': 'scripts/vendor.js',
            'scriptsProp':'scripts/app.js'
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('reload', function() {
    browserSync.reload();
});


gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: './app'
        }
    });
});

gulp.task('serve:dist', function () {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('watch',function() {
    gulp.watch('./app/**/*.js', ['reload']);
    gulp.watch('./app/**/*.css', ['reload']);
    gulp.watch('./app/**/*.html', ['reload']);
})