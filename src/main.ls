React        = require 'react'
DotsDetector = React.createFactory require './react-dots-detector'
Data         = require './CUBE/data'
Audio        = require './Logic/Audio'
Book         = React.createFactory require './Book'
Reader       = React.createFactory require './Reader'
ReactVTT     = require 'react-vtt'
require 'react-vtt/dest/ReactVTT.css'
request      = require 'request'

{ select, option } = React.DOM

###
# Here are some helpers.
###
var reader, init-book
$win = $ window
host = 'http://cnl.linode.caasih.net'

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

BookSelector = React.createClass do
  displayName: 'BookSelector'
  getInitialState: ->
    books: []
  componentWillMount: ->
    err, res, body <~ request "#host/books/"
    books = JSON.parse body
    book = Object.keys books .0
    init-book do
      reader
      "#host/books/#book"
      ->
        reader := it
        setTimeout (-> reader.page 0), 0
    @setState books: books
  render: ->
    select do
      className: 'book-selector'
      name: 'book-selector'
      onChange: ~>
        book = it.target.value
        init-book do
          reader
          "#host/books/#book/"
          ->
            reader := it
            setTimeout (-> reader.page 0), 0
      for key of @state.books
        option do
          key: key
          value: key
          key
BookSelector = React.createFactory BookSelector
###
# End of those helpers.
###

<- window.requestAnimationFrame
<- $
React.initializeTouchEvents true

# dots per cm
dots = React.render do
  DotsDetector unit: \cm
  $ \#detector .get!0

selector = React.render do
  BookSelector!
  $ \#selector .get!0

init-book := (reader, uri, done) ->
  { setup }:mp <- Data.getMasterPage uri
  data    <- Data.getPresentation mp
  segs    <- Data.Segmentations data, setup.path
  { mp3 } <- get-mp3 "#{setup.path}/audio.mp3.json"
  vtt     <- get-vtt "#{setup.path}/audio.vtt.json"

  sentences = Data.sentences-of data
  segments  = Data.segments-of data
  parts = for i of sentences
    Data.segment sentences[i], <[我想 擁抱]>
  console
    ..log sentences
    ..log segments
    ..log parts

  on-stop = -> reader.setProps playing: false
  audio = Audio do
    data, vtt, mp3
    -> reader.setProps loading: false # onLoad
    -> reader.setProps playing: true  # onPlay
    ->                                # onEnd
      on-stop!
      if reader.props.autoplay
        page = reader.state.page + 1
        reader.page page
        setTimeout (-> audio.play page), 750
    on-stop                           # onPause

  ##
  # main
  props =
    master-page: mp
    data: data
    segs: segs
    vtt: vtt
    autoplay: off
    loading: true
    playing: false
    current-time: -> audio.time!
    dpcm: dots.state.x
    width: $win.width!
    height: $win.height!
    onNotify: ->
      switch it.action
        | \mode
          switch it.data
            | \glossary
              console.log 'should jump to the glossary page'
            | \read-to-me
              console.log 'autoplay: on'
              reader
                ..setProps autoplay: on
                ..page 1
              audio.play 1
            | \learn-by-myself
              console.log 'autoplay off'
              reader
                ..setProps autoplay: off
                ..page 1
        | _     => audio.process it

  #if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  #  props.pages = [RegExp.$1]

  if reader
    reader.setProps props
  else
    reader = React.render do
      Reader props
      $ \#app .get!0

  done reader

##
# events
$win.resize ->
  reader.setProps do
    width: $win.width!
    height: $win.height!
