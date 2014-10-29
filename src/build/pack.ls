#!/usr/bin/env lsc
require! {
  fs
  path
  xmlbuilder: { create }
  'vinyl-fs': vinyl
  'map-stream': map
  cpr
  './epub/utils': utils
  './epub': { pack }
}



{ filename, argv } = utils.argv!

if argv.length isnt 1
  console.log "Usage: #filename [path]"
  process.exit 0



rel = -> path.relative process.cwd!, it

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

source = path.resolve argv.0
dest = path.resolve build.path, \data
err, files <- cpr source, dest, build.cpr-options
throw err if err
console.log "cp -R #{rel source} #{rel dest}"

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
  files = []
  vinyl.src "#{build.path}/**"
    .pipe map (file, cb) ->
      files.push path.relative(build.path, file.path)
      cb null, file
    .on \end ->
      ocf = pack do
        files
        spine:
          * 'page1.xhtml'
          * 'page2.xhtml'
          * 'page3.xhtml'
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
