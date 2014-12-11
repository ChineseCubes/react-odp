$ = require 'jquery'
React = require 'react'
Button = React.createFactory require '../UI/Button'
Sentence = React.createFactory require './Sentence'
Settings = React.createFactory require './Settings'
Definition = React.createFactory require './Definition'

{ nav, div, i, span, a } = React.DOM
{ onClick } = require '../utils'

Playground = React.createClass do
  displayName: 'CUBE.Book.Playground'
  getDefaultProps: ->
    data:     null
    image:    ''
    sentence: on
  getInitialState: ->
    mode:  'zh-CN'
    focus: null
    undo:  []
  componentWillReceiveProps: (props) ->
    if @props.data?short isnt props.data?short
      #@props.data?log-all!
      @undoAll!
      @setState @getInitialState!{focus}
      $(@refs.settings.getDOMNode!)height 0
  componentWillUpdate: (props, state) ->
    if @props.data?short is props.data?short
      if @state.mode isnt state.mode
        console.log 'mode will change'
  componentDidUpdate: (props, state) ->
    if @props.data?short isnt props.data?short
      @refs.sentence.refs.0?click!
    if @state.focus
      @state.focus.setState menu: on
  toggleMode: ->
    @setState mode: if @state.mode is 'zh-TW' then 'zh-CN' else 'zh-TW'
  toggleSettings: ->
    $settings = $ @refs.settings.getDOMNode!
    $settings.animate height: if $settings.height! isnt 0 then 0 else 48
  undo: !->
    if comp = @state.undo.pop!
      comp
        ..setState cut: false
        ..click!
  undoAll: !->
    for comp in @state.undo
      comp.setState cut: false
    @setState undo: []
  render: ->
    data = @props.data
    words = data?childrenOfDepth(0) or []
    div do
      className: 'playground'
      style:
        background-image: "url('#{@props.image}')"
      Sentence do
        ref: 'sentence'
        className: if @props.sentence then '' else 'hidden'
        data: data
        mode: @state.mode
        focus: @state.focus
        onWordCut: ~>
          @state.undo.push it
          it.refs.0.click!
        onWordClick: ~>
          @state.focus?setState do
            menu:    off
            pinyin:  off
            stroke:  off
            meaning: off
          @setState focus: if @state.focus is it then null else it
      Settings do
        ref: 'settings'
        style:
          height: 0
        mode: @state.mode
        onModeClick: @toggleMode
      Button do
        className: "undo #{if not @state.undo.length then 'hidden' else ''}"
        "#onClick": @undo
      Definition do
        if @state.focus isnt null
          focus = @state.focus.props.data
          word: focus.flatten!map(~> it[@state.mode])join ''
          definition: focus.definition
        else
          word: ''
          definition: ''

module.exports = Playground
