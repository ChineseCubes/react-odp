React        = require 'react'
DotsDetector = React.createFactory require './react-dots-detector'
Data         = require './CUBE/data'
Book         = React.createFactory require './Book'
Reader       = React.createFactory require './Reader'
ReactVTT     = require 'react-vtt'
require 'react-vtt/dest/ReactVTT.css'
request      = require 'request'

get-mp3 = (filename, done) ->
  err, res, body <- request filename
  if err
    console.warn err
    done mp3: null
  else
    done JSON.parse body

get-vtt = (filename, done) ->
  ReactVTT
    .parse filename, done
    .error -> done null

<- window.requestAnimationFrame
<- $
React.initializeTouchEvents true
# dots per cm
dots = React.render do
  DotsDetector unit: \cm
  $ \#detector .get!0
# read book data
{setup}:mp <- Data.getMasterPage './data/'
data    <- Data.getPresentation mp
segs    <- Data.Segmentations data, setup.path
{ mp3 } <- get-mp3 "#{setup.path}/audio.mp3.json"
vtt     <- get-vtt "#{setup.path}/audio.vtt.json"

$win = $ window

props =
  master-page: mp
  data: data
  segs: segs
  audio: mp3 or "#{setup.path}/audio.mp3"
  vtt: vtt
  dpcm: dots.state.x
  width: $win.width!
  height: $win.height!

if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  props.pages = [RegExp.$1]

reader = React.render do
  Reader props
  $ \#app .get!0

$win.resize ->
  reader.setProps do
    width: $win.width!
    height: $win.height!
