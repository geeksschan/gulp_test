const BrowserSync = require('browser-sync').create();

function browserSync(cb) {
  BrowserSync.init({
    server: {
      baseDir: "./src"
    }
  });

  cb();
}

exports.browser = browserSync;