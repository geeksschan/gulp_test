const { src, dest, watch, series } = require('gulp');

const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

function runBrowserSync(cb) {
  browserSync.init({
    watch: true,
    server: {
      baseDir: "./src",
      directory: true
    }
  });

  cb();
}

function runWatch(cb) {
  watch('./src/scss/**/*.scss', runSass);
  // watch('./src/*.html').on('change', browserSync.reload);
  cb();
}

function runSass(cb) {
  return src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError()))
        .pipe(dest('./src/css'))
        .pipe(browserSync.stream());
}

exports.browser = series(runBrowserSync, runWatch);