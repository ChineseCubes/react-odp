#!/usr/bin/env lsc
require! {
  jade
  path
  react: React
  'react-vtt': ReactVTT
  xmldom: { DOMParser, XMLSerializer }
  htmltidy: { tidy }
  '../CUBE/data': Data
  './epub/utils': utils
}
Book = React.createFactory require '../Book'



{ filename, argv } = utils.argv!

book = argv.0
pages = Array::slice.call argv, 1
if not book or not pages.length
  console.log "Usage: #filename [book path] [page id] [another id] [more id] ..."
  process.exit 0
# must use relative path
book = path.normalize book



get-vtt = (filename, done) ->
  ReactVTT.parse filename, done

{ setup }:mp <- Data.getMasterPage book
data <- Data.getPresentation mp
segs <- Data.Segmentations data, setup.path
vtt  <- get-vtt "#{setup.path}/audio.vtt.json"

content =
  React.renderToString do
    Book do
      master-page: mp
      data: data
      segs: segs
      vtt:  vtt
      pages: pages
content = (new DOMParser).parseFromString content, 'text/html'
content = (new XMLSerializer).serializeToString content
#content .= replace //<(br.*?)>//g, '<$1/>'

tpl-path = path.resolve __dirname, 'epub/page.jade'
result = jade.renderFile tpl-path, { content }

if yes # beautify!
  err, html <- tidy result, { indent: on }
  throw err if err
  console.log html
else
  console.log result

