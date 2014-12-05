React       = require 'react'

{ div } = React.DOM
{ onClick } = require '../utils'

AudioControl = React.createClass do
  displayName: \CUBE.Book.AudioControl
  getDefaultProps: ->
    loading: false
    playing: false
    "#onClick": ->
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
    classes += ' playing' if @props.playing
    classes += ' loading' if @props.loading
    div do
      className: classes
      style:
        width:  '100%'
        height: '100%'
      "#onClick": ~> @props["#onClick"] ...
      div {} @props.children

module.exports = AudioControl
