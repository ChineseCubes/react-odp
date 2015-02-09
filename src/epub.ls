React        = require 'react'
DotsDetector = React.createFactory require './react-dots-detector'
Data         = require './CUBE/data'
Audio        = require './Logic/Audio'
Storage      = require './Logic/Storage'
Book         = React.createFactory require './Book'
ReactVTT     = require 'react-vtt'
require 'react-vtt/dest/Cue.css'
request      = require 'request'
do require './sandbox'

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
{ setup }:mp <- Data.getMasterPage './data/'
# parse location
pages = [1 to setup.total-pages];
if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  page = +RegExp.$1
  pages = [page]
  Storage.save \page, page
  Storage.load \autoplay .then (autoplay) ->
    if autoplay
      setTimeout do
        -> audio.play page - 1
        750
data    <- Data.getPresentation setup.path, pages
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
    Storage.load \autoplay .then (autoplay) ->
      if autoplay
        Storage.load \page .then (page) ->
          next = 1 + page
          Storage.save \page, next .then ->
            location.href = "page#next.xhtml"
  -> # onPause
    book.setProps playing: false
    Storage.save \autoplay off
  (time) ->
    book.setProps current-time: time

props =
  master-page: mp
  data: data
  segs: segs
  vtt: vtt
  loading: true
  playing: false
  current-time: 0
  pages: pages
  dpcm: dots.state.x
  onNotify: ->
    switch it.action
      | \mode
        switch it.data
          | \glossary
            console.log 'should jump to glossary'
          | \read-to-me
            Storage.save \autoplay on .then ->
              location.href = 'page2.xhtml'
          | \learn-by-myself
            Storage.save \autoplay off .then ->
              location.href = 'page2.xhtml'
      | \cca
        if it.text.length
          Storage.save \autoplay off
        book.setProps text: it.text
      | otherwise
        audio.process it


book = React.render do
  Book props
  document.getElementById \app

