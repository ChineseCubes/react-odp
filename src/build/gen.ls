#!/usr/bin/env lsc
require! {
  jade
  path
  react: React
  rsvp: { Promise, all }:RSVP
  xmldom: { DOMParser, XMLSerializer }
  'prelude-ls': { map }
  'pretty-data': { pd }
  '../async': { lift, get-json }
  '../Data': { wrap-presentation, patch-page }
  './epub/utils': utils
}
Book = React.createFactory require '../Book'
running-as-script = not module.parent

gen = lift (pages) -> new Promise (resolve, reject) ->
  data <- wrap-presentation pages .then
  content = React.renderToString Book data: data
  content = (new DOMParser).parseFromString content, 'text/html'
  content = (new XMLSerializer).serializeToString content
  #content .= replace //<(br.*?)>//g, '<$1/>'
  tpl-path = path.resolve __dirname, 'epub/page.jade'
  resolve pd.xml jade.renderFile tpl-path, { content }

if running-as-script
  RSVP.on \error -> console.error it.stack
  { filename, argv } = utils.argv!
  uri = argv.0
  pages = Array::slice.call(argv, 1) |> map (-> +it)
  if not uri or not pages.length
    console.log "Usage: #filename [book path] [page id] [another id] [more id] ..."
    process.exit 0
  pages = pages |> map (-> get-json "#uri/page#it.json") |> all
  gen pages .then console.log
else
  module.exports = gen

