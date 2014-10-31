React        = require 'react'
DotsDetector = React.createFactory require './react-dots-detector'
Data         = require './CUBE/data'
Book         = React.createFactory require './Book'
ReactVTT     = require 'react-vtt'
require 'react-vtt/dest/ReactVTT.css'

<- window.requestAnimationFrame
React.initializeTouchEvents true
# dots per cm
dots = React.render do
  DotsDetector unit: \cm
  document.getElementById \detector
# read book data
{setup}:mp <- Data.getMasterPage './data/'
data <- Data.getPresentation mp
segs <- Data.Segmentations data, setup.path
vtt  <- ReactVTT.parse "#{setup.path}/audio.vtt.json"

props =
  master-page: mp
  data: data
  segs: segs
  vtt: vtt
  dpcm: dots.state.x

if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  props.pages = [RegExp.$1]

React.render do
  Book props
  document.getElementById \app

