React = require 'react'

{ div } = React.DOM
{ onClick } = require './utils'

AudioControl = React.createClass do
  displayName: \CUBEBooks.AudioControl
  getDefaultProps: ->
    id: 0
    audio: null
    text: '本頁沒有文字'
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
      ..on \pause @onStop
      ..on \end   @onStop
  componentWillUnmount: ->
    return if not @props.audio
    @props.audio
      ..off \load  @onLoad
      ..off \play  @onPlay
      ..off \pause @onStop
      ..off \end   @onStop
  onLoad: -> @setState loading: false
  onPlay: -> @setState playing: true
  onStop: -> @setState playing: false
  render: ->
    classes = 'audio-control'
    classes += ' playing' if @state.playing
    classes += ' loading' if @state.loading
    div do
      className: classes
      style:
        width:  '100%'
        height: '100%'
      "#onClick": ~>
        | @props.audio
          return if @state.loading
          if not @state.playing
            @props.audio
              #..pos 0, @props.id # not work
              ..stop @props.id # reset pos
              ..play @props.id
          else
            @props.audio.pause! # pause every sprites
        | otherwise
          syn = window.speechSynthesis
          utt = window.SpeechSynthesisUtterance
          u = new utt @props.text
            ..lang = \zh-TW
            ..volume = 1.0
            ..rate = 1.0
          syn.speak u
        @props."#onClick".call this, it

module.exports = AudioControl
