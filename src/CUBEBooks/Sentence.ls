$ = require 'jquery'
React = require 'react'
API = require './api'
Button = require './Button'
Stroker = require './Stroker'
Word = require './Word'

{ nav, div, i, span, a } = React.DOM
{ onClick } = require './utils'

Sentence = React.createClass do
  displayName: 'CUBE.Sentence'
  getDefaultProps: ->
    data:     null
    image:    ''
    stroke:   on
    sentence: on
  getInitialState: ->
    mode:  'zh_TW'
    focus: null
    undo:  []
  componentWillReceiveProps: (props) ->
    if @props.data?short isnt props.data?short
      @setState @getInitialState!{focus}
      $(@refs.settings.getDOMNode!)height 0
      @refs.stroker?setState words: null
  componentDidMount: ->
    if not @state.focus
      @refs.0?click!
  componentWillUpdate: (props, state) ->
    if @props.data?short is props.data?short
      switch
        | @state.mode isnt state.mode
          console.log 'mode changed'
        | @state.focus is state.focus
          state.focus = null
  componentDidUpdate: (props, state) ->
    if @props.data?short isnt props.data?short
      @setState undo: []
      @refs.0?click!
  toggleMode: ->
    @setState mode: if @state.mode is 'zh_TW' then 'zh_CN' else 'zh_TW'
  toggleSettings: ->
    $settings = $ @refs.settings.getDOMNode!
    $settings.animate height: if $settings.height! isnt 0 then 0 else 48
  undo: !->
    if comp = @state.undo.pop!
      comp
        ..setState cut: false
        ..click!
  undoAll: !->
    while @state.undo.length
      @undo!
  render: ->
    data = @props.data
    words = data?childrenOfDepth(0) or []
    div do
      className: 'playground'
      style:
        background-image: "url('#{@props.image}')"
      div do
        className: 'comp sentence'
        style:
          display: if @props.sentence then 'block' else 'none'
        if @props.stroke then Stroker do
          key: "stroker"
          ref: "stroker"
        for let i, word of words
          id = (word.short / ' ')join '-'
          Word do
            key: "#{i}-#{id}"
            ref: i
            data: word
            mode: @state.mode
            onStroke: (text, close) ~>
              return if not @refs.stroker
              stroker = @refs.stroker
              if stroker.state.hide
                err, data <- API.Talks.get text
                stroker
                  ..onHide = -> close!
                  ..setState do
                    words: text
                    play:  yes
                    hide:  false
                    strokeURI: data?strokeURI!
              else
                close!
                stroker
                  ..onHide = -> close!
                  ..setState do
                    words: null
                    hide: true
            onChildCut:   (comp) ~>
              @state.undo.push comp
              comp.setState do
                pinyin:  off
                meaning: off
              comp.click!
            afterChildCut: (comp) ~>
              comp.refs.0?click!
            onChildClick: (comp) ~>
              @refs.stroker?setState do
                words: null
                hide: true
              if @state.focus is comp
                comp.setState menu: off
                @setState focus: null
              else
                @state.focus?setState do
                  menu:    off
                  pinyin:  off
                  meaning: off
                comp.setState menu: on
                @setState focus: comp
      nav do
        ref: 'settings'
        className: 'navbar'
        style: height: 0
        div do
          className: 'ui borderless menu'
          div do
            className: 'right menu'
            a do
              className: 'item toggle chinese'
              "#onClick": @toggleMode
              if @state.mode is 'zh_TW' then '繁' else '简'
      Button do
        className: "undo #{if not @state.undo.length then 'hidden' else ''}"
        "#onClick": @undo
      div do
        className: 'entry'
        if @state.focus isnt null
          focus = @state.focus.props.data
          * span do
              className: 'ui black label'
              focus.flatten!map(~> it[@state.mode])join ''
            # XXX: hide word classes for now
            #span do
            #  className: 'word-class'
            #  for let i, wc of focus.word-class
            #    div do
            #      key: i
            #      className: 'ui label'
            #      wc
            span do
              className: 'definition'
              focus.definition

module.exports = Sentence
