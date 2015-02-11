#!/usr/bin/env lsc
require! {
  jade
  path
  react: React
  rsvp: { Promise }:RSVP
  xmldom: { DOMParser, XMLSerializer }
  htmltidy: { tidy }
  'prelude-ls': { map }
  '../data': Data
  './epub/utils': utils
}
Book = React.createFactory require '../Book'
running-as-script = not module.parent

gen = (book-uri, pages) -> new Promise (resolve, reject) ->
  { setup }:mp <- Data.getMasterPage book-uri
  data <- Data.getPresentation setup.path, pages

  content = React.renderToString Book data: data
  content = (new DOMParser).parseFromString content, 'text/html'
  content = (new XMLSerializer).serializeToString content
  #content .= replace //<(br.*?)>//g, '<$1/>'

  tpl-path = path.resolve __dirname, 'epub/page.jade'
  result = jade.renderFile tpl-path, { content }

  if yes # beautify!
    err, html <- tidy result, { indent: on }
    if err
      then reject err
      else resolve html
  else
    resolve result

if running-as-script
  RSVP.on \error -> console.error it.stack
  { filename, argv } = utils.argv!
  book-uri = argv.0
  pages = Array::slice.call(argv, 1) |> map (-> +it)
  if not book-uri or not pages.length
    console.log "Usage: #filename [book path] [page id] [another id] [more id] ..."
    process.exit 0
  # must use relative path
  gen book-uri, pages .then console.log
else
  module.exports = gen

