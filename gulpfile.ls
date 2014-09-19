require! <[gulp gulp-concat gulp-filter gulp-flatten gulp-replace]>
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
    .pipe gulp-replace 'node.innerHTML = html;', """
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
    .pipe gulp.dest "#{path.build}/js"

gulp.task \js:app ->
  gulp.src ["#{path.src}/ls/**/*.ls", "!#{path.src}/ls/build/*.ls"]
    .pipe livescript!
    .pipe gulp.dest "#{path.dest}/"

gulp.task \webpack <[js:app]> ->
  gulp.src "#{path.dest}/main.js"
    .pipe webpack do
      context: "#{path.dest}/"
      output:
        filename: 'build.js'
      module:
        loaders:
          * test: /\.css$/ loader: \style!css
          ...
      externals:
        'vtt.js': \WebVTT
    .pipe gulp.dest "#{path.build}/js"
    .pipe connect.reload!

gulp.task \css:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.css !**/*.min.css]>
    .pipe gulp-concat 'vendor.css'
    .pipe gulp.dest "#{path.build}/css"

gulp.task \css:app ->
  gulp.src [
    "#{path.src}/stylus/reset.styl"
  ]
    .pipe gulp-concat 'reset.styl'
    .pipe stylus use: <[nib]>
    .pipe gulp.dest "#{path.build}/css"
    .pipe connect.reload!
  gulp.src [
    "#{path.src}/stylus/react-odp.styl"
    "#{path.src}/stylus/semantic-custom.styl"
    "#{path.src}/stylus/cubes-v5.styl"
    "#{path.src}/stylus/main.styl"
  ]
    .pipe gulp-concat 'style.styl'
    .pipe stylus use: <[nib]>
    .pipe gulp.dest "#{path.build}/css"
    .pipe connect.reload!

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
