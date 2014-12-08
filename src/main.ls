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

texts-from-data = (data) ->
  texts = []
  for child in data.children
    if child.name is \page
      page = []
      for child in child.children
        if child.name is \frame
          for child in child.children
            if child.name is \text-box
              for child in child.children
                if child.name is \p
                  for child in child.children
                    if child.name is \span and child.text
                      page.push child.text
      texts.push page
  texts

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

##
# everything about audio
texts = texts-from-data data
audio = try
  Howler.iOSAutoEnable = false
  new Howl urls: [mp3 or "#{setup.path}/audio.mp3"]
sprites = {}
for i, cue of vtt.cues
  bgn = cue.startTime
  end = cue.endTime
  sprites[cue.text] = [bgn * 1000, (end - bgn) * 1000]
audio.sprite sprites
current-text = ''
play = (page-num) ->
  count = 0
  ts = texts[page-num]
  current-text := ts[count]
  :read let
    on-end = ->
      if ++count < ts.length
        current-text := ts[count]
        setTimeout(read, 750)
      else
        current-text := ''
    audio
      ..stop current-text
      ..play current-text
      ..on \end on-end
      ..on \pause -> audio.off \end on-end
current-time = -> (sprites[current-text]?0 or 0) / 1000 + (audio?pos! or 0)

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
  current-time: current-time
  dpcm: dots.state.x
  width: $win.width!
  height: $win.height!
  onNotify: ->
    switch it.action
      | \play => play it.page-num
      | \stop => audio.pause!
      | _     => console.warn "unknown notification: #it"

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

on-stop = -> reader.setProps playing: false
audio
  ..on \load  -> reader.setProps loading: false
  ..on \play  -> reader.setProps playing: true
  ..on \end   on-stop
  ..on \pause on-stop
