{isNaN} = _
{a, audio, source, div, i, nav, span} = React.DOM

RangedAudio = React.createClass do
  displayName: \CUBEBooks.RangedAudio
  getDefaultProps: ->
    src: ''
  getInitialState: ->
    duration: 0
  componentDidMount: ->
    @state.duration = @refs.audio.getDOMNode!duration
  playRange: ({start = 0, end = @state.duration}) ->
    audio = @refs.audio.getDOMNode!
    do-it = ->
      if @onTimeUpdated
        audio.removeEventListener \timeupdate @onTimeUpdated
      @onTimeUpdated = ->
        console.log end
        if audio.currentTime >= end
          audio
            ..pause!
            ..removeEventListener \timeupdate @onTimeUpdated
          @onTimeUpdated = null
      audio
        ..currentTime = start
        ..play!
        ..addEventListener \timeupdate @onTimeUpdated
    if audio.readyState is 4_HAVE_ENOUGH_DATA
      do-it!
    else
      audio.addEventListener \canplay do-it
  render: ->
    @transferPropsTo audio do
      ref: \audio
      source src: @props.src

AudioControl = React.createClass do
  displayName: \CUBEBooks.AudioControl
  getDefaultProps: ->
    audio: null
    range:
      start: 0
      end:   0
  getInitialState: ->
    playing: false
  componentWillMount: ->
    @props.audio?getDOMNode!
      ..pause!
      ..addEventListener "play"  @onChange
      ..addEventListener "pause" @onChange
      ..addEventListener "ended" @onChange
  componentWillUnmount: ->
    @props.audio?getDOMNode!
      ..removeEventListener "play"  @onChange
      ..removeEventListener "pause" @onChange
      ..removeEventListener "ended" @onChange
  time: ->
    @props.audio?getDOMNode.currentTime or 0
  onChange: ->
    @setState playing: not @props.audio?getDOMNode!paused
  render: ->
    div do
      className: "audio-control#{if @state.playing then ' playing' else ''}"
      style:
        width:  '100%'
        height: '100%'
      onClick: ~>
        audio = @props.audio?getDOMNode!
        if not audio.paused
          audio.pause!
        else
          @props.audio?playRange @props.range

Character = React.createClass do
  displayName: 'CUBE.Character'
  getDefaultProps: ->
    data:   null
    mode:   'zh_TW'
    pinyin: off
  render: ->
    data = @props.data
    div do
      className: 'comp character'
      div do
        className: 'pronounciation'
        if @props.pinyin then data.pinyin else ''
      if @props.mode is 'zh_TW'
        div do
          className: 'char zh_TW'
          data.zh_TW
      else
        div do
          className: 'char zh_CN'
          data.zh_CN

Word = React.createClass do
  displayName: 'CUBE.Word'
  getDefaultProps: ->
    data:    null
    mode:    'zh_TW'
    pinyin:  off
    meaning: off
    menu:    off
  render: ->
    data = @props.data
    cs = data.flatten!
    div do
      className: 'comp word'
      if @props.menu
        ActionMenu onClick: ~> @props.onMenuClick it
      div do
        className: 'characters'
        onClick: @props.onClick
        for let i, c of cs
          Character do
            key: i
            data: c
            mode: @props.mode
            pinyin: @props.pinyin
      div do
        className: 'meaning'
        if @props.meaning then data.short else ''

ActionMenu = React.createClass do
  displayName: 'CUBE.ActionMenu'
  render: ->
    div do
      className: 'actions'
      div do
        className: 'menu multiple'
        div do
          className: 'ui buttons'
          #div do
          #  className: 'ui icon button black listen'
          #  i className: 'icon volume up'
          @transferPropsTo div do
            className: 'ui icon button black write'
            i className: 'icon pencil'
          div do
            className: 'ui icon button black split'
            i className: 'icon cut'

SettingsButton = React.createClass do
  displayName: 'CUBE.SettingsButton'
  render: ->
    @transferPropsTo i className: 'settings icon'

Stroker = React.createClass do
  displayName: 'ZhStrokeData.SpriteStroker'
  getDefaultProps: ->
    path: '../../strokes/'
    words: '萌'
  reset: (props) ->
    props.words .= replace /，|。|？|『|』|「|」|：/g -> ''
    @stroker =
      new zh-stroke-data.SpriteStroker props.words, props.path
    console.log @stroker
    $container = $ @refs.container.getDOMNode!
    $container
      .empty!
      .append @stroker.dom-elemennt
  play:  -> @stroker.play!
  pause: -> @stroker.pause it
  componentDidMount: -> @reset @props
  componentWillReceiveProps: @reset
  render: ->
    div do
      ref: 'container'
      className: 'strokes'

Sentence = React.createClass do
  DEPTH:
    sentence:   0
    words:      1
    characters: Infinity
  displayName: 'CUBE.Sentence'
  getDefaultProps: ->
    data:    null
    mode:    'zh_TW'
    pinyin:  off
    meaning: off
  getInitialState: ->
    pinyin: @props.pinyin
    meaning: @props.meaning
    focus: 0
    depth: 0
  componentWillReceiveProps: (props) ->
    if @props.data.short isnt props.data.short
      @setState @getInitialState!{focus, depth}
      $(@refs.settings.getDOMNode!)height 0
  componentWillUpdate: (props, state) ->
    if @props.data.short is props.data.short
      if @state.depth isnt state.depth
        state.focus = if state.depth is 0 then 0 else null
      else if @state.focus is state.focus
        state.focus = null
  renderDepthButton: (name) ->
    actived = @state.depth is @DEPTH[name]
    a do
      className: "item #name #{if actived then 'active' else ''}"
      onClick: ~>
        @setState depth: @DEPTH[name]
      name
  toggleMode: ->
    @setProps mode: if @props.mode is 'zh_TW' then 'zh_CN' else 'zh_TW'
  toggleSettings: ->
    $settings = $ @refs.settings.getDOMNode!
    $settings.animate height: if $settings.height! isnt 0 then 0 else 48
  render: ->
    data = @props.data
    words = data.childrenOfDepth @state.depth
    div do
      className: 'playground'
      div do
        className: 'comp sentence'
        div className: 'aligner'
        #XXX: who decide the depth?
        for let i, word of words
          Word do
            key: i
            ref: i
            data: word
            mode: @props.mode
            pinyin: @state.pinyin
            meaning: @state.depth isnt 0 and @state.meaning
            menu: @state.focus is +i
            onClick: ~> @setState focus: +i
            onMenuClick: ~> @refs.stroker.play!
        Stroker ref: 'stroker'
      nav do
        ref: 'settings'
        className: 'navbar'
        style: height: 0
        div do
          className: 'ui borderless menu'
          div do
            className: 'right menu'
            @renderDepthButton 'sentence'
            @renderDepthButton 'words'
            @renderDepthButton 'characters'
            a do
              className: 'item toggle chinese'
              onClick: @toggleMode
              if @props.mode is 'zh_TW' then 'T' else 'S'
      div do
        className: 'entry'
        if @state.focus isnt null
          focus = words[@state.focus]
          * span do
              className: 'ui black label'
              (for c in focus.flatten! => c[@props.mode])join ''
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
        nav do
          className: 'display-mode'
          span className: 'aligner'
          a do
            className: "ui toggle basic button chinese #{if @state.pinyin then \active else ''}"
            onClick: ~> @setState pinyin: !@state.pinyin
            \拼
          if @state.depth isnt 0 then a do
            className: "ui toggle basic button chinese #{if @state.meaning then \active else ''}"
            onClick: ~> @setState meaning: !@state.meaning
            \En

(this.CUBEBooks ?= {}) <<< do
  RangedAudio:  RangedAudio
  AudioControl: AudioControl
  SettingsButton: SettingsButton
  Character: Character
  Word:      Word
  Sentence:  Sentence

