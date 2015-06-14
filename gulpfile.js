/************************
Gulp - Installation Instructions

To install Gulp globally:
$ npm install gulp -g

To install dependencies automatically (Requires up to data package.json):
$ npm install gulp --save-dev

To install dependencies manually (Ensure this list matches the plugins list below):
$ npm install gulp-compass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-uglify gulp-imagemin gulp-concat gulp-notify gulp-cache gulp-livereload gulp-util tiny-lr gulp-combine-media-queries gulp-requirejs --save-dev
***********************/

var src = "src/",
    dev = "dev/",
    dist = "static/";


// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),

    // css specific
    minifyCSS = require('gulp-minify-css'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    cmq = require('gulp-combine-media-queries');

    // javascript specific

    // jshint = require('gulp-jshint'),
    // uglify = require('gulp-uglify'),
    // imagemin = require('gulp-imagemin'),
    // concat = require('gulp-concat'),
    // gutil = require('gulp-util'),
    // 
    
    // requirejs = require('requirejs'),
    // livereload = require('gulp-livereload'),
    // run = require('gulp-run');


// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'copy-index');
});


gulp.task('watch', function () {
    gulp.watch(src + 'scss/**/*.scss', ['styles']),
    gulp.watch(src + '*', ['copy-index']);
});



gulp.task('styles', function () {
  gulp.src(src + 'scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist + 'css'));
});




// Styles
// gulp.task('styles', function () {

//     return gulp.src(src + 'scss/**/*.scss')

//         .pipe(sass().on('error', sass.logError))

//         .pipe(autoprefixer({
//             browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12', 'ios 6', 'android 4'],
//             cascade: false
//         }))

//         .pipe(cmq({ log: true })) // Combine the media queries

//         //.pipe(minifyCSS({keepBreaks:false}))

//         .pipe(gulp.dest(dist + 'css'));
// });


// Copy file to static 
gulp.task('copy-index', function () {
    return gulp.src(src + 'index.html')
        .pipe(gulp.dest(dist));
});

// Clean - Deletes all the files before recompiling to ensure no unused files remain
gulp.task('clean', function(cb) {
    del(["../static/**"],{force: true}, cb);
});

