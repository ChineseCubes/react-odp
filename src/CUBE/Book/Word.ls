React = require 'react'
Character = React.createFactory require './Character'
Popup = React.createFactory require '../UI/Popup'
Menu= React.createFactory require '../UI/Menu'
API = require '../api'
Data = require '../data'

{ div, i, span } = React.DOM
{ Howler, Howl } = require 'howler'
{ onClick, say-it } = require '../utils'

punctuations = Object.keys Data.punctuations .join ''

Word = React.createClass do
  displayName: 'CUBE.Book.Word'
  getDefaultProps: ->
    data:    null
    mode:    'zh-TW'
    menu:    off
    onStroke:      -> ...
    onChildCut:    -> ...
    onChildClick:  -> ...
  getInitialState: ->
    menu: @props.menu
    cut:  false
    pinyin:  off
    stroke:  off
    meaning: off
    soundURI: null
  componentDidUpdate: !(props, state) ->
    if state.cut is false and @state.cut is true
      @props.onChildCut this
    if @state.pinyin
      say-it do
        @props.data.toString @props.mode
        @props.mode
    if state.stroke isnt @state.stroke
      @props.onStroke do
        if @state.stroke
          then @props.data.toString @props.mode
          else null
        ~> # off switch for parent component
          @setState do
            pinyin:  off
            stroke:  off
            meaning: off
    if @state.meaning
      say-it @props.data.short
  click: -> @props.onChildClick this
  render: ->
    data = @props.data
    meaning-status = unless @state.meaning then 'hidden' else ''
    div do
      className: 'word'
      "#onClick": ~> @click! unless @state.cut
      if @state.menu
        menu-status =
          if data.children.length is 1 then 'hidden' else ''
        Menu do
          className: 'menu-cut'
          buttons: ["cut #menu-status"]
          onButtonClick: !(classes) ~>
            [name, status] = classes.split ' '
            return unless name is 'cut'
            unless status is 'hidden'
              @props.onChildClick this
              @setState cut: true
      if @state.menu
        with-hint =
          if @state.pinyin or @state.meaning then 'with-hint' else ''
        pinyin = if @state.pinyin then 'pinyin actived' else 'pinyin'
        pinyin += ' hidden' if data.isLeaf! and data.children.0.pinyin.length is 0
        stroke = if @state.stroke then 'stroke actived' else 'stroke'
        stroke += ' hidden' if not data.isLeaf!
        stroke += ' hidden' if data.toString(@props.mode) in punctuations
        english = if @state.meaning then 'english actived' else 'english'
        english += ' hidden' if data.short.length is 0
        Menu do
          className: "menu-learn #with-hint"
          buttons: [pinyin , stroke, english]
          onButtonClick: (classes) ~>
            # XXX: lets encode statuses in the class for now
            [name, status] = classes.split ' '
            if name is 'pinyin'
              @setState do
                pinyin:  !@state.pinyin
                stroke:  off
                meaning: off
            else if name is 'stroke'
              @setState do
                pinyin:  off
                stroke:  !@state.stroke
                meaning: off
            else if name is 'english'
              @setState do
                pinyin:  off
                stroke:  off
                meaning: !@state.meaning
      div do
        className: 'characters'
        if not @state.cut
          for let i, c of data.flatten!
            Character do
              key: i
              data: c
              mode: @props.mode
              pinyin: @state.pinyin
        else
          for let i, c of data.children
            Word do
              key: "#{i}-#{c.short}"
              ref: i
              data: c
              mode: @props.mode
              onStroke: (it, close) ~> @props.onStroke it, close
              onChildCut:           ~> @props.onChildCut it
              onChildClick:         ~> @props.onChildClick it
      Popup do
        className: "up meaning #meaning-status"
        data.short

module.exports = Word
