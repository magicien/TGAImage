var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var config = require('../config');
var exec = require('child_process').exec;

gulp.task('webpack', ['webpack:build-web', 'webpack:build-web-min', 'webpack:build-node'])
gulp.task('webpack:web', ['webpack:build-web'])
gulp.task('webpack:web-min', ['webpack:build-web-min'])
gulp.task('webpcak:node', ['webpack:build-node'])

gulp.task('webpack:build-web', function(cb) {
  var conf = config.webpack.web
  gulp.src(conf.entry)
      .pipe(webpack(conf))
      .pipe(gulpif(config.js.uglify, uglify()))
      .pipe(gulp.dest(conf.output.path));
})

gulp.task('webpack:build-web-min', function(cb) {
  var conf = config.webpack.webmin
  gulp.src(conf.entry)
      .pipe(webpack(conf))
      .pipe(gulpif(config.js.uglify, uglify()))
      .pipe(gulp.dest(conf.output.path));
})


gulp.task('webpack:build-node', function(cb) {
  var conf = config.webpack.node
  gulp.src(conf.entry)
      .pipe(webpack(conf))
      .pipe(gulpif(config.js.uglify, uglify()))
      .pipe(gulp.dest(conf.output.path));
})

