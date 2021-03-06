require! <[gulp gulp-concat gulp-filter gulp-flatten gulp-replace nib]>
require! <[bower main-bower-files]>
connect    = require \gulp-connect
webpack    = require \gulp-webpack
gutil      = require \gulp-util
livescript = require \gulp-livescript
stylus     = require \gulp-stylus
jade       = require \gulp-jade

path =
  src:   "#__dirname/src"
  dest:  "#__dirname/dest"
  build: __dirname

gulp.task \bower ->
  bower.commands.install!on \end (results) ->
    for pkg, data of results
      gutil.log do
        gutil.colors.magenta data.pkgMeta.name
        gutil.colors.cyan data.pkgMeta.version
        "installed"

gulp.task \fonts:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.eof **/*.ttf **/*.svg **/*.woff]>
    .pipe gulp-flatten!
    .pipe gulp.dest "#{path.build}/fonts"

gulp.task \images:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.jpg **/*.jpeg **/*.png **/*.gif]>
    .pipe gulp-flatten!
    .pipe gulp.dest "#{path.build}/images"

gulp.task \js:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.js !**/*.min.js]>
    .pipe gulp-concat 'vendor.js'
    .pipe gulp.dest "#{path.build}/js"

gulp.task \js:app ->
  gulp.src ["#{path.src}/**/*.ls", "!#{path.src}/build/**/*"]
    .pipe livescript!
    .pipe gulp.dest "#{path.dest}/"

webpack-options =
  module:
    loaders:
      * test: /\.css$/ loader: \style!css
      ...
  externals:
    'vtt.js': \WebVTT
    zhStrokeData: \zhStrokeData
  resolve:
    alias:
      request: 'browser-request'
react-patch = -> gulp-replace 'node.innerHTML = html;', """
  if (document.contentType === "application/xhtml+xml") {
    var dom = new DOMParser().parseFromString(html, 'text/html');
    html = new XMLSerializer().serializeToString(dom.body).replace(/^<body[^>]*>/, '').replace(/<\\/body>$/, '');
  }
  else if (document.xmlVersion) {
    var dom = document.implementation.createHTMLDocument('');
    dom.body.innerHTML = html;
    html = new XMLSerializer().serializeToString(dom.body).replace(/^<body[^>]*>/, '').replace(/<\\/body>$/, '');
  }
  node.innerHTML = html;
"""
gulp.task \webpack <[js:app]> ->
  gulp.src "#{path.dest}/main.js"
    .pipe webpack do
      {
        context: "#{path.dest}/"
        output:
          filename: 'build.js'
      } <<< webpack-options
    .pipe react-patch!
    .pipe gulp.dest "#{path.build}/js"
    .pipe connect.reload!
  gulp.src "#{path.dest}/epub.js"
    .pipe webpack do
      {
        context: "#{path.dest}/"
        output:
          filename: 'epub.js'
      } <<< webpack-options
    .pipe react-patch!
    .pipe gulp.dest "#{path.build}/js"

gulp.task \css:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.css !**/*.min.css]>
    .pipe gulp-concat 'vendor.css'
    .pipe gulp.dest "#{path.build}/css"

gulp.task \css:app ->
  # for this app
  gulp.src [
    "#{path.src}/**/main.styl"
  ]
    .pipe stylus use: [nib!]
    .pipe gulp.dest "#{path.build}/css"
    .pipe connect.reload!
  # for other apps
  gulp.src [
    "#{path.src}/**/*.styl"
    "!#{path.src}/**/main.styl"
  ]
    .pipe stylus use: [nib!]
    .pipe gulp.dest "#{path.dest}/"

gulp.task \vendor <[fonts:vendor images:vendor js:vendor css:vendor]>

gulp.task \html ->
  gulp.src "#{path.src}/*.jade"
    .pipe jade!
    .pipe gulp.dest path.build
    .pipe connect.reload!

gulp.task \build <[vendor webpack css:app html]>

gulp.task \watch <[build]> ->
  gulp
    ..watch 'bower.json'            <[vendor]>
    ..watch "#{path.src}/**/*.ls"   <[webpack]>
    ..watch "#{path.src}/**/*.styl" <[css:app]>
    ..watch "#{path.src}/*.jade"    <[html]>

gulp.task \server <[watch]> ->
  connect.server do
    root: path.build
    livereload: on

gulp.task \default <[server]>
