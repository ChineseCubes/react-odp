#!/usr/bin/env lsc
React = require \react
Data  = require '../CUBEBooks/data'
Book  = require '../book'

pages = Array::slice.call process.argv, 2
if not pages.length
  {1:filename} = /.*\/(.*)/exec process.argv.1
  console.log "Usage: ./#filename [page id] [another id] [more id] ..."
  process.exit 0

{setup}:mp <- Data.getMasterPage '../../../LRRH/'
data <- Data.getPresentation mp
segs <- Data.Segmentations data, setup.path
#vtt  <- ReactVTT.parse "#{setup.path}/audio.vtt"

console.log do
  React.renderComponentToString do
    Book do
      master-page: mp
      data: data
      segs: segs
      #vtt: vtt
      pages: pages
      auto-fit: off
