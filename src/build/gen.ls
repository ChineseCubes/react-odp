#!/usr/bin/env lsc
React    = require 'react'
ReactVTT = require 'react-vtt'
Data     = require '../CUBE/data'
Book     = require '../Book'

path = process.argv.2
pages = Array::slice.call process.argv, 3
if not path or not pages.length
  {1:filename} = /.*\/(.*)/exec process.argv.1
  console.log "Usage: ./#filename [book path] [page id] [another id] [more id] ..."
  process.exit 0

{setup}:mp <- Data.getMasterPage path
data <- Data.getPresentation mp
segs <- Data.Segmentations data, setup.path
vtt  <- ReactVTT.parse "#{setup.path}/audio.vtt.json"

content =
  React.renderComponentToString do
    Book do
      master-page: mp
      data: data
      segs: segs
      vtt:  vtt
      pages: pages
      auto-fit: off

{DOMParser, XMLSerializer} = require 'xmldom'
content = (new DOMParser).parseFromString content, 'text/html'
content = (new XMLSerializer).serializeToString content
#content .= replace //<(br.*?)>//g, '<$1/>'
content .= replace //><//g, '>\n<'

console.log """<?xml version="1.0" encoding="utf-8" ?>
<html lang="zh-Hant" xml:lang="zh-Hant" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=1024, height=768"/>
<meta charset="utf-8" />
<style>
@-viewport { width: 1024px; height: 768px; }
.draw.frame:nth-child(4) { display: none !important }
.draw.frame:nth-child(5) { left: 1cm !important; top: 0.5cm !important; }
</style>
<link rel="stylesheet" type="text/css" href="./css/reset.css" />
<link rel="stylesheet" type="text/css" href="./css/vendor.css" />
<link rel="stylesheet" type="text/css" href="./css/style.css" />
</head>
<body>
<div id="detector"></div>
<div id="app">
#content
</div>
<script src="./js/vendor.js"></script>
<script src="./js/jquery.address.js"></script>
<script src="./js/q.min.js"></script>
<script src="./js/sax.js"></script>
<script src="./js/string.js"></script>
<script src="./js/loaders.js"></script>
<script src="./js/sprite.js"></script>
<script src="./js/sprite-stroker.js"></script>
<script src="./js/build.js"></script>
</body>
</html>
"""
