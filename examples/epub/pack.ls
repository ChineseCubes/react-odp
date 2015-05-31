#!/usr/bin/env lsc
require! {
  fs
  path
  request
  unzip
  colors
  jade
  child_process: { exec }
  shellwords: { escape }
  rsvp: { Promise, all, hash }:RSVP
  datauri: { promises: datauri }
  'vinyl-fs': vinyl
  'map-stream': map-stream
  'json-stable-stringify': stringify
  'prelude-ls': { apply, filter, map, concat, is-type }
  'pretty-data': { pd }
  './lib/argv'
  './lib/cp'
  './lib/cpr'
  './lib/read-dir'
  './lib/read-file'
  './lib/gen'
  './lib/codepoints'
  './lib/create-container'
  '../../src/Data'
  '../../src/async': { lift, get-json, get-bin }
}

RSVP.on \error -> console.error it.stack

rel  = -> path.relative process.cwd!, it
log  = lift console.log

get-books  = lift (host) -> get-json "#host/books/"
get-master = lift (host, alias) -> Data.get-master "#host/books/#alias/"
get-meta   = lift (host, alias) -> get-json "#host/books/#alias/metadata.json"
#get-dict   = lift (host, alias) -> get-json "#host/books/#alias/dict.json"
#get-mp3    = lift (host, alias) -> get-json "#host/books/#alias/audio.mp3.json"
#get-vtt    = lift (host, alias) -> get-json "#host/books/#alias/audio.vtt.json"
get-page   = lift (host, alias, idx) -> get-json "#host/books/#alias/page#idx.json"
patch-page = lift (host, alias, page) -> Data.patch-page page, "#host/books/#alias/", './data/'
get-pages  = lift (host, alias, total) ->
  all (for i from 1 to total => get-page host, alias, i)

get-book = lift (books, id) -> new Promise (resolve, reject) ->
  console.log "#{'find book'magenta} by id #id"
  bs = books |> filter (.id is id)
  switch
  | bs.length is   0 => reject new Error "book not found: #id"
  | bs.length isnt 1 => reject new Error "ID isnt unique: #bs"
  | otherwise        => resolve bs.0

get-hrefs = lift (node) -> new Promise (resolve, reject) ->
  hrefs = node.children |> map get-hrefs
  all hrefs .then (hrefs) ->
    hrefs = concat hrefs
    if not node?attrs?href
      then resolve hrefs
      else resolve [node.attrs.href] ++ hrefs

get-codepoints = lift (pages) ->
  console.log "#{'get codepoints'magenta} from #{pages.length} pages"
  codepoints JSON.stringify pages

mkdir = lift (dirname) -> new Promise (resolve, reject) ->
  console.log "#{'mkdir'magenta} #{rel dirname}"
  exists <- fs.exists dirname
  if not exists
    err <- fs.mkdir dirname
    if err
      then reject err
      else resolve dirname
  else resolve dirname

write = lift (filename, data, options) -> new Promise (resolve, reject) ->
  console.log "#{'write'magenta} #{rel filename}"
  err <- fs.writeFile filename, data, options
  if err
    then reject err
    else resolve filename

stringify = lift (data) -> JSON.stringify data, null, 2

save-book = lift (host, alias, master, pages) ->
  Promise.resolve path.resolve ".#alias.build"
    .then mkdir
    .then (dirname) -> path.resolve dirname, 'data'
    .then mkdir
    .then (dirname) -> path.resolve dirname, 'Pictures'
    .then mkdir
    .then (dirname) ->
      dirname = path.resolve dirname, '..'
      total = master.setup.total-pages
      ps = []
      ps.push write do
        path.resolve dirname, 'masterpage.json'
        stringify master
      ps.push write do
        path.resolve dirname, 'metadata.json'
        stringify get-meta host, alias
      #ps.push write do
      #  path.resolve dirname, 'dict.json'
      #  stringify get-dict host, alias
      #ps.push write do
      #  path.resolve dirname, 'audio.mp3.json'
      #  stringify get-mp3 host, alias
      #ps.push write do
      #  path.resolve dirname, 'audio.vtt.json'
      #  stringify get-vtt host, alias
      ps ++= for page in pages
        filename = get-hrefs page .then -> it.0
        base = filename |> lift path.basename
        href = base |> lift (base) -> "#host/books/#alias/Pictures/#base"
        write do
          filename.then -> path.resolve dirname, '..', it
          get-bin href
      ps ++= for let i from 1 to total
        write do
          path.resolve dirname, "page#i.json"
          stringify pages[i - 1]
      all ps

gen-page = lift (dst, page, idx) ->
  console.log "#{'render'magenta} #{rel dst}/page#idx.xhtml"
  gen [page] .then -> write "#dst/page#idx.xhtml", it

gen-pages = lift (dirname, pages) ->
  for i, page of pages => gen-page dirname, page, +i + 1

cp-meta-inf = lift (dirname) ->
  src = path.resolve __dirname, 'assets/META-INF'
  dst = path.resolve dirname, 'META-INF'
  cpr src, dst .then ({ files }) -> files

cp-mimetype = lift (dirname) ->
  src = path.resolve __dirname, 'assets', 'mimetype'
  dst = path.resolve dirname, 'mimetype'
  cp src, dst .then ({ dst }) -> dst

cp-others = lift (dirname) ->
  for dep in <[js css fonts]>
    src = path.resolve __dirname, '../../', dep
    dst = path.resolve dirname, dep
    console.warn "need #{rel src}" unless fs.existsSync src
    cpr src, dst .then ({ files }) -> files
  |> all

/*
cp-strokes = lift (dirname, cpts) ->
  mkdir path.resolve dirname, 'strokes'
    .then (dirname) ->
      all do
        for let stroke in cpts
          stroke = "#{stroke.toString 16}.json"
          src = path.resolve __dirname, '../../strokes', stroke
          dst = path.resolve dirname, stroke
          cp src, dst

cp-arphic-strokes = lift (dirname, cpts) ->
    langs = <[zh-TW zh-CN]>
    mkdir path.resolve dirname, 'arphic-strokes'
      .then (dirname) ->
        all do
          for let lang in langs
            mkdir path.resolve dirname, lang
              .then (dirname) ->
                all do
                  for stroke in cpts
                    stroke = "#{stroke.toString 16}.txt"
                    src = path.resolve __dirname, '../../arphic-strokes', lang, stroke
                    dst = path.resolve dirname, stroke
                    cp src, dst
*/

gen-font-subsets = lift (dirname, cpts) ->
  weights = <[ExtraLight Light Normal Regular Medium Bold Heavy]>
  ps =
    for weight in weights
      src = path.resolve __dirname, 'assets', "SourceHanSansTW-#weight.ttf"
      dst = path.resolve dirname, 'fonts', "Noto-T-#{weight}-Subset.ttf"
      font-subset src, dst, cpts
        .catch -> console.error it.stack
  ps .= concat do
    for weight in weights
      src = path.resolve __dirname, 'assets', "SourceHanSansCN-#weight.ttf"
      dst = path.resolve dirname, 'fonts', "Noto-S-#{weight}-Subset.ttf"
      font-subset src, dst, cpts
        .catch -> console.error it.stack
  all ps

gen-TOC = lift (dirname, total) ->
  src = path.resolve __dirname, 'assets/TOC.jade'
  dst = path.resolve dirname, 'TOC.xhtml'
  files = for i from 1 to total
    path: "page#i.xhtml"
    title: if i is 1 then 'Cover' else "Page #i"
  result = pd.xml jade.renderFile src, { files }
  write dst, result

gen-OCF = lift (dirname, total) -> new Promise (resolve, reject) ->
  files = []
  vinyl
    .src [
      "#dirname/**"
      "!#dirname/**/.*"
      "!#dirname/META-INF/*"
      "!#dirname/mimetype"
      "!#dirname/package.opf"
      "!#dirname/*.pe"
    ]
    .pipe map-stream (file, cb) ->
      files.push path.relative(dirname, file.path)
      cb null, file
    .on \end ->
      ocf = create-container do
        files
        spine: for idx from 1 to total => "page#idx.xhtml"
        metadata: require path.resolve dirname, 'data', 'metadata.json'
      dst = path.resolve dirname, \package.opf
      resolve write dst, ocf

zip = lift (alias) -> new Promise (resolve, reject) ->
  src = path.resolve ".#alias.build"
  dst = path.resolve src, "../#alias.epub"
  console.log "#{'zip'magenta} #{rel dst}"
  # mimetype should be the first entry and should not be zipped
  exec do
    "zip -0 -X #{escape dst} mimetype"
    cwd: src
    (err, stdout, stderr) ->
      if err then return reject err
      exec do
        "zip -9 -rX #{escape dst} ./* --exclude \\mimetype \\*.DS_Store* \\*.pe \\js/index.js"
        cwd: src
        (err, stdout, stderr) ->
          unless err then resolve stdout, stderr else reject err

##
# arguments
{ filename, args } = argv!

if args.length is 0
  console.log "Usage: #filename <book-id> [book-id [book-id [...]]]"
  process.exit 0

console.log '''
 _____ _____ _____ _____ _____         _
|     |  |  | __  |   __| __  |___ ___| |_ ___
|   --|  |  | __ -|   __| __ -| . | . | '_|_ -|
|_____|_____|_____|_____|_____|___|___|_,_|___|
'''magenta
# http://patorjk.com/software/taag/#p=display&f=Rectangles&t=CUBEBooks

:main let
  return unless arg = args.shift!          # break
  return main! unless is-type \Number +arg # continue
  id   = +arg
  host = 'http://localhost:8081'

  books    = get-books host
  book     = get-book books, id
  alias    = book.then (.alias)
  dirname  = alias.then -> path.resolve ".#it.build"
  master   = get-master host, alias
  total    = master.then -> it.setup.total-pages
  pages    = get-pages host, alias, total
  pages    = pages.then -> for page in it => patch-page host, alias, page
  cpts     = get-codepoints pages
  # should concat all paths later
  save-book host, alias, master, pages
    .then ->
      all [
        gen-pages dirname, pages
        cp-meta-inf dirname
        cp-mimetype dirname
        gen-TOC dirname, total
        cp-others dirname .then -> gen-font-subsets dirname, cpts
        #cp-strokes dirname, cpts
        #cp-arphic-strokes dirname, cpts
      ]
    .then -> gen-OCF dirname, total
    .then -> zip alias
    .then main

##
# helpers
count = 0
function font-subset src, dst, codepoints
  new Promise (resolve, reject) ->
    base = path.resolve path.dirname(dst), '../'
    script-path = path.resolve base, "#{count++}.pe"
    console.log "#{'generate'magenta} #{rel script-path}"
    script = """
      Open(\"#src\")
      Select(0u3000)\n
    """
    for cpt in codepoints
      script += "SelectMore(0u#{cpt.toString 16})\n"
    script += """
      SelectInvert()
      Clear()
      Generate(\"#dst\")
    """
    fs.writeFileSync script-path, script
    console.log "#{'generate'magenta} #{rel dst}"
    exec do
      "fontforge -script #{escape script-path}"
      cwd: base
      (err, stdout, stderr) ->
        unless err then resolve stdout, stderr else reject err
