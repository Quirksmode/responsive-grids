/************************
Gulp - Installation Instructions

Install Gulp globally:
$ npm install gulp -g

Install NPM Packages
$ npm install
************************/

var src = "src/",
    dest = "dest/";

// Load plugins
var gulp            = require('gulp');
var sass            = require('gulp-sass');
var watch           = require('gulp-watch');
var browserSync     = require('browser-sync');
var autoprefixer    = require('gulp-autoprefixer');
var cmq             = require('gulp-combine-media-queries');
var gnotify         = require('gulp-notify');
var uglify          = require('gulp-uglify');

gulp.task('styles', function () {
  gulp.src(src + 'scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'nested'
    }))
    .on('error', function() {
        gnotify.onError().apply(this, arguments);
        this.emit('end');
    })
    .pipe(autoprefixer("last 2 versions", "ie 8"))
    .pipe(cmq({ log: true }))
    .pipe(gulp.dest(dest + 'css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function() {
  return gulp.src(src + 'js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(dest + 'js'))
    .pipe(browserSync.reload({stream:true}));
});

// Define the watch task
gulp.task('watch', ['browserSync'], function() {
  gulp.watch(src + 'scss/**/*.scss',  ['styles']);
  gulp.watch(src + 'js/**/*.scss',  ['scripts']);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
            baseDir: './'
        }
    });
});

// Default task
gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'watch');
});