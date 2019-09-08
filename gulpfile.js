const { src, dest, watch, series } = require('gulp');

const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

function runBrowserSync(cb) {
  browserSync.init({
    server: {
      baseDir: "./src",
      directory: true
    },
    open: "external"
  });

  cb();
}

function runWatch(cb) {
  watch('./src/scss/**/*.scss', runSass);
  watch('./src/*.html').on('change', browserSync.reload);
  cb();
}

function runSass(cb) {
  const options = {
    sass: {
      outputStyle: 'expanded',
      indentType: 'tab',
      indentWidth: 1
    }
  };

  return src('./src/scss/**/*.scss', { sourcemaps: true })
        .pipe(sass.sync(options.sass).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(dest('./src/css', { sourcemaps: '.' }))
        .pipe(browserSync.stream());
}

exports.default = series(runBrowserSync, runSass, runWatch);
exports.test = runSass;