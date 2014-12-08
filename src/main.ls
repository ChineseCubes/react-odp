React        = require 'react'
DotsDetector = React.createFactory require './react-dots-detector'
Data         = require './CUBE/data'
Audio        = require './Logic/Audio'
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

on-stop = -> reader.setProps playing: false
audio = Audio do
  data, vtt, mp3
  -> reader.setProps loading: false # onLoad
  -> reader.setProps playing: true  # onPlay
  ->                                # onEnd
    on-stop!
    page = reader.state.page + 1
    reader.page page
    setTimeout (-> audio.play page), 750
  on-stop                           # onPause

##
# main
$win = $ window

props =
  master-page: mp
  data: data
  segs: segs
  vtt: vtt
  loading: true
  playing: false
  current-time: -> audio.time!
  dpcm: dots.state.x
  width: $win.width!
  height: $win.height!
  onNotify: -> audio.process it

#if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
#  props.pages = [RegExp.$1]

reader = React.render do
  Reader props
  $ \#app .get!0

##
# events
$win.resize ->
  reader.setProps do
    width: $win.width!
    height: $win.height!
