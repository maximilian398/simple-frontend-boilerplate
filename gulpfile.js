// Gulp Modules
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass');
const cssnano = require('cssnano');
const gutil = require('gulp-util');
const del = require('del');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat-util');
const minify = require('gulp-clean-css');
const fileinclude = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const notify = require('gulp-notify');
const version = require('gulp-version-number');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const path = require('path');

// Paths
var Paths = {
  DIST: '_dist',
  PUG: '_src/*.pug',
  HB: '_src/*.hbs',
  JS: '_src/assets/js/vendor/',
  B_JS: '_src/assets/js/bootstrap/',
  F_JS: '_src/assets/js/fontawesome/',
  CSS: '_src/assets/css/',
  PHP: '_src/assets/php/',
  IMG: '_src/assets/images/',
  FONTS: '_src/assets/fonts/**/*.*',
  VIDEO: '_src/assets/video/**/*.*'
};

gulp.task('webpack', () => {
  return gulp.src(path.resolve(__dirname, './_src/assets/es6/app.js'))
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(gulp.dest('_dist/assets/js/'))
  .pipe(gulp.dest('assets/js/'));
  });

gulp.task('html', function () {
  return gulp.src(['_src/*.html'])
    .pipe(fileinclude())
    .pipe(version({
      value: '%MDS%',
      append: {
        key: 'v',
        to: ['css', 'js']
      }
    }))
    .pipe(gulp.dest(Paths.DIST));
});

// PHP
gulp.task('php', function () {
  return gulp.src(Paths.PHP + '*.php')
    .pipe(gulp.dest(Paths.DIST + '/assets/php/'))
    .pipe(gulp.dest('assets/php/'));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
  return gulp.src([
    '_src/*',
    '!_src/*.html',
    '!_src/*.pug',
    '!_src/*.hbs'
  ], {
    dot: true
  }).pipe(gulp.dest('_dist'))
});

gulp.task('images', async () => {
  await new Promise((resolve, reject) => {
    gulp.src(Paths.IMG + '**/*.*')
      .pipe(imagemin([
        imagemin.gifsicle({
          interlaced: true
        }),
        imageminMozjpeg({
          progressive: true,
          quality: 80
        }),
        pngquant({
          quality: [0.6, 0.8]
        }),
        imagemin.svgo({
          plugins: [{
              removeViewBox: true
            },
            {
              cleanupIDs: false
            }
          ]
        })
      ]))
      .pipe(gulp.dest(Paths.DIST + '/assets/images/'))
      .pipe(gulp.dest('assets/images/'))
      .on('end', resolve);
  });
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src(Paths.FONTS)
    .pipe(gulp.dest(Paths.DIST + '/assets/fonts/'))
    .pipe(gulp.dest('assets/fonts/'))
});

// Video
gulp.task('video', function () {
  return gulp.src(Paths.VIDEO)
    .pipe(gulp.dest(Paths.DIST + '/assets/video/'))
    .pipe(gulp.dest('assets/video/'))
});

gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});

// CSS - Fertige Plugins oder so, die einfach zusammengefügt werden
gulp.task('css', function () {
  return gulp.src(Paths.CSS + '*.css')
    .pipe(gulp.dest(Paths.DIST + '/assets/css/'))
    .pipe(gulp.dest('assets/css/'))
    .pipe(concat('plugins.css'))
    .pipe(minify({
      keepBreaks: false
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(Paths.DIST + '/assets/css/'))
    .pipe(gulp.dest('assets/css/'))
});

gulp.task('sass', async () => {

  await new Promise((resolve, reject) => {
    gulp.src('_src/assets/scss/styles.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        noCache: true
      }).on('error', sass.logError))
      .pipe(postcss([autoprefixer({
        map: false,
        cascade: true
      }), cssnano()]))
      .pipe(sourcemaps.write(''))
      .pipe(gulp.dest(Paths.DIST + '/assets/css/'))
      .pipe(gulp.dest('assets/css/'))
      .pipe(minify({
        keepBreaks: false
      }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(Paths.DIST + '/assets/css/'))
      .pipe(gulp.dest('assets/css/'))
      .on('error', notify.onError())
      .on('end', resolve);
  });
});

// JQ
gulp.task('js-jquery', function () {
  return gulp.src([
      Paths.JS + 'jquery-3.2.1.min.js',
      Paths.JS + 'popper.min.js',
    ])
    .pipe(gulp.dest(Paths.DIST + '/assets/js/vendor/'))
    .pipe(gulp.dest('assets/js/vendor/'));
});

// JS
gulp.task('js-plugins', async () => {
  await new Promise((resolve, reject) => {

    gulp.src([
        Paths.JS + 'appear.js',
        Paths.JS + 'gmap3.js',
        Paths.JS + 'imagesloaded.pkgd.js',
        Paths.JS + 'isotope.pkgd.js',
        Paths.JS + 'jqBootstrapValidation.js',
        Paths.JS + 'jquery.superslides.js',
        Paths.JS + 'jquery.background-video.js',
        Paths.JS + 'jquery.magnific-popup.js',
        Paths.JS + 'scrollreveal.min.js',
        Paths.JS + 'owl.carousel.js',
        Paths.JS + 'twitterFetcher.js',
        Paths.JS + 'jquery.countTo.js',
        Paths.JS + 'jquery.sticky-kit.js',
        Paths.JS + 'morphext.js',
        Paths.JS + 'jarallax.js',
        Paths.JS + 'jarallax-video.js',
        Paths.JS + 'cookieconsent.min.js',
        Paths.JS + 'prism.js',
      ])
      .pipe(gulp.dest(Paths.DIST + '/assets/js/vendor/'))
      .pipe(gulp.dest('assets/js/vendor/'))
      .pipe(concat('plugins.js'))
      .pipe(gulp.dest(Paths.DIST + '/assets/js/vendor/'))
      .pipe(gulp.dest('assets/js/vendor/'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(uglify()).on('error', notify.onError())
      .pipe(gulp.dest(Paths.DIST + '/assets/js/vendor/'))
      .pipe(gulp.dest('assets/js/vendor/'))
      .on('end', resolve);
  });
});

// Bootstrap JS
gulp.task('js-bootstrap', async () => {
  await new Promise((resolve, reject) => {
    gulp.src('node_modules/bootstrap/dist/js/*.js')
      .pipe(gulp.dest(Paths.DIST + '/assets/js/bootstrap/'))
      .pipe(gulp.dest('assets/js/bootstrap/'))
      .on('error', notify.onError())
      .on('end', resolve);
  });
});
// Fontawesome JS
gulp.task('js-fontawesome', async () => {
  await new Promise((resolve, reject) => {
    gulp.src('node_modules/@fortawesome/fontawesome-pro/js/*.js')
      .pipe(gulp.dest(Paths.DIST + '/assets/js/fontawesome/'))
      .pipe(gulp.dest('assets/js/fontawesome/'))
      .on('error', notify.onError())
      .on('end', resolve);
  });
});
// Fontawesome SVGs
gulp.task('svg-fontawesome', async () => {
  await new Promise((resolve, reject) => {
    gulp.src('node_modules/@fortawesome/fontawesome-pro/svgs/**/*')
      .pipe(gulp.dest(Paths.DIST + '/assets/images/icons/fontawesome/'))
      .pipe(gulp.dest('assets/images/icons/fontawesome/'))
      .on('error', notify.onError())
      .on('end', resolve);
  });
});
// JS Core
gulp.task('js-core', async () => {
  await new Promise((resolve, reject) => {

    gulp.src('_src/assets/js/script.js')
      .pipe(gulp.dest(Paths.DIST + '/assets/js/'))
      .pipe(gulp.dest('assets/js/'))
      .on('error', notify.onError())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(uglify())
      .pipe(gulp.dest(Paths.DIST + '/assets/js/'))
      .pipe(gulp.dest('assets/js/'))
      .on('end', resolve);
  });
});

gulp.task('modernizr',  async () => {
  if (!fs.existsSync(`${dirs.dist}/js/vendor/`)){
    fs.mkdirSync(`${dirs.dist}/js/vendor/`);
  }

  modernizr.build(modernizrConfig, (code) => {
    fs.writeFile(`${dirs.dist}/js/vendor/modernizr-${pkg.devDependencies.modernizr}.min.js`, code, done);
  });
});

// Build task
gulp.task('build', gulp.series(
  'copy',
  'html',
  'css',
  'sass',
  'js-jquery',
  'js-core',
  'js-plugins',
  'js-bootstrap',
  'js-fontawesome',
  'webpack',
  'images',
  'modernizr',
  'fonts',
  'video',
  'php'
));

// Clean dist folder
gulp.task('clean', function () {
  return del([Paths.DIST + '/*']);
});


// Watch
gulp.task('watch', function () {
  browserSync(["_dist/assets/css/*.css", "_dist/assets/css/*.map", "_dist/assets/js/*.js"], {
    server: {
      baseDir: './_dist'
    }
  });
  gulp.watch('_src/assets/scss/**/*.scss', gulp.series('sass'));
  gulp.watch("_src/**/*.html", gulp.series('html', 'reload'));

  gulp.watch(Paths.JS + '*.js', gulp.series('js-jquery', 'reload'));
  gulp.watch('_src/assets/js/script.js', gulp.series('js-core', 'reload'));
  gulp.watch(Paths.JS + '*.js', gulp.series('js-plugins', 'webpack', 'reload'));
  gulp.watch('_src/assets/es6/**/*.js', gulp.series('webpack'));
  gulp.watch(Paths.CSS + '*.css', gulp.series('css', 'reload'));
  gulp.watch(Paths.PHP + '*.php', gulp.series('php', 'reload'));
  gulp.watch(Paths.IMG + '**/*.*', gulp.series('images', 'reload'));
  gulp.watch(Paths.B_JS + '*.js', gulp.series('js-bootstrap', 'reload'));
  gulp.watch(Paths.F_JS + '*.js', gulp.series('js-fontawesome', 'reload'));
  //gulp.watch(Paths.F_JS + '*.js', gulp.series('svg-fontawesome', 'reload'));
  gulp.watch(Paths.FONTS, gulp.series('fonts', 'reload'));
});

gulp.task('default', gulp.series('clean', 'build', 'watch'));
