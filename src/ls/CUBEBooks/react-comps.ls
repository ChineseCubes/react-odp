{a, div, nav, span} = React.DOM

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
  render: ->
    data = @props.data
    div do
      className: 'character'
      if @props.mode is 'zh_TW'
        div do
          className: 'zh_TW'
          data.zh_TW
      else
        div do
          className: 'zh_CN'
          data.zh_CN
      div do
        className: 'pronounciation'
        data.pinyin

Word = React.createClass do
  displayName: 'CUBE.Word'
  getDefaultProps: ->
    data: null
    mode: 'zh_TW'
  render: ->
    data = @props.data
    cs = data.flatten!
    div do
      className: 'word'
      div do
        className: 'characters'
        onClick: @props.onClick
        for let i, c of cs
          Character do
            key: i
            data: c
            mode: @props.mode
        div do
          className: 'meaning'
          data.en

Sentence = React.createClass do
  DEPTH:
    sentence:   0
    words:      1
    characters: Infinity
  displayName: 'CUBE.Sentence'
  getDefaultProps: ->
    data: null
    mode: 'zh_TW'
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
  toggleDefinition: ->
    @setState focus: if it is @state.focus then null else it
  render: ->
    data = @props.data
    div do
      null
      nav do
        className: 'navbar'
        div do
          className: 'ui borderless menu'
          div do
            className: 'right menu'
            @renderDepthButton 'sentence'
            @renderDepthButton 'words'
            @renderDepthButton 'characters'
      #XXX: who decide the depth?
      for let i, word of data.childrenOfDepth @state.depth
        Word do
          key: i
          data: word
          mode: @props.mode
          onClick: ~> @toggleDefinition word
      if @state.focus
        focus = @state.focus
        div do
          className: 'entry'
          span do
            className: 'ui black small label'
            (for c in focus.flatten! => c[@props.mode])join ''
          span do
            className: 'word-class'
            for let i, wc of focus.word-class
              div do
                key: i
                className: 'ui small label'
                wc
          span do
            className: 'definition'
            focus.definition

(this.CUBEBooks ?= {}) <<< do
  AudioControl: AudioControl
  Character: Character
  Word: Word
  Sentence: Sentence

