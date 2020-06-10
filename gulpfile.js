const { src, dest, parallel, series } = require('gulp');
const htmlmin = require('gulp-htmlmin');

function html() {
  return src('src/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      useShortDoctype: true,
      removeOptionalTags: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(dest('build/'))
}

function favicon() {
  return src('src/favicon.ico')
    .pipe(dest('build/'))
}

function css() {
  return src('src/css/*.css')
  .pipe(dest('build/css/'))
}

function images() {
  return src('src/images/**/*.webp')
    .pipe(dest('build/images/'))
}

function js() {
  return src('src/js/*.js')
    .pipe(dest('build/js/'))
}

function fonts() {
  return src('src/fonts/*.otf')
    .pipe(dest('build/fonts/'))
}


function cleanBuild() {
  return del("build/");
}

exports.cleanBuild = cleanBuild;
exports.build = parallel(html, favicon, css, images, js, fonts);
