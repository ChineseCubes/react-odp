React = require 'react'
Character = require './Character'
Menu = require './Menu'
API = require './api'

{ div, i, span } = React.DOM
{ Howler, Howl } = require 'howler'
{ onClick, say-it } = require './utils'

Word = React.createClass do
  displayName: 'CUBE.Word'
  getDefaultProps: ->
    data:    null
    mode:    'zh_TW'
    menu:    off
    onStroke:      -> ...
    onChildCut:    -> ...
    afterChildCut: -> ...
    onChildClick:  -> ...
  getInitialState: ->
    menu: @props.menu
    cut:  false
    pinyin:  off
    meaning: off
    soundURI: null
  componentDidUpdate: !(props, state) ->
    if state.cut is false and @state.cut is true
      @props.afterChildCut this
  click: -> @props.onChildClick this
  render: ->
    data = @props.data
    lang = -> switch it
      | \zh_TW => \zh-TW
      | \zh_CN => \zh-CN
    actived = if @state.meaning then 'actived' else ''
    div do
      className: 'comp word'
      "#onClick": ~> @click! unless @state.cut
      if @state.menu
        status = if data.children.length is 1 then 'hidden' else ''
        Menu do
          className: 'menu-cut'
          buttons: ["cut #status"]
          onButtonClick: !(classes) ~>
            [name, status] = classes.split ' '
            return unless name is 'cut'
            unless status is 'hidden'
              @props
                ..onChildCut this
                ..onChildClick this
              @setState cut: true
      if @state.menu
        with-hint =
          if @state.pinyin or @state.meaning then 'with-hint' else ''
        Menu do
          className: "menu-learn #with-hint"
          buttons: <[pinyin stroke english]>
          onButtonClick: (classes) ~>
            # XXX: lets encode statuses in the class for now
            console.log classes
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
              afterChildCut:        ~> @props.afterChildCut it
              onChildClick:         ~> @props.onChildClick it
      div do
        className: "meaning #actived"
        span null data.short

module.exports = Word
