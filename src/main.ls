React        = require 'react'
DotsDetector = React.createFactory require './react-dots-detector'
Data         = require './CUBE/data'
Audio        = require './Logic/Audio'
Book         = React.createFactory require './Book'
Reader       = React.createFactory require './Reader'
ReactVTT     = require 'react-vtt'
require 'react-vtt/dest/Cue.css'
request      = require 'request'

{ select, option } = React.DOM

###
# Here are some helpers.
###
var reader, init-book
$win = $ window
#host = 'http://cnl.linode.caasih.net'
host = 'http://localhost:8081'

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
    alias = books.0.alias
    init-book do
      reader
      "#host/books/#alias/"
      ->
        reader := it
        setTimeout (-> reader.page 0), 0
    @setState books: books
  render: ->
    select do
      className: 'book-selector'
      name: 'book-selector'
      onChange: ~>
        alias = it.target.value
        init-book do
          reader
          "#host/books/#alias/"
          ->
            reader := it
            setTimeout (-> reader.page 0), 0
      for book in @state.books
        option do
          key: book.id
          value: book.alias
          book.title
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
    (time) ->                         # onUpdate
      reader.setProps current-time: time

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
    current-time: 0
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
        | \cca
          reader.setProps text: it.text
        | otherwise
          audio.process it

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
