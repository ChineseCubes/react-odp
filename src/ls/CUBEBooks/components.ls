{isNaN}      = require 'lodash'
$            = require 'jquery'
React        = require 'react'
Data         = require './data'
zhStrokeData = try require 'zhStrokeData'
{a, div, i, img, nav, span} = React.DOM
onClick = if (try \ontouchstart of window) then \onTouchStart else \onClick

say-it = (text, lang = \en-US) ->
  syn = try window.speechSynthesis
  utt = try window.SpeechSynthesisUtterance
  return if not syn or not utt
  u = new utt text
    ..lang = lang
    ..volume = 1.0
    ..rate = 1.0
  syn.speak u

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

Character = React.createClass do
  displayName: 'CUBE.Character'
  getDefaultProps: ->
    data:   null
    mode:   'zh_TW'
    pinyin: off
  render: ->
    data = @props.data
    actived = if @props.pinyin then 'actived' else ''
    div do
      className: 'comp character'
      div do
        className: "pronounciation #actived"
        span null data.pinyin
      if @props.mode is 'zh_TW'
        div do
          className: 'char zh_TW'
          data.zh_TW
      else
        div do
          className: 'char zh_CN'
          data.zh_CN

UndoCut = React.createClass do
  displayName: 'CUBE.UndoCut'
  getDefaultProps: ->
    actived: no
  render: ->
    actived = if @props.actived then 'actived' else ''
    div do
      className: 'comp undo-cut ui black icon buttons'
      div do
        className: "ui button #actived"
        "#onClick": @props."#onClick"
        i className: 'repeat icon'

{Howler, Howl} = require 'howler'
API = require './api'
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

ActionMenu = React.createClass do
  icon: ->
    | it is \stroke  => \pencil
    | it is \cut     => \cut
    | it is \pinyin  => "volume up"
    | it is \english => \font
    | otherwise      => \question
  displayName: 'CUBE.ActionMenu'
  getDefaultProps: ->
    buttons: <[cut]>
    disabled: [no]
    onChange: -> ...
  getInitialState: ->
    actived = []
    for i of @props.buttons
      actived[i] = false
    actived: actived
  render: ->
    buttons = @props.buttons
    type = if buttons.length is 1 then 'single' else 'multiple'
    div do
      className: "actions #{@props.className}"
      div do
        className: "menu #type"
        div do
          className: 'ui buttons'
          #div do
          #  className: 'ui icon button black listen'
          #  i className: 'icon volume up'
          for let idx, btn of buttons
            actived = if @state.actived[idx] then 'actived' else ''
            disabled = if @props.disabled[idx] then 'disabled' else ''
            div do
              key: "button-#idx"
              className: "ui icon button black #actived #disabled"
              "#onClick": ~>
                it.stopPropagation!
                @setState actived:
                  for i from 0 til @state.actived.length
                    # exclude
                    actived = if i is +idx
                      then !@state.actived[i]
                      else off
                    @props.onChange.call this, it, buttons[i], actived, ~>
                      @state.actived[idx] = off
                      @setState actived: @state.actived
                    actived
              i className: "icon #{@icon btn}"

SettingsButton = React.createClass do
  displayName: 'CUBE.SettingsButton'
  render: ->
    @transferPropsTo i className: 'settings icon'

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
      className: 'strokes'
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
      UndoCut do
        actived: @state.undo.length isnt 0
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

module.exports =
  AudioControl:   AudioControl
  SettingsButton: SettingsButton
  Sentence:       Sentence
