var gulp   = require('gulp');
var ghPages = require('gulp-gh-pages');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');



gulp.task('copy-fonts', function() {
  return gulp.src('./node_modules/bootstrap/fonts/*')
  .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('copy-bootstrap', function() {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css'
    )
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('copy', function() {
    return gulp.src([
        'app/css/style.css',
        'app/index.html'
    ])
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
    return gulp.src([
       'node_modules/jquery/dist/jquery.js',
       'node_modules/bootstrap/dist/js/bootstrap.js',
       'node_modules/backbone/node_modules/underscore/underscore.js',
       'node_modules/backbone/backbone.js',
       'node_modules/backbone.localstorage/backbone.localStorage.js',
       'app/js/app.js'
    ])
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('ghp', function() {
    return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('build',['copy-bootstrap', 'copy-fonts', 'copy', 'scripts']);
gulp.task('deploy',['build', 'ghp']);
