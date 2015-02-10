$            = require 'jquery'
React        = require 'react'
Data         = require './Data'
DotsDetector = React.createFactory require './DotsDetector'
Book         = React.createFactory require './Book'

{ find } = require 'prelude-ls'

#host = 'http://cnl.linode.caasih.net'
book-uri = 'http://localhost:8081/books/two-tigers/'

<- $
<- window.requestAnimationFrame
React.initializeTouchEvents true

##
# calculate dots per cm by drawing an invisible <div>
dots = React.render do
  DotsDetector unit: \cm
  document.getElementById \detector

{ setup }:mp <- Data.getMasterPage book-uri

if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  page = +RegExp.$1 + 1
  page = setup.total-pages if page > setup.total-pages
else
  page = 1

data <- Data.getPresentation setup.path, [page]

$win = $ try window
dpcm = dots.state.x
scale-to-fit = (width, height) ->
  return 1.0 unless width and height
  ratio = setup.ratio
  px-width  = setup.width  * dpcm
  px-height = setup.height * dpcm
  if width / ratio < height
    then width  / px-width
    else height / px-height

book = React.render do
  Book do
    data: data
    scale: scale-to-fit $win.width!, $win.height!
  document.getElementById \app

$win.resize ->
  <- requestAnimationFrame
  book.setProps scale: scale-to-fit $win.width!, $win.height!

