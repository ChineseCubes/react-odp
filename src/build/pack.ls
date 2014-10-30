#!/usr/bin/env lsc
require! {
  child_process: { exec }
  fs
  path
  xmlbuilder: { create }
  'vinyl-fs': vinyl
  'map-stream': map
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
  # will create `strokes` and `js` later
  needs: <[css fonts images]>
  cpr-options:
    delete-first: yes
    overwrite:    yes
    confirm:      yes

fs.mkdirSync build.path unless fs.existsSync build.path
console.log "mkdir #{rel build.path}"

##
# copy the book
source = path.resolve argv.0
dest = path.resolve build.path, \data
err, files <- cpr source, dest, build.cpr-options
throw err if err
console.log "cp -R #{rel source} #{rel dest}"

##
# generate page*.xhtml
{ attrs } <- Data.getMasterPage dest
num-pages = attrs['TOTAL-PAGES']

todo = [1 to num-pages]
gen = path.resolve __dirname, './gen.ls'
:render let
  unless idx = todo.shift!
    copy-more!
    return
  err <- exec "#gen #dest #idx > #{build.path}/page#idx.xhtml"
  throw err if err
  console.log "#{rel gen} #{rel dest} #idx > #{rel build.path}/page#idx.xhtml"
  render!

##
# copy other dependancies
copy-more = ->
  counter = 0
  for let dep in build.needs
    source = path.resolve dep
    console.warn "need #{rel source}" unless fs.existsSync source
    dest = path.resolve build.path, dep
    err, files <- cpr source, dest, build.cpr-options
    throw err if err
    console.log "cp -R #{rel source} #{rel dest}"
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
  err <- fs.writeFile dest, html
  throw err if err
  console.log "write #{rel dest}"

##
# should generate font subsets here
##

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
          title: 'Little Red Cap Demo v5'
          creator: 'Audrey Tang'
          language: 'zh-Hant'
          identifier: 'LittleRedCapDemo'
          date: '2014-07-12'
          publisher: 'Locus Publishing Company'
          contributors:
            * 'Audrey Tang'
            * 'Alice Huang'
            * 'caasi Huang'
          rights: 'Locus Publishing Company all righths reserved.'
      dest = path.resolve build.path, \package.opf
      fs.writeFile dest, ocf, (err) ->
        throw err if err
        console.log "write #{rel dest}"
