require! {
  mime
  moment
  xmlbuilder: { create }
  'prelude-ls': { obj-to-pairs, each }
}

metadata-elements = <[cover-image creator date description format identifier language publisher rights title type]>
metadata = ->
  ele = @ele 'metadata', { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/' }
  it
  |> obj-to-pairs
  |> each ([k, v]) !~>
    | not v?length
      console.warn "#k are empty."
    | k is 'contributors'
      for i, contrib of v
        if contrib?length
          ele.nod 'dc:contributor', { id: "contrib#i" }, contrib
    | k is 'cover-image'
      ele.nod 'meta', { name: k, content: 'cover-id' }
    | k.match /^rendition:/
      ele.nod 'meta', { property: k }, v
    | otherwise
      console.warn "#k may not be a necessary element." unless k in metadata-elements
      ele.nod "dc:#k", { id: k }, v
  ele
    ..nod 'meta', { property: 'dcterms:modified' }, moment!format(\YYYY-MM-DDThh:mm:ss) + \Z
    # XXX: orientation should be configurable
    ..nod 'meta', { property: 'rendition:orientation' }, 'landscape'
  this

files-with-id = ->
  for file in it | file is /^(.*)(\.\w+)$/
    { $1: base, $2: ext } = RegExp
    id: file.replace /\W+/g, \-
    path: file
    base: base
    ext: ext

manifest = ->
  ele = @ele 'manifest'
  for file in files-with-id it
    props =
      href: file.path
      id: file.id
      'media-type': mime.lookup file.ext
    if /TOC\.xhtml$/exec file.path
      props <<< properties: 'nav'
    else if /\.xhtml$/exec file.path
      props <<< properties: 'scripted'
    ele.nod 'item', props
  this

spine = ->
  ele = @ele 'spine', { 'page-progression-direction': 'ltr' }
  for file in files-with-id it
    ele.nod do
      'itemref'
      idref: file.id
      linear: 'yes'
  this

pack = (files, options) ->
  { spine: backbone, metadata: meta } = options
  xml = create 'package', encoding: 'UTF-8'
    .att 'xmlns', 'http://www.idpf.org/2007/opf'
    .att 'version', '3.0'
    .att 'xml:lang', 'en'
    .att 'unique-identifier', 'identifier'
    .att 'prefix', 'rendition: http://www.idpf.org/vocab/rendition/#'
  (xml <<< { metadata, manifest, spine })
    .metadata meta
    .manifest files
    .spine backbone
    .end pretty: on

module.exports = { pack }
