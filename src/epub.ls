React        = require 'react'
DotsDetector = React.createFactory require './react-dots-detector'
Data         = require './CUBE/data'
Audio        = require './Logic/Audio'
Book         = React.createFactory require './Book'
ReactVTT     = require 'react-vtt'
require 'react-vtt/dest/Cue.css'
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
React.initializeTouchEvents true
# dots per cm
dots = React.render do
  DotsDetector unit: \cm
  document.getElementById \detector
# read book data
{setup}:mp <- Data.getMasterPage './data/'
data    <- Data.getPresentation mp
segs    <- Data.Segmentations data, setup.path
{ mp3 } <- get-mp3 "#{setup.path}/audio.mp3.json"
vtt     <- get-vtt "#{setup.path}/audio.vtt.json"

audio = Audio do
  data, vtt, mp3
  -> #onLoad
    book.setProps loading: false
  -> #onPlay
    book.setProps playing: true
  -> # onEnd
    book.setProps playing: false
    localStorage.setItem \autoplay, on
    next = 1 + +localStorage.getItem \page
    location.href = "page#next.xhtml"
    # then goto next page
    # and autoplay
  -> # onPause
    book.setProps playing: false
    localStorage.setItem 'autoplay', off

props =
  master-page: mp
  data: data
  segs: segs
  vtt: vtt
  loading: true
  playing: false
  current-time: -> audio.time!
  dpcm: dots.state.x
  onNotify: ->
    audio.process it

if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  props.pages = [RegExp.$1]
  page = +RegExp.$1
  localStorage.setItem \page, page
  if localStorage.getItem \autoplay
    setTimeout do
      -> audio.play page - 1
      750

book = React.render do
  Book props
  document.getElementById \app

