const { src, dest, watch, series } = require('gulp');

const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const spritesmith = require('gulp.spritesmith');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const through2 = require('through2');

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

function runSprite(cb) {
  const option = {
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    cssFormat: 'scss',
    padding: 4,
  };

  var spriteData = src('./src/sprite/*.png')
                  .pipe(spritesmith(option));
  
  var imgStream = spriteData.img
                  .pipe(dest('./src/image/'));
  var cssStream = spriteData.css
                  .pipe(dest('./src/css/'));

  return merge(imgStream, cssStream);         
}

function getFolder(cb) {
  src('./src/**/').pipe(through2.obj(function(chunk, enc, callback) {
    console.log(chunk);
  }));
  
  cb();
}

exports.default = series(runBrowserSync, runSass, runWatch);
// exports.test = runSprite;
exports.test = getFolder;
