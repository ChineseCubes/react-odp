``#!/usr/bin/env slimerjs``
page = require('webpage').create!
num = phantom.args.0 or 1
url = 'http://0.0.0.0:8080/?' + num

page.onConsoleMessage = (msg) ->
  require! fs
  fs.write 'page' + num + '.xhtml', """
<?xml version="1.0" encoding="utf-8" ?>
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
#msg
</html>
  """
  phantom.exit!

page.open url, (status) ->
  <- page.evaluate
  <- setTimeout _, 2000ms
  dom = (new DOMParser).parseFromString document.body.innerHTML, 'text/html'
  console.log (new XMLSerializer).serializeToString(dom.body).replace(//><//g, '>\n<').replace(/\s*<script [^<]*livereload[^<]*<\/script>\s*/g, '')
