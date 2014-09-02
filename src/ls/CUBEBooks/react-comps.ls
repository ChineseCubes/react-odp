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
        for let i, c of cs
          Character do
            key: i
            data: c
            mode: @props.mode
        div do
          className: 'meaning'
          data.en
      div do
        className: 'entry'
        span do
          className: 'ui black small label'
          (for c in cs => c[@props.mode])join ''
        span do
          className: 'word-class'
          for let i, wc of data.word-class
            div do
              key: i
              className: 'ui small label'
              wc
        span do
          className: 'definition'
          data.definition

Sentence = React.createClass do
  displayName: 'CUBE.Sentence'
  getDefaultProps: ->
    data: null
    mode: 'zh_TW'
  getInitialState: ->
    sentence:   'active'
    words:      ''
    characters: ''
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
            a do
              className: "item sentence #{@state.sentence}"
              onClick: ~>
                @setState do
                  sentence:   'active'
                  words:      ''
                  characters: ''
              'sentence'
            a do
              className: "item words #{@state.words}"
              onClick: ~>
                @setState do
                  sentence:   ''
                  words:      'active'
                  characters: ''
              'words'
            a do
              className: "item characters #{@state.characters}"
              onClick: ~>
                @setState do
                  sentence:   ''
                  words:      ''
                  characters: 'active'
              'characters'
      if @state.sentence is 'active'
        Word {} <<< @props
      else if @state.words is 'active'
        #XXX: who decide the depth?
        for let i, word of data.childrenOfDepth 1
          Word do
            key: i
            data: word
            mode: @props.mode
      else if @state.characters is 'active'
        for let i, word of data.leafs!
          Word do
            key: i
            data: word
            mode: @props.mode

(this.CUBEBooks ?= {}) <<< do
  AudioControl: AudioControl
  Character: Character
  Word: Word
  Sentence: Sentence

