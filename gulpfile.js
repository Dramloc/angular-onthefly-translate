const gulp = require('gulp');
const concat = require('gulp-concat');
const header = require('gulp-header');
const footer = require('gulp-footer');
const minify = require('gulp-minify');
const ngAnnotate = require('gulp-ng-annotate');

const configuration = {
  angular: {
    src: './app',
    dist: './public/dist',
    name: 'app',
  },
};

// Concatenate angular files in one file.
gulp.task('angular:concat', () =>
  gulp.src([`${configuration.angular.src}/**/*.module.js`, `${configuration.angular.src}/**/*.js`])
    .pipe(concat(`${configuration.angular.name}.js`))
    .pipe(header('(function() { '))
    .pipe(footer('})();'))
    .pipe(gulp.dest(configuration.angular.dist))
);

// Inject dependencies in angular.
gulp.task('angular:inject', ['angular:concat'], () =>
  gulp.src(`${configuration.angular.dist}/${configuration.angular.name}.js`)
    .pipe(ngAnnotate())
    .pipe(gulp.dest(configuration.angular.dist))
);

// Minify concatenated file.
gulp.task('angular', ['angular:inject'], () =>
  gulp.src(`${configuration.angular.dist}/${configuration.angular.name}.js`)
    .pipe(minify())
    .pipe(gulp.dest(configuration.angular.dist))
);

// Watch angular modifications.
gulp.task('angular:watch', () =>
  gulp.watch([`${configuration.angular.src}/**/*.js`, `${configuration.angular.src}/**/*.html`], ['angular'])
);


gulp.task('build', ['angular']);

gulp.task('watch', ['angular:watch']);

gulp.task('default', ['build', 'watch']);
