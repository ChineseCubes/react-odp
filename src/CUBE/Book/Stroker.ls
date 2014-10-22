$ = require 'jquery'
React = require 'react'
zhStrokeData = try require 'zhStrokeData'
Data = require '../data'

{ div } = React.DOM
{ onClick } = require '../utils'

Stroker = React.createClass do
  displayName: 'ZhStrokeData.SpriteStroker'
  getDefaultProps: ->
    path: './strokes/'
  getInitialState: ->
    play: no
    hide: true
    words: null
    stroker: null
    strokeURI: null
  componentWillUpdate: (props, state) ->
    return if not state.words or @props.fallback
    punc = new RegExp Object.keys(Data.punctuations)join('|'), \g
    state.words .= replace punc, ''
    if @state.hide isnt state.hide and state.hide is true
      @onHide.call this
  componentDidUpdate: (old-props, old-state) ->
    $container = $ @refs.container.getDOMNode!
    $container.empty!
    return if not @state.words or
              @state.words.length is 0 or
              @state.strokeURI
    if not @state.stroker or old-state.words isnt @state.words
      @state.stroker =
        new zh-stroke-data.SpriteStroker do
          @state.words
          url:    @props.path
          speed:  5000
          width:  215
          height: 215
    $container.append @state.stroker.dom-element
    if @state.play
      @state.play = no
      @state.stroker
        #..fastSeek 0 # FIXME
        ..play!
  onHide: -> ...
  render: ->
    div do
      className: 'stroker'
      style:
        display: if not @state.hide then 'block' else 'none'
      "#onClick": ~> @setState hide: true
      if not @state.strokeURI
        div className: 'grid'
      else
        div do
          className: 'fallback'
          style:
            background-image: "url(#{@state.strokeURI}?#{Date.now!})"
      div do
        ref: 'container'

module.exports = Stroker
