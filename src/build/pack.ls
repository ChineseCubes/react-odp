#!/usr/bin/env lsc
require! {
  child_process: { exec }
  fs
  path
  xmlbuilder: { create }
  'vinyl-fs': vinyl
  'map-stream': map
  colors
  cp: _cp
  cpr: _cpr
  jade
  htmltidy: { tidy }
  '../CUBE/data': Data
  './epub/utils': utils
  './epub': { pack }
}

rel = -> path.relative process.cwd!, it

##
# arguments
{ filename, argv } = utils.argv!

if argv.length is 0
  console.log "Usage: #filename [path]"
  process.exit 0

:main let
  return unless arg = argv.shift!
  basename = path.basename arg

  ##
  # prepare the build dir
  build =
    path: path.resolve ".#basename.build"
    # XXX: will create `strokes` later
    needs: <[js css fonts strokes]>

  fs.mkdirSync build.path unless fs.existsSync build.path
  console.log "#{'mkdir'magenta} #{rel build.path}"

  ##
  # copy the book
  src = path.resolve basename
  dst = path.resolve build.path, \data
  err, files <- cp-r src, dst
  throw err if err and err.0.code isnt \ENOENT

  ##
  # get data from moedict.tw
  # XXX: should create dict.json before packing
  src = path.resolve build.path, 'data'
  err <- fetch-moedict src
  throw err if err

  ##
  # generate page*.xhtml
  { attrs } <- Data.getMasterPage dst
  num-pages = attrs['TOTAL-PAGES']

  todo = [1 to num-pages]
  :render let
    return copy-statics! unless idx = todo.shift!
    err <- gen-page dst, build.path, idx
    throw err if err
    render!

  ##
  # copy other dependancies
  copy-statics = ->
    # META-INF/
    src = path.resolve __dirname, 'epub/META-INF'
    dst = path.resolve build.path, 'META-INF'
    err, files <- cp-r src, dst
    throw err if err
    # mimetype and more
    files = <[mimetype]>
    :copy let
      return copy-more! unless file = files.shift!
      src = path.resolve __dirname, 'epub', file
      dst = path.resolve build.path, file
      err <- cp src, dst
      throw err if err
      copy!

  copy-more = ->
    # css, js, fonts ...
    counter = 0
    for let dep in build.needs
      src = path.resolve __dirname, '../../', dep
      dst = path.resolve build.path, dep
      console.warn "need #{rel src}" unless fs.existsSync src
      err, files <- cp-r src, dst
      throw err if err
      next! if ++counter is build.needs.length

  next = ->
  ##
  # generate TOC.xhtml
    src = path.resolve __dirname, 'epub/TOC.jade'
    dst = path.resolve build.path, 'TOC.xhtml'
    files = for idx from 1 to num-pages
      path: "page#idx.xhtml"
      title: if idx is 1 then 'Cover' else "Page #idx"
    result = jade.renderFile src, { files }
    err, html <- tidy result, indent: on
    throw err if err
    err <- write dst, html
    throw err if err

  ##
  # generate font subset
    src = path.resolve __dirname, 'epub', 'SourceHanSansTW-Regular.ttf'
    dst = path.resolve build.path, 'fonts', 'Noto-subset.ttf'
    err <- font-subset src, dst
    throw err if err

  ##
  # generate metadata for EPUB
    files = []
    vinyl
      .src [
        "#{build.path}/**"
        "!#{build.path}/META-INF/*"
        "!#{build.path}/mimetype"
        "!#{build.path}/package.opf"
      ]
      .pipe map (file, cb) ->
        files.push path.relative(build.path, file.path)
        cb null, file
      .on \end ->
        ocf = pack do
          files
          spine: for idx from 1 to num-pages => "page#idx.xhtml"
          metadata:
            title: basename
            creator: 'caasi Huang'
            language: 'zh-Hant'
            identifier: basename
            date: '2014-07-12'
            publisher: 'Locus Publishing Company'
            contributors:
              * 'Audrey Tang'
              * 'Alice Huang'
              * 'caasi Huang'
            rights: 'Locus Publishing Company all righths reserved.'
        dst = path.resolve build.path, \package.opf
        err <- write dst, ocf
        throw err if err
        src = path.resolve build.path
        dst = path.resolve build.path, "../#{basename}.epub"
        err <- zip src, dst
        throw err if err
        main!

##
# helpers
function cp src, dst, done
  _cp src, dst, ->
    console.log "#{'cp'magenta} #{rel src} #{rel dst}"
    done ...

function cp-r src, dst, done
  _cpr src, dst, { delete-first: on, overwrite: on, confirm: on }, ->
    console.log "#{'cp'magenta} -R #{rel src} #{rel dst}"
    done ...

gen = path.resolve __dirname, './gen.ls'
function gen-page src, dst, idx, done
  exec do
    "#gen #{path.relative dst, src} #idx > #dst/page#idx.xhtml"
    cwd: dst
    (err, stdout, stderr) ->
      console.log "#{(rel gen)magenta} #{rel src} #idx > #{rel dst}/page#idx.xhtml"
      process.stdout.write stdout
      done ...

function write dst, file, done
  fs.writeFile dst, file, ->
    console.log "#{'write'magenta} #{rel dst}"
    done ...

function fetch-moedict src, done
  exec do
    "#{path.resolve __dirname, 'fetch-moedict.ls'} #src"
    (err, stdout, stderr) ->
      console.log "fetch characters from moedict.tw"magenta
      process.stdout.write stdout
      done ...

function font-subset src, dst, done
  exec do
    "/usr/bin/env bash perl -Mutf8 -CSD -nE 's/[\\x00-\\xff]//g; $_{$_}++ for split //; END { say for qw[Open(\"#src\") Select(0u3000)]; printf qq[SelectMore(0u%04x) #%s\\n], $_, chr $_ for grep { $_ > 10000 } map ord, sort keys %_; say for qw[SelectInvert() Clear() Generate(\"#dst\")]} ' */dict.json *xhtml | fontforge -script"
    cwd: path.dirname dst
    (err, stdout, stderr) ->
      console.log "#{'generate'magenta} #{rel dst}"
      process.stdout.write stdout
      done ...

function zip src, dst, done
  exec do
    "zip -rX #dst ./*"
    cwd: src
    (err, stdout, stderr) ->
      console.log "#{'zip'magenta} #{rel dst}"
      process.stdout.write stdout
      done ...

