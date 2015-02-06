#!/usr/bin/env lsc
require! {
  fs
  path
  request
  unzip
  colors
  jade
  cp: _cp
  cpr: _cpr
  child_process: { exec }
  shellwords: { escape }
  htmltidy: { tidy }
  rsvp: { Promise, all, hash }:RSVP
  datauri: { promises: datauri }
  'vinyl-fs': vinyl
  'map-stream': map
  'json-stable-stringify': stringify
  'prelude-ls': { apply, filter, map, concat, is-type }
  '../CUBE/data': Data
  './epub/utils': utils
  './epub': { pack }
  './read-dir': read-dir
  './read-file': read-file
  './codepoints': codepoints
  './moedict': moedict
}

RSVP.on \error console.error

rel  = -> path.relative process.cwd!, it
lift = (f) -> (...args) -> all args .then apply f
log  = lift console.log
exit = lift -> process.exit!

get-json = lift (uri) -> new Promise (resolve, reject) ->
  console.log "#{'GET'magenta} #uri"
  request do
    method: \GET
    uri: uri
    (err, res, body) ->
      | err                     => reject err
      | res.statusCode isnt 200 => reject new Error "not OK: #{res.statusCode}"
      | otherwise               => resolve JSON.parse body

get-bin = lift (uri) -> new Promise (resolve, reject) ->
  console.log "#{'GET'magenta} #uri"
  request do
    method: \GET
    uri: uri
    encoding: \binary
    (err, res, body) ->
      | err                     => reject err
      | res.statusCode isnt 200 => reject new Error "not OK: #{res.statusCode}"
      | otherwise               => resolve new Buffer body, \binary

get-books  = lift (host) -> get-json "#host/books/"
get-master = lift (host, book) -> get-json "#host/books/#{book.alias}/"
get-dict   = lift (host, book) -> get-json "#host/books/#{book.alias}/dict.json"
get-page   = lift (host, book, idx) -> get-json "#host/books/#{book.alias}/page#idx.json"
get-mp3    = lift (host, book) -> get-json "#host/books/#{book.alias}/audio.mp3.json"
get-vtt    = lift (host, book) -> get-json "#host/books/#{book.alias}/audio.vtt.json"
get-pages  = lift (host, book, master) ->
  total = master.attrs['TOTAL-PAGES']
  all (for i from 1 to total => get-page host, book, i)

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
  console.log "#{'mkdir'magenta} #dirname"
  exists <- fs.exists dirname
  if not exists
    err <- fs.mkdir dirname
    if err
      then reject err
      else resolve dirname
  else resolve dirname

cp = lift (src, dst, verbose = true) -> new Promise (resolve, reject) ->
  unless fs.existsSync src # fail silently
    console.warn "#{'not found:'yellow} #{rel src}" if verbose
    return resolve!
  console.log "#{'cp'magenta} #{rel src} #{rel dst}" if verbose
  _cp src, dst, (err) ->
    if not err or err.code is \ENOENT
      then resolve dst
      else reject err

cp-r = (src, dst) -> new Promise (resolve, reject) ->
  console.log "#{'cp'magenta} -R #{rel src} #{rel dst}"
  _cpr src, dst, {
    delete-first: on
    overwrite: on
    confirm: on
  }, (err, files) ->
    unless err then resolve files else reject err

write = lift (filename, data, options) -> new Promise (resolve, reject) ->
  console.log "#{'write'magenta} #filename"
  err <- fs.writeFile filename, data, options
  if err
    then reject err
    else resolve filename

stringify = lift (data) -> JSON.stringify data, null, 2

save-book = lift (host, book, master, pages) ->
  Promise.resolve path.resolve ".#{book.alias}.build"
    .then mkdir
    .then (dirname) -> path.resolve dirname, 'data'
    .then mkdir
    .then (dirname) -> path.resolve dirname, 'Pictures'
    .then mkdir
    .then (dirname) ->
      dirname = path.resolve dirname, '..'
      total = master.attrs['TOTAL-PAGES']
      ps = for let i from 1 to total
        write do
          path.resolve dirname, "page#i.json"
          stringify pages[i-1]
      ps.push write do
        path.resolve dirname, 'masterpage.json'
        stringify master
      ps.push write do
        path.resolve dirname, 'dict.json'
        stringify get-dict host, book
      ps.push write do
        path.resolve dirname, 'audio.mp3.json'
        stringify get-mp3 host, book
      ps.push write do
        path.resolve dirname, 'audio.vtt.json'
        stringify get-vtt host, book
      ps ++= for page in pages
        hrefs = get-hrefs page
        href = hrefs |> lift (hrefs) -> hrefs.0
        base = href |> lift path.basename
        filename = base |> lift (base) -> path.resolve dirname, 'Pictures', base
        write do
          filename
          get-bin href
      all ps

const gen = path.resolve __dirname, './gen.ls'
gen-page = lift (book, idx) -> new Promise (resolve, reject) ->
  dst = path.resolve ".#{book.alias}.build"
  src = path.resolve dst, 'data'
  console.log "#{(rel gen)magenta} #{rel src} #idx"
  :try-again let
    exec do
      "#gen #{escape path.relative dst, src} #idx"
      cwd: dst
      (err, stdout, stderr) ->
        return reject err if err
        if stdout.length isnt 1
          resolve write "#dst/page#idx.xhtml", stdout
        else # XXX: should find out the reason
          try-again!

gen-pages = lift (book, master) ->
  total = master.attrs['TOTAL-PAGES']
  for i from 1 to total => gen-page book, i

cp-meta-inf = lift (book) ->
  src = path.resolve __dirname, 'epub/META-INF'
  dst = path.resolve ".#{book.alias}.build", 'META-INF'
  cp-r src, dst

cp-mimetype = lift (book) ->
  src = path.resolve __dirname, 'epub', 'mimetype'
  dst = path.resolve ".#{book.alias}.build", 'mimetype'
  cp src, dst

cp-others = lift (book) ->
  for dep in <[js css fonts img]>
    src = path.resolve __dirname, '../../', dep
    dst = path.resolve ".#{book.alias}.build", dep
    console.warn "need #{rel src}" unless fs.existsSync src
    cp-r src, dst
  |> all

cp-strokes = lift (book, cpts) ->
  mkdir path.resolve ".#{book.alias}.build", 'strokes'
    .then (dirname) ->
      all do
        for let stroke in cpts
          stroke = "#{stroke.toString 16}.json"
          src = path.resolve __dirname, '../../strokes', stroke
          dst = path.resolve dirname, stroke
          cp src, dst

cp-arphic-strokes = lift (book, cpts) ->
    langs = <[zh-TW zh-CN]>
    mkdir path.resolve ".#{book.alias}.build", 'arphic-strokes'
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

gen-font-subsets = lift (book, cpts) ->
  dirname = ".#{book.alias}.build"
  weights = <[ExtraLight Light Normal Regular Medium Bold Heavy]>
  ps =
    for weight in weights
      src = path.resolve __dirname, 'epub', "SourceHanSansTW-#weight.ttf"
      dst = path.resolve dirname, 'fonts', "Noto-T-#{weight}-Subset.ttf"
      font-subset src, dst, cpts
        .catch -> console.log it.stack
  ps .= concat do
    for weight in weights
      src = path.resolve __dirname, 'epub', "SourceHanSansCN-#weight.ttf"
      dst = path.resolve dirname, 'fonts', "Noto-S-#{weight}-Subset.ttf"
      font-subset src, dst, cpts
        .catch -> console.log it.stack
  all ps
##
# arguments
{ filename, argv } = utils.argv!

if argv.length is 0
  console.log "Usage: #filename [path]"
  process.exit 0

console.log '''
 _____ _____ _____ _____ _____         _
|     |  |  | __  |   __| __  |___ ___| |_ ___
|   --|  |  | __ -|   __| __ -| . | . | '_|_ -|
|_____|_____|_____|_____|_____|___|___|_,_|___|
'''magenta
# http://patorjk.com/software/taag/#p=display&f=Rectangles&t=CUBEBooks

:main let
  return unless arg = argv.shift!          # break
  return main! unless is-type \Number +arg # continue
  id   = +arg
  host = 'http://localhost:8081'

  books    = get-books host
  book     = get-book books, id
  master   = get-master host, book
  pages    = get-pages host, book, master
  cpts     = get-codepoints pages
  # should concat all paths later
  files    = save-book host, book, master, pages
  xhtmls   = gen-pages book, master
  meta-inf = cp-meta-inf book
  mimetype = cp-mimetype book
  cp-others book .then -> gen-font-subsets book, cpts
  strokes  =
    * cp-strokes book, cpts
    * cp-arphic-strokes book, cpts
  main!

  #Promise.resolve!
    #.then -> new Promise (resolve, reject) ->
    #  # generate TOC.xhtml
    #  src = path.resolve __dirname, 'epub/TOC.jade'
    #  dst = path.resolve build.path, 'TOC.xhtml'
    #  files = for idx from 1 to build.num-pages
    #    path: "page#idx.xhtml"
    #    title: if idx is 1 then 'Cover' else "Page #idx"
    #  result = jade.renderFile src, { files }
    #  err, html <- tidy result, indent: on
    #  return reject err if err
    #  write dst, html .then resolve
    #.then ->
    #  # generate metadata for EPUB
    #  files = []
    #  vinyl
    #    .src [
    #      "#{build.path}/**"
    #      "!#{build.path}/**/.*"
    #      "!#{build.path}/META-INF/*"
    #      "!#{build.path}/mimetype"
    #      "!#{build.path}/package.opf"
    #      "!#{build.path}/*.pe"
    #    ]
    #    .pipe map (file, cb) ->
    #      files.push path.relative(build.path, file.path)
    #      cb null, file
    #    .on \end ->
    #      ocf = pack do
    #        files
    #        spine: for idx from 1 to build.num-pages => "page#idx.xhtml"
    #        metadata: require path.resolve build.data, 'metadata.json'
    #      dst = path.resolve build.path, \package.opf
    #      write dst, ocf
    #        .then ->
    #          src = path.resolve build.path
    #          dst = path.resolve build.path, "../#{build.base}.epub"
    #          zip src, dst
    #        .then main
    #.catch (err) ->
    #  console.log err

##
# helpers
function mp3val src
  new Promise (resolve, reject) ->
    console.log "#{'mp3val'magenta} -f #{rel src}"
    exec do
      "mp3val -f #src"
      (err, stdout, stderr) ->
        unless err then resolve stdout, stderr else reject err

count = 0
function font-subset src, dst, codepoints
  new Promise (resolve, reject) ->
    base = path.resolve path.dirname(dst), '../'
    script-path = path.resolve base, "#{count++}.pe"
    console.log "#{'generate'magenta} #script-path"
    script = """
      Open(\"#src\")
      Select(0u3000)\n
    """
    for cp in codepoints
      script += "SelectMore(0u#{cp.toString 16})\n"
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

function zip src, dst
  new Promise (resolve, reject) ->
    console.log "#{'zip'magenta} #{rel dst}"
    exec do
      "zip -9 -rX #{escape dst} ./* --exclude \\*.DS_Store* \\*.pe \\js/index.js"
      cwd: src
      (err, stdout, stderr) ->
        unless err then resolve stdout, stderr else reject err

