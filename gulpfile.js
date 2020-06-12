const { src, dest, parallel } = require('gulp');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');

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
    .pipe(dest('build/'));
}

function favicon() {
  return src('src/favicon.ico')
    .pipe(dest('build/'));
}

function css() {
  return src('src/css/*.css')
    .pipe(postcss([cssnano()]))
    .pipe(rename(function (path) {
      path.extname = ".min.css";
    }))
    .pipe(dest('build/css/'));
}

function images() {
  return src('src/images/**/*.webp')
    .pipe(dest('build/images/'));
}

function js() {
  return src('src/js/*.js')
    .pipe(terser())
    .pipe(rename(function (path) {
      path.extname = ".min.js";
    }))
    .pipe(dest('build/js/'));
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
