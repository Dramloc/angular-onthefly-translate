var gulp = require('gulp');

var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var minify = require('gulp-minify');
var ngAnnotate = require('gulp-ng-annotate');

var configuration = {
    angular: {
        src: './app',
        dist: './public/dist',
        name: 'app'
    }
}

// Concatenate angular files in one file.
gulp.task('angular:concat', function() {
    return gulp.src([configuration.angular.src + '/**/*-module.js', configuration.angular.src + '/**/*.js'])
        .pipe(concat(configuration.angular.name + '.js'))
        .pipe(header('(function() { '))
        .pipe(footer('})();'))
        .pipe(gulp.dest(configuration.angular.dist + '/'))
});

// Inject dependencies in angular.
gulp.task('angular:inject', ['angular:concat'], function() {
    return gulp.src(configuration.angular.dist + '/' + configuration.angular.name + '.js')
        .pipe(ngAnnotate())
        .pipe(gulp.dest(configuration.angular.dist + '/'));
});

// Minify concatenated file.
gulp.task('angular', ['angular:inject'], function() {
    return gulp.src(configuration.angular.dist + '/' + configuration.angular.name + '.js')
        .pipe(minify())
        .pipe(gulp.dest(configuration.angular.dist + '/'))
});

// Watch angular modifications.
gulp.task('angular:watch', function() {
    gulp.watch([configuration.angular.src + '/**/*.js', configuration.angular.src + '/**/*.html'], ['angular']);
});


gulp.task('build', ['angular']);

gulp.task('watch', ['angular:watch']);

gulp.task('default', ['build', 'watch']);