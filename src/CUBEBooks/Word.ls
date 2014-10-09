React = require 'react'
Character = require './Character'
ActionMenu = require './ActionMenu'
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
        ActionMenu do
          className: 'menu-cut'
          buttons: <[cut]>
          disabled: [data.children.length is 1]
          onChange: (it, name, actived) ~>
            if actived
              @props
                ..onChildCut this
                ..onChildClick this
            @setState cut: actived
      if @state.menu
        with-hint =
          if @state.pinyin or @state.meaning then 'with-hint' else ''
        ActionMenu do
          className: "menu-learn #with-hint"
          buttons: <[pinyin stroke english]>
          disabled: [no, (data.children.length isnt 1), no]
          onChange: (it, name, actived, close) ~>
            | name is \pinyin
              if actived
                text = data.flatten!map(~> it[@props.mode])join ''
                if not @state.soundURI
                  say-it text, lang @props.mode
                  err, data <~ API.Talks.get text
                  throw err if err
                  @state.soundURI = data.soundURI!
                else try
                  Howler.iOSAutoEnable = false
                  new Howl do
                    autoplay: on
                    urls: [@state.soundURI]
              @setState pinyin: actived
            | name is \stroke and actived
              @props.onStroke(data.flatten!map (.zh_TW) .join(''), close)
            | name is \english
              if actived
                say-it data.short
              @setState meaning: actived
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
