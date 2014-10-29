require! {
  xmlbuilder: { create }
  lodash: { mapValues }
  moment
  mime
}

metadata-elements = <[contributor coverage creator date description format identifier language publisher relation rights source subject title type]>
metadata = ->
  ele = @ele 'metadata', { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/' }
  mapValues it, (v, k) !~>
    | k is 'contributors'
      for i, contrib of v
        ele.nod 'dc:contributor', { id: "contrib#i" }, contrib
    | otherwise
      console.warn "#k is not a valid element." unless k in metadata-elements
      ele.nod "dc:#k", { id: k }, v
  ele
    ..nod 'meta', { property: 'dcterms:modified' }, moment!toISOString!
    ..nod 'meta', { property: 'rendition:layout' }, 'pre-paginated'
    # XXX: orientation should be configurable
    ..nod 'meta', { property: 'rendition:orientation' }, 'landscape'
    ..nod 'meta', { property: 'rendition:spread' }, 'none'
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
    ele.nod do
      'item'
      href: file.path
      id: file.id
      'media-type': mime.lookup file.ext
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
