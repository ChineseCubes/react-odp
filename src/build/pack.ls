#!/usr/bin/env lsc
require! {
  child_process: { exec }
  fs
  path
  xmlbuilder: { create }
  'vinyl-fs': vinyl
  'map-stream': map
  cp: _cp
  cpr
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

if argv.length isnt 1
  console.log "Usage: #filename [path]"
  process.exit 0

##
# prepare the build dir
basename = path.basename argv.0

build =
  path: path.resolve ".#basename.build"
  # XXX: will create `strokes` later
  needs: <[js css fonts strokes]>

cp = (src, dest, done) ->
  _cp src, dest, ->
    console.log "cp #{rel src} #{rel dest}"
    done ...

cp-r = (src, dest, done) ->
  cpr src, dest, { delete-first: on, overwrite: on, confirm: on }, ->
    console.log "cp -R #{rel src} #{rel dest}"
    done ...

gen-page = let gen = path.resolve __dirname, './gen.ls'
  (src, dest, idx, done) ->
    exec "#gen #dest #idx > #src/page#idx.xhtml", ->
      console.log "#{rel gen} #{rel dest} #idx > #{rel src}/page#idx.xhtml"
      done ...

write = (dest, file, done) ->
  fs.writeFile dest, file, ->
    console.log "write #{rel dest}"
    done ...

font-subset = (src, dest, done) ->
  exec do
    "/usr/bin/env bash perl -Mutf8 -CSD -nE 's/[\\x00-\\xff]//g; $_{$_}++ for split //; END { say for qw[Open(\"#src\") Select(0u3000)]; printf qq[SelectMore(0u%04x) #%s\\n], $_, chr $_ for grep { $_ > 10000 } map ord, sort keys %_; say for qw[SelectInvert() Clear() Generate(\"#dest\")]} ' */dict.json *xhtml | fontforge -script"
    cwd: path.dirname dest
    ->
      console.log "write #{rel dest}"
      done ...

zip = (src, dest, done) ->
  exec do
    "zip -rX #dest ./*"
    cwd: src
    ->
      console.log "zip #{rel dest}"
      done ...

fs.mkdirSync build.path unless fs.existsSync build.path
console.log "mkdir #{rel build.path}"

##
# copy the book
source = path.resolve argv.0
dest = path.resolve build.path, \data
err, files <- cp-r source, dest
throw err if err

##
# generate page*.xhtml
{ attrs } <- Data.getMasterPage dest
num-pages = attrs['TOTAL-PAGES']

todo = [1 to num-pages]
:render let
  unless idx = todo.shift!
    copy-statics!
    return
  err <- gen-page build.path, dest, idx
  throw err if err
  render!

##
# copy other dependancies
copy-statics = ->
  # META-INF/
  source = path.resolve __dirname, 'epub/META-INF'
  dest = path.resolve build.path, 'META-INF'
  err, files <- cp-r source, dest
  throw err if err
  # mimetype and more
  files = <[mimetype]>
  :copy let
    unless file = files.shift!
      copy-more!
      return
    source = path.resolve __dirname, 'epub', file
    dest = path.resolve build.path, file
    err <- cp source, dest
    throw err if err
    copy!

copy-more = ->
  # css, js, fonts ...
  counter = 0
  for let dep in build.needs
    source = path.resolve __dirname, '../../', dep
    console.warn "need #{rel source}" unless fs.existsSync source
    dest = path.resolve build.path, dep
    err, files <- cp-r source, dest
    throw err if err
    next! if ++counter is build.needs.length

next = ->
##
# generate TOC.xhtml
  source = path.resolve __dirname, 'epub/TOC.jade'
  dest = path.resolve build.path, 'TOC.xhtml'
  files = for idx from 1 to num-pages
    path: "page#idx.xhtml"
    title: if idx is 1 then 'Cover' else "Page #idx"
  result = jade.renderFile source, { files }
  err, html <- tidy result, indent: on
  throw err if err
  err <- write dest, html
  throw err if err

##
# generate font subset
  source = path.resolve __dirname, 'epub', 'SourceHanSansTW-Regular.ttf'
  dest = path.resolve build.path, 'fonts', 'Noto-subset.ttf'
  err <- font-subset source, dest
  throw err if err

##
# should build main js here
##

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
          title: 'Little Red Cap Demo'
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
      dest = path.resolve build.path, \package.opf
      err <- write dest, ocf
      throw err if err
      source = path.resolve build.path
      dest = path.resolve build.path, "../#{basename}.epub"
      err <- zip source, dest
      throw err if err
