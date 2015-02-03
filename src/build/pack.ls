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
  'prelude-ls': { apply, filter, is-type }
  '../CUBE/data': Data
  './epub/utils': utils
  './epub': { pack }
  './read-dir': read-dir
  './read-file': read-file
  './codepoints': codepoints
  './moedict': moedict
}

RSVP.on \error console.log

rel  = -> path.relative process.cwd!, it
lift = (f) -> (...args) -> all args .then apply f
log  = lift console.log
exit = lift -> process.exit!

books-of = lift (host) -> new Promise (resolve, reject) ->
  request do
    method: \GET
    uri: "#host/books/"
    (err, res, body) ->
      | err                     => reject err
      | res.statusCode isnt 200 => reject new Error "not OK: #{res.statusCode}"
      | otherwise               => resolve JSON.parse body

book-of = lift (id, books) -> new Promise (resolve, reject) ->
  bs = books |> filter (.id is id)
  switch
  | bs.length is   0 => reject new Error "book not found: #id"
  | bs.length isnt 1 => reject new Error "ID isnt unique: #bs"
  | otherwise        => resolve bs.0

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
  return unless arg = argv.shift!       # break
  return main! unless is-type \Number +arg # continue
  id = +arg

  ##
  # shared globals
  #build =
  #  id: +arg
  #  #base: basename
  #  #src:  path.resolve arg
  #  #path: path.resolve ".#basename.build"
  #  #data: path.resolve ".#basename.build/data"
  #  needs: <[js css fonts img]>
  #  num-pages: 0

  log book-of(id, books-of 'http://localhost:8081')
  main!
  #Promise.resolve!
    #.then ->
    #  # convert and unzip
    #  convert build.src, build.data
    #.then ->
    #  read-dir path.resolve build.data
    #.then (paths) ->
    #  paths .= filter (is /page(\d+).json$/)
    #  ps = for filepath in paths => read-file filepath, encoding: \utf8
    #  all ps .then -> codepoints it.join ''
    #.then (cpts) ->
    #  cpts = for c in cpts => parseInt c, 16
    #  build.codepoints = cpts.filter -> 0x4e00 <= it <= 0xfaff
    #.then ->
    #  # get data from moedict.tw
    #  # XXX: should create dict.json before packing
    #  chars = (for build.codepoints => String.fromCharCode ..)join ''
    #  dst = path.resolve build.data, 'dict.json'
    #  moedict chars .then -> write escape(dst), stringify it, space: 2
    #.then ->
    #  get-master-page build.data
    #.then ({ attrs }) ->
    #  # generate page*.xhtml
    #  build.num-pages = attrs['TOTAL-PAGES']
    #  dst = build.data
    #  all do
    #    for idx in [1 to build.num-pages]
    #      gen-page dst, build.path, idx
    #.then ->
    #  # META-INF/
    #  src = path.resolve __dirname, 'epub/META-INF'
    #  dst = path.resolve build.path, 'META-INF'
    #  cp-r src, dst
    #.then ->
    #  # mimetype and more
    #  all do
    #    for file in <[mimetype]>
    #      src = path.resolve __dirname, 'epub', file
    #      dst = path.resolve build.path, file
    #      cp src, dst
    #.then ->
    #  # css, js, fonts ...
    #  all do
    #    for dep in build.needs
    #      src = path.resolve __dirname, '../../', dep
    #      dst = path.resolve build.path, dep
    #      console.warn "need #{rel src}" unless fs.existsSync src
    #      cp-r src, dst
    #.then ->
    #  # speech
    #  data =
    #    "#{build.base}.mp3": 'audio.mp3'
    #    "#{build.base}.vtt": 'audio.vtt'
    #  var src, dst
    #  ps =
    #    for k, v of data
    #      src = path.resolve path.dirname(build.src), k
    #      dst = path.resolve build.path, 'data', v
    #      cp src, dst
    #  p = new Promise (resolve, reject) ->
    #    err, vtt <- fs.readFile src
    #    return reject err if err
    #    vtt .= toString!
    #    vtt .= replace /\ufeff/g, ''
    #    vtt .= replace /\r\n?|\n/g, '\\n'
    #    write(
    #      path.resolve(build.path, 'data', 'audio.vtt.json')
    #      "{\"webvtt\":\"#vtt\"}"
    #    )then resolve
    #  ps.push p
    #  all ps #.catch -> console.warn 'speech not found'yellow
    #.then ->
    #  src = path.resolve build.path, 'data', 'audio.mp3'
    #  mp3val src
    #.then ->
    #  dst = path.resolve build.path, 'data', 'audio.mp3'
    #  datauri dst .then do
    #    -> write "#dst.json", "{\"mp3\":\"#{it.replace \mpeg -> \mp3}\"}"
    #    -> console.log it
    #.then ->
    #  console.log "#{'cp'magenta} strokes"
    #  try fs.mkdirSync path.resolve build.path, 'strokes'
    #  all do
    #    for let stroke in build.codepoints
    #      stroke = "#{stroke.toString 16}.json"
    #      src = path.resolve __dirname, '../../strokes', stroke
    #      dst = path.resolve build.path, 'strokes', stroke
    #      cp src, dst, off
    #.then ->
    #  console.log "#{'cp'magenta} arphic-strokes"
    #  langs = <[zh-TW zh-CN]>
    #  try fs.mkdirSync path.resolve build.path, 'arphic-strokes'
    #  all do
    #    for lang in langs
    #      base = path.resolve build.path, 'arphic-strokes', lang
    #      try fs.mkdirSync base
    #      all do
    #        for stroke in build.codepoints
    #          stroke = "#{stroke.toString 16}.txt"
    #          src = path.resolve __dirname, '../../arphic-strokes', lang, stroke
    #          dst = path.resolve base, stroke
    #          cp src, dst, off
    #.then ->
    #  # generate font subset
    #  weights = <[ExtraLight Light Normal Regular Medium Bold Heavy]>
    #  ps =
    #    for weight in weights
    #      src = path.resolve __dirname, 'epub', "SourceHanSansTW-#weight.ttf"
    #      dst = path.resolve build.path, 'fonts', "Noto-T-#{weight}-Subset.ttf"
    #      font-subset src, dst, build.codepoints
    #        .catch -> console.log it.stack
    #  ps .= concat do
    #    for weight in weights
    #      src = path.resolve __dirname, 'epub', "SourceHanSansCN-#weight.ttf"
    #      dst = path.resolve build.path, 'fonts', "Noto-S-#{weight}-Subset.ttf"
    #      font-subset src, dst, build.codepoints
    #        .catch -> console.log it.stack
    #  all ps
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
function convert src, dst
  new Promise (resolve, reject) ->
    console.log "#{'convert'magenta} and #{'unzip'magenta} #{rel src}"
    extractor = unzip.Extract path: dst
    extractor.on \close -> resolve!
    request {
      method: \POST
      uri: 'https://web-beta.chinesecubes.com/sandbox/odpConvert.php'
      #uri: 'http://192.168.11.15/sandbox/odpConvert.php'
      #encoding: \binary
      #timeout: 20000ms
    }
      ..form!append \file fs.createReadStream src
      ..on \error (err) -> reject err
      ..pipe extractor

function cp src, dst, verbose = true
  new Promise (resolve, reject) ->
    unless fs.existsSync src # fail silently
      console.warn "#{'not found:'yellow} #{rel src}" if verbose
      return resolve!
    console.log "#{'cp'magenta} #{rel src} #{rel dst}" if verbose
    _cp src, dst, (err) ->
      if not err or err.code is \ENOENT
        then resolve!
        else reject err

function cp-r src, dst
  new Promise (resolve, reject) ->
    console.log "#{'cp'magenta} -R #{rel src} #{rel dst}"
    _cpr src, dst, {
      delete-first: on
      overwrite: on
      confirm: on
    }, (err, files) ->
      unless err then resolve files else reject err

gen = path.resolve __dirname, './gen.ls'
function gen-page src, dst, idx
  new Promise (resolve, reject) ->
    console.log "#{(rel gen)magenta} #{rel src} #idx"
    :try-again let
      exec do
        "#gen #{escape path.relative dst, src} #idx"
        cwd: dst
        (err, stdout, stderr) ->
          return reject err if err
          if stdout.length isnt 1
            write "#dst/page#idx.xhtml", stdout
              .then resolve, reject
          else # XXX: should find out the reason
            try-again!

function write dst, file
  new Promise (resolve, reject) ->
    console.log "#{'write'magenta} #{rel dst}"
    fs.writeFile dst, file, (err) -> unless err then resolve! else reject err

/*
function get-codepoints src
  new Promise (resolve, reject) ->
    console.log "#{'get'magenta} codepoints from #{rel src}"
    target = (escape src)replace '\\*' -> '*'
    exec do
      "cat #target | #{path.resolve __dirname, 'codepoints.ls'}"
      (err, stdout, stderr) ->
        unless err then resolve stdout, stderr else reject err

function fetch-moedict chars, dst
  new Promise (resolve, reject) ->
    console.log "#chars | #{'fetch-moedict.ls'magenta} > #{rel dst}"
    exec do
      "echo #chars | #{path.resolve __dirname, 'fetch-moedict.ls'} > #{escape dst}"
      (err, stdout, stderr) ->
        unless err then resolve stdout, stderr else reject err
*/

function get-master-page src
  new Promise (resolve, reject) ->
    try
      Data.getMasterPage src, resolve
    catch err
      reject err

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

