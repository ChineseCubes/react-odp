{div} = React.DOM

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
  render: ->
    data = @props.data
    div do
      className: 'character'
      div className: 'zh_TW' data.zh_TW
      div className: 'zh_CN' data.zh_TW
      div className: 'pronounciation' data.pinyin

Word = React.createClass do
  displayName: 'CUBE.Word'
  getDefaultProps: ->
    data: null
  render: ->
    data = @props.data
    div do
      className: 'word'
      div className: 'meaning' data.en
      div do
        className: 'characters'
        for let i, c of data.flatten!
          Character do
            key: i
            data: c
      div do
        className: 'entry'
        div do
          className: 'word-class'
          for wc in data.word-class
            div null wc
        div className: 'definition' data.definition

(this.CUBEBooks ?= {}) <<< do
  AudioControl: AudioControl
  Character: Character
  Word: Word

