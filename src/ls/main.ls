React        = require 'react'
DotsDetector = require './react-dots-detector'
Data         = require './CUBEBooks/data'
API          = require './CUBEBooks/api'
Book         = require './book'
ReactVTT     = require 'react-vtt'

log = -> try window.console.log it
do
  err, ai <- API.Talks.get '愛'
  log err or ai
  err, g <- ai?getStroke
  log err or g
  err, s <- ai?getSound
  log err or s
do
  err, ai <- API.Talks.get '我愛你'
  log err or ai
  err, s <- ai?getSound
  log err or s

<- window.requestAnimationFrame
<- $
React.initializeTouchEvents true
# dots per cm
dots = React.renderComponent do
  DotsDetector unit: \cm
  $ \#detector .get!0
# read book data
{setup}:mp <- Data.getMasterPage './LRRH/'
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
  props
    ..pages = [RegExp.$1]
    ..auto-fit = off

React.renderComponent do
  Book props
  $ \#app .get!0

