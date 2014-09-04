{a, div, i, nav, span} = React.DOM

AudioControl = React.createClass do
  displayName: \CUBEBooks.AudioControl
  getDefaultProps: ->
    element: null
  getInitialState: ->
    playing: false
  componentWillMount: ->
    @props.element
      ..pause!
      ..addEventListener "play"  @onChange
      ..addEventListener "pause" @onChange
      ..addEventListener "ended" @onChange
  componentWillUnmount: ->
    @props.element
      ..removeEventListener "play"  @onChange
      ..removeEventListener "pause" @onChange
      ..removeEventListener "ended" @onChange
  time: ->
    @props.element?currentTime or 0
  toggle: ->
    e = @props.element
    if e.paused then e.play! else e.pause!
  onChange: ->
    @setState playing: not @props.element.paused
  render: ->
    div do
      className: "audio-control#{if @state.playing then ' playing' else ''}"
      style:
        width:  '100%'
        height: '100%'
      onClick: @toggle

Character = React.createClass do
  displayName: 'CUBE.Character'
  getDefaultProps: ->
    data: null
    mode: 'zh_TW'
    pinyin: false
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
    data: null
    mode: 'zh_TW'
    pinyin: false
    meaning: false
  render: ->
    data = @props.data
    cs = data.flatten!
    div do
      className: 'comp word'
      ActionMenu!
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
        if @props.meaning then data.en else ''

ActionMenu = React.createClass do
  displayName: 'CUBE.ActionMenu'
  render: ->
    div do
      className: 'actions'
      div do
        className: 'menu multiple'
        div do
          className: 'ui buttons'
          div do
            className: 'ui icon button black listen'
            i className: 'icon volume up'
          div do
            className: 'ui icon button black write'
            i className: 'icon pencil'
          div do
            className: 'ui icon button black split'
            i className: 'icon cut'

Sentence = React.createClass do
  DEPTH:
    sentence:   0
    words:      1
    characters: Infinity
  displayName: 'CUBE.Sentence'
  getDefaultProps: ->
    data: null
    mode: 'zh_TW'
    pinyin: false
    meaning: false
  getInitialState: ->
    focus: null
    depth: 0
  componentWillReceiveProps: (props) ->
    if @props.data.en isnt props.data.en
      @setState @getInitialState!
  renderDepthButton: (name) ->
    actived = @state.depth is @DEPTH[name]
    a do
      className: "item #name #{if actived then 'active' else ''}"
      onClick: ~> @setState depth: @DEPTH[name]
      name
  toggleMode: ->
    @setProps mode: if @props.mode is 'zh_TW' then 'zh_CN' else 'zh_TW'
  toggleDefinition: ->
    @setState focus: if it is @state.focus then null else it
  render: ->
    data = @props.data
    div do
      className: 'playground'
      nav do
        className: 'navbar'
        style: display: \none
        div do
          className: 'ui borderless menu'
          div do
            className: 'left menu'
            a do
              className: 'item toggle chinese'
              onClick: ~> @setProps pinyin: !@props.pinyin
              \Pinyin
            a do
              className: 'item toggle chinese'
              onClick: ~> @setProps meaning: !@props.meaning
              \English
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
        className: 'comp sentence'
        div className: 'aligner'
        #XXX: who decide the depth?
        for let i, word of data.childrenOfDepth @state.depth
          Word do
            key: i
            data: word
            mode: @props.mode
            pinyin: @props.pinyin
            meaning: @props.meaning
            onClick: ~> @toggleDefinition word
      div do
        className: 'entry'
        if @state.focus
          focus = @state.focus
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

(this.CUBEBooks ?= {}) <<< do
  AudioControl: AudioControl
  Character: Character
  Word: Word
  Sentence: Sentence

