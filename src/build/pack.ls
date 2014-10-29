#!/usr/bin/env lsc
require! {
  xmlbuilder: { create }
  'vinyl-fs': fs
  'map-stream': map
  './epub/utils': utils
  './epub': { pack }
}

{ filename, argv } = utils.argv!

if argv.length isnt 1
  console.log "Usage: #filename [path]"
  process.exit 0

{ 0:path } = argv

files = []
fs.src ["#path/**"]
  .pipe map (file, cb) ->
    files.push "#{file.path.replace "#{process.cwd!}/", ''}"
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
    console.log ocf
