React = require 'react'
API = require './api'
Word = require './Word'
Stroker = require './Stroker'

{ nav, div, i, span, a } = React.DOM
{ onClick } = require './utils'

Sentence = React.createClass do
  displayName: 'CUBE.Book.Sentence'
  getDefaultProps: ->
    data: null
    mode: 'zh_TW'
    onWordCut:   -> ...
    onWordClick: -> ...
  componentWillReceiveProps: (props) ->
    if @props.data?short isnt props.data?short
      @refs.stroker?setState words: null
  render: ->
    data = @props.data
    words = data?childrenOfDepth(0) or []
    @transferPropsTo div do
      className: 'sentence'
      Stroker do
        key: "stroker"
        ref: "stroker"
      for let i, word of words
        id = (word.short / ' ')join '-'
        Word do
          key: "#{i}-#{id}"
          ref: i
          data: word
          mode: @props.mode
          onStroke: (text, close) ~>
            return if not @refs.stroker
            state = do
              words: text
              play:  text isnt null
              hide:  text is null
            stroker = @refs.stroker
            if text
              err, data <- API.Talks.get text
              stroker
                ..onHide = -> close!
                ..setState state <<< strokeURI: data?strokeURI!
            else
              stroker.setState state
          onChildCut: (comp) ~>
            @props.onWordCut.call this, comp
          onChildClick: (comp) ~>
            @refs.stroker?setState do
              words: null
              hide: true
            @props.onWordClick.call this, comp

module.exports = Sentence
