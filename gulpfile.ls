require! <[gulp gulp-concat gulp-filter gulp-flatten gulp-replace nib]>
connect    = require \gulp-connect
webpack    = require \gulp-webpack
gutil      = require \gulp-util
livescript = require \gulp-livescript
stylus     = require \gulp-stylus
jade       = require \gulp-jade
config     = require './configs/webpack.config'
dev-config = require './configs/dev.webpack.config'

path =
  src:   "#__dirname/src"
  dest:  "#__dirname/dest"
  build: __dirname

gulp.task \js:app ->
  gulp.src ["#{path.src}/**/*.ls", "!#{path.src}/build/**/*"]
    .pipe livescript!
    .pipe gulp.dest "#{path.dest}/"

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
      config <<< context: "#{path.dest}/"
    .pipe react-patch!
    .pipe gulp.dest "#{path.build}/js"
    .pipe connect.reload!

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

gulp.task \html ->
  gulp.src "#{path.src}/*.jade"
    .pipe jade!
    .pipe gulp.dest path.build
    .pipe connect.reload!

gulp.task \build <[webpack css:app html]>

gulp.task \watch <[build]> ->
  gulp
    ..watch "#{path.src}/**/*.ls"   <[webpack]>
    ..watch "#{path.src}/**/*.styl" <[css:app]>
    ..watch "#{path.src}/*.jade"    <[html]>

gulp.task \server <[watch]> ->
  connect.server do
    root: path.build
    livereload: on

gulp.task \default <[server]>
