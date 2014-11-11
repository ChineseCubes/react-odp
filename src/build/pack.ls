#!/usr/bin/env lsc
require! {
  child_process: { exec }
  shellwords: { escape }
  fs
  path
  request
  unzip
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

console.log '''
 _____ _____ _____ _____ _____         _
|     |  |  | __  |   __| __  |___ ___| |_ ___
|   --|  |  | __ -|   __| __ -| . | . | '_|_ -|
|_____|_____|_____|_____|_____|___|___|_,_|___|
'''magenta
# http://patorjk.com/software/taag/#p=display&f=Rectangles&t=CUBEBooks

:main let
  return unless arg = argv.shift!       # break
  return main! unless arg.match /.odp$/ # continue
  basename = path.basename arg, '.odp'


  ##
  # prepare the build dir
  build =
    path: path.resolve ".#basename.build"
    data: path.resolve ".#basename.build/data"
    needs: <[js css fonts]>

  ##
  # convert and unzip
  src = path.resolve arg
  dst = build.data
  <- convert src, dst

  src = path.resolve build.data, 'page*.json'
  err, stdout, stderr <- get-codepoints src
  codepoints = for c in stdout.split /\s/ | c.length  => parseInt c, 16
  build.codepoints = codepoints.filter -> it > 10000

  ##
  # get data from moedict.tw
  # XXX: should create dict.json before packing
  chars = (for build.codepoints => String.fromCharCode ..)join ''
  dst = path.resolve build.data, 'dict.json'
  err, stdout, stderr <- fetch-moedict chars, dst
  throw err if err

  ##
  # generate page*.xhtml
  { attrs } <- Data.getMasterPage build.data
  num-pages = attrs['TOTAL-PAGES']

  dst = build.data
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
      copy-strokes! if ++counter is build.needs.length

  copy-strokes = ->
    try fs.mkdirSync path.resolve build.path, 'strokes'
    counter = 0
    for let stroke in build.codepoints
      stroke = "#{stroke.toString 16}.json"
      src = path.resolve __dirname, '../../strokes', stroke
      dst = path.resolve build.path, 'strokes', stroke
      err <- cp src, dst
      throw err if err and err.code isnt \ENOENT
      next! if ++counter is build.codepoints.length

  next = ->
  ##
  # generate font subset
    src = path.resolve __dirname, 'epub', 'SourceHanSansTW-Regular.ttf'
    dst = path.resolve build.path, 'fonts', 'Noto-subset.ttf'
    err <- font-subset src, dst, build.codepoints
    throw err if err

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
  # generate metadata for EPUB
    files = []
    vinyl
      .src [
        "#{build.path}/**"
        "!#{build.path}/**/.*"
        "!#{build.path}/META-INF/*"
        "!#{build.path}/mimetype"
        "!#{build.path}/package.opf"
        "!#{build.path}/subset.pe"
      ]
      .pipe map (file, cb) ->
        files.push path.relative(build.path, file.path)
        cb null, file
      .on \end ->
        ocf = pack do
          files
          spine: for idx from 1 to num-pages => "page#idx.xhtml"
          metadata: require path.resolve build.data, 'metadata.json'
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
function convert src, dst, done
  console.log "#{'convert'magenta} and #{'unzip'magenta} #{rel src}"
  extractor = unzip.Extract path: dst
  extractor.on \close done
  request {
    method: \POST
    uri: 'http://192.168.11.15/sandbox/odpConvert.php'
    #encoding: \binary
  }
    ..form!append \file fs.createReadStream src
    ..pipe extractor

function cp src, dst, done
  unless fs.existsSync src # fail silently
    console.log "#{'not found:'red} #{rel src}"
    return done!
  console.log "#{'cp'magenta} #{rel src} #{rel dst}"
  _cp src, dst, done

function cp-r src, dst, done
  console.log "#{'cp'magenta} -R #{rel src} #{rel dst}"
  _cpr src, dst, { delete-first: on, overwrite: on, confirm: on }, done

gen = path.resolve __dirname, './gen.ls'
function gen-page src, dst, idx, done
  console.log "#{(rel gen)magenta} #{rel src} #idx > #{rel dst}/page#idx.xhtml"
  exec do
    "#gen #{escape path.relative dst, src} #idx > #{escape dst}/page#idx.xhtml"
    cwd: dst
    done

function write dst, file, done
  console.log "#{'write'magenta} #{rel dst}"
  fs.writeFile dst, file, done

function get-codepoints src, done
  console.log "#{'get'magenta} codepoints from #{rel src}"
  src = (escape src)replace '\\*' -> '*'
  exec do
    "cat #src | #{path.resolve __dirname, 'codepoints.ls'}"
    done

function fetch-moedict chars, dst, done
  console.log "#chars | #{'fetch-moedict.ls'magenta} > #{rel dst}"
  exec do
    "echo #chars | #{path.resolve __dirname, 'fetch-moedict.ls'} > #{escape dst}"
    done

function font-subset src, dst, codepoints, done
  base = path.resolve path.dirname(dst), '../'
  script-path = path.resolve base, 'subset.pe'
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
    done

function zip src, dst, done
  console.log "#{'zip'magenta} #{rel dst}"
  exec do
    "zip -9 -rX #{escape dst} ./* --exclude \\*.DS_Store* \\subset.pe \\js/index.js"
    cwd: src
    done

