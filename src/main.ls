React        = require 'react'
DotsDetector = React.createFactory require './react-dots-detector'
Data         = require './CUBE/data'
Book         = React.createFactory require './Book'
Reader       = React.createFactory require './Reader'
ReactVTT     = require 'react-vtt'
require 'react-vtt/dest/ReactVTT.css'

<- window.requestAnimationFrame
<- $
React.initializeTouchEvents true
# dots per cm
dots = React.render do
  DotsDetector unit: \cm
  $ \#detector .get!0
# read book data
{setup}:mp <- Data.getMasterPage './data/'
data <- Data.getPresentation mp
segs <- Data.Segmentations data, setup.path
vtt  <- ReactVTT.parse "#{setup.path}/audio.vtt.json"

$win = $ window

props =
  master-page: mp
  data: data
  segs: segs
  vtt: vtt
  dpcm: dots.state.x
  width: $win.width!
  height: $win.height!

if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  props
    ..pages = [RegExp.$1]
    ..auto-fit = off

reader = React.render do
  Reader props
  $ \#app .get!0

$win.resize ->
  reader.setProps do
    width: $win.width!
    height: $win.height!
