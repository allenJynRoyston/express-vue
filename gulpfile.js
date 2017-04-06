var gulp = require('gulp');
var pug = require('gulp-pug');
var ext_replace = require('gulp-ext-replace');
var removeFiles = require('gulp-remove-files');
var runSequence = require('run-sequence');
var nodemon = require('nodemon');
var watch = require('gulp-watch');
var sequence = require('gulp-watch-sequence');
var inject = require('gulp-inject-string');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat-util');
var pump = require('pump');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

//--------------------------------------
gulp.task('concat:dist', function() {
  gulp.src([
      // node packages
      'node_modules/vue/dist/vue.js',
      'node_modules/jquery/dist/jquery.js',
      'node_modules/three-js/three.js',

      // custom scripts
      'dist/assets/js/custom/*.js',
     ])
    .pipe(concat('all.js'))
    .pipe(concat.header('// file: <%= file.path %>\n'))
    .pipe(concat.footer('\n// end\n'))
    .pipe(gulp.dest('./dist/assets/js/unminified'));
});
//--------------------------------------

//--------------------------------------
gulp.task('compress:js', function (cb) {
  pump([
        gulp.src('dist/assets/js/unminified/*.js'),
        uglify(),
        gulp.dest('dist/assets/js/minified')
    ],
    cb
  );
});
//--------------------------------------

//--------------------------------------
gulp.task('concat:css', function () {
  return gulp.src([
      'dist/assets/css/custom/*.css',
    ])
    .pipe(concatCss("all.css"))
    .pipe(gulp.dest('dist/assets/css/unminified/'));
});
//--------------------------------------

//--------------------------------------
gulp.task('compress:css', function() {
  return gulp.src('dist/assets/css/unminified/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/assets/css/minified'));
});
//--------------------------------------

//--------------------------------------
gulp.task('html:components', function(){
  return gulp.src(['pug/components/*.pug'])
    .pipe(pug())
    .pipe(gulp.dest('dist/components'))
    .pipe(ext_replace('.vue'))
    .pipe(gulp.dest('./dist/components/'))
});
//--------------------------------------

//--------------------------------------
gulp.task('html:pages', function(){
  return gulp.src(['pug/pages/*.pug'])
    .pipe(pug())
    .pipe(gulp.dest('dist/components'))
    .pipe(ext_replace('.vue'))
    .pipe(gulp.dest('./dist/components/'))
});
//--------------------------------------

//--------------------------------------
gulp.task('html:views', function(){
  return gulp.src(['pug/views/*.pug'])
    .pipe(pug())
    .pipe(gulp.dest('dist/views'))
    .pipe(ext_replace('.vue'))
    .pipe(gulp.dest('./dist/views/'))
});
//--------------------------------------

//--------------------------------------
gulp.task('clearHtml', function () {
  gulp.src('./dist/**/*.html')
    .pipe(removeFiles());
});
//--------------------------------------

//--------------------------------------
gulp.task('trigger-sync', function(){
    gulp.src('./bsync.js')
        .pipe(inject.append('//reload'))
        .pipe(gulp.dest('./'));
});
//--------------------------------------

//--------------------------------------
gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
});
//--------------------------------------

//--------------------------------------
gulp.task('browser-sync', ['nodemon'], function() {

  // AFTER STARTER HAS BEEN STARTED, START BROWSERSYNC
  browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["app.js", "bsync.js"],
        port: 3030,
        reloadDelay: 1500,
	})

  // IF ANY OF THESE FILES HAVE BEEN CHANGED, COMPILE THEN START TRIGGER-SYNC, WHICH KICKS OFF BROWSERSYNC
  var queue = sequence(1);  // SMALL DELAY SO CLEARHTML DOESN'T BREAK

  watch('assets/css/*', {
    emitOnGlob: false
  }, queue.getHandler('concat:css', 'compress:css', 'trigger-sync'));

  watch('pug/components/*', {
    emitOnGlob: false
  }, queue.getHandler('html:components', 'trigger-sync', 'clearHtml'));

  watch('pug/pages/*', {
    emitOnGlob: false
  }, queue.getHandler('html:pages', 'trigger-sync', 'clearHtml'));

  watch('pug/views/*', {
    emitOnGlob: false
  }, queue.getHandler('html:views', 'trigger-sync', 'clearHtml'));


});
//--------------------------------------

//--------------------------------------
gulp.task('build', [
    'concat:css', 'compress:css',
    'concat:dist', 'compress:js',
    'html:components', 'html:views'], function(){
      setTimeout(function(){
        runSequence('clearHtml');
      }, 500)
});
//--------------------------------------

//--------------------------------------
gulp.task('default', ['browser-sync'], function () {});
//--------------------------------------
