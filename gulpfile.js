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
gulp.task('buildVue', ['html:components', 'html:views'], function(){
  runSequence('clearHtml');
});
//--------------------------------------


//--------------------------------------
gulp.task('default', ['browser-sync'], function () {});
//--------------------------------------
