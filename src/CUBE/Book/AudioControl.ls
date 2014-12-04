React       = require 'react'

{ div } = React.DOM
{ say-it, onClick } = require '../utils'

AudioControl = React.createClass do
  displayName: \CUBE.Book.AudioControl
  getDefaultProps: ->
    id: 0
    audio: null
    text: '這頁沒有文字'
    onMount: ->
    onLoad: ->
    onPlay: ->
    onEnd: ->
    onPause: ->
    "#onClick": ->
  getInitialState: ->
    loading: true
    playing: false
  componentWillMount: ->
    if not @props.audio
      @state.loading = false
      return
    @props.audio
      ..on \load  @onLoad
      ..on \play  @onPlay
      ..on \end   @onEnd
      ..on \pause @onPause
  componentDidMount: ->
    @props.onMount ...
  componentWillUnmount: ->
    return if not @props.audio
    @props.audio
      ..off \load  @onLoad
      ..off \play  @onPlay
      ..off \end   @onEnd
      ..off \pause @onPause
  onLoad: ->
    @setState loading: false
    @props.onLoad ...
  onPlay: ->
    @setState playing: true
    @props.onPlay ...
  onEnd: ->
    @setState playing: false
    @props.onEnd ...
  onPause: ->
    @setState playing: false
    @props.onPause ...
  play: ->
    if @props.audio
      return if @state.loading
      if not @state.playing
        @props.audio
          #..pos 0, @props.id # not work
          ..stop @props.id # reset pos
          ..play @props.id
      else
        @props.audio.pause! # pause every sprites
    else
      say-it @props.text, \zh-TW
    @props["#onClick"] ...
  render: ->
    classes = 'audio-control'
    classes += ' playing' if @state.playing
    classes += ' loading' if @state.loading
    div do
      className: classes
      style:
        width:  '100%'
        height: '100%'
      "#onClick": @play
      div {} @props.children

module.exports = AudioControl
