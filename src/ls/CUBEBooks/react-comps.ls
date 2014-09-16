{isNaN} = _
{a, div, i, nav, span} = React.DOM

AudioControl = React.createClass do
  displayName: \CUBEBooks.AudioControl
  getDefaultProps: ->
    id: 0
    audio: null
  getInitialState: ->
    playing: false
  componentWillMount: ->
    @props.audio
      ..on \play  @onPlay
      ..on \pause @onStop
      ..on \end   @onStop
  componentWillUnmount: ->
    @props.audio
      ..off \play  @onPlay
      ..off \pause @onStop
      ..off \end   @onStop
  onPlay: -> @setState playing: true
  onStop: -> @setState playing: false
  render: ->
    div do
      className: "audio-control#{if @state.playing then ' playing' else ''}"
      style:
        width:  '100%'
        height: '100%'
      onClick: ~>
        if not @state.playing
          @props.audio
            #..pos 0, @props.id # not work
            ..stop @props.id # reset pos
            ..play @props.id
        else
          @props.audio.pause! # pause every sprites
        @props.onClick.call this, it

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

undo-stack = []

RedoCut = React.createClass do
  displayName: 'CUBE.RedoCut'
  render: ->
    disabled = undo-stack.length is 0
    div do
      className: 'comp redo-cut ui black icon buttons'
      div do
        className: "ui button #{if disabled then 'disabled' else ''}"
        onClick: ->
          console.log 'foobar'
          comp = undo-stack.pop!
          comp?setState cut: false
          comp?click!
        i className: 'repeat icon'

Word = React.createClass do
  displayName: 'CUBE.Word'
  getDefaultProps: ->
    data:    null
    mode:    'zh_TW'
    pinyin:  off
    meaning: off
    menu:    off
    onChildClick: -> ...
  getInitialState: ->
    menu: @props.menu
    cut:  false
  click: -> @props.onChildClick this
  render: ->
    data = @props.data
    div do
      className: 'comp word'
      onClick: ~> @click! if not @state.cut
      if @state.menu
        ActionMenu do
          cut: data.children.length > 1
          onStroke: ~> ...
          onCut:    ~>
            next-cut = not @state.cut
            if next-cut is true
              undo-stack.push this
            @setState cut: next-cut
            @props.onChildClick this
      div do
        className: 'characters'
        if not @state.cut
          for let i, c of data.flatten!
            Character do
              key: i
              data: c
              mode: @props.mode
              pinyin: @props.pinyin
        else
          for let i, c of data.children
            Word do
              key: c.short
              data: c
              mode: @props.mode
              pinyin: @props.pinyin
              onChildClick: ~> @props.onChildClick it
      div do
        className: 'meaning'
        if @props.meaning then data.short else ''

ActionMenu = React.createClass do
  displayName: 'CUBE.ActionMenu'
  getDefaultProps: ->
    cut: on
    onStroke: -> ...
    onCut:    -> ...
  render: ->
    div do
      className: 'actions'
      div do
        className: "menu #{if @props.cut then 'multiple' else 'single'}"
        div do
          className: 'ui buttons'
          #div do
          #  className: 'ui icon button black listen'
          #  i className: 'icon volume up'
          div do
            className: 'ui icon button black write'
            onClick: ~>
              it.stopPropagation!
              @props.onStroke.call this, it
            i className: 'icon pencil'
          if @props.cut
            div do
              className: 'ui icon button black split'
              onClick: ~>
                it.stopPropagation!
                @props.onCut.call this, it
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
  #DEPTH:
  #  sentence:   0
  #  words:      1
  #  characters: Infinity
  displayName: 'CUBE.Sentence'
  getDefaultProps: ->
    data:    null
    mode:    'zh_TW'
    pinyin:  off
    meaning: off
  getInitialState: ->
    pinyin: @props.pinyin
    meaning: @props.meaning
    focus: null
    #depth: 0
  componentWillReceiveProps: (props) ->
    if @props.data.short isnt props.data.short
      @setState @getInitialState!{focus, depth}
      #$(@refs.settings.getDOMNode!)height 0
  componentDidMount: ->
    if not @state.focus
      @refs.0.click!
  componentWillUpdate: (props, state) ->
    if @props.data.short is props.data.short
      if @state.depth isnt state.depth
        state.focus = if state.depth is 0 then this else null
      else if @state.pinyin isnt state.pinyin
        console.log 'pinyin toggled'
      else if @state.meaning isnt state.meaning
        console.log 'translation toggled'
      else if @state.focus is state.focus
        state.focus = null
  componentDidUpdate: (props, state) ->
    if @props.data.short isnt props.data.short
      @refs.0.click!
  #renderDepthButton: (name) ->
  #  actived = @state.depth is @DEPTH[name]
  #  a do
  #    className: "item #name #{if actived then 'active' else ''}"
  #    onClick: ~>
  #      @setState depth: @DEPTH[name]
  #    name
  toggleMode: ->
    @setProps mode: if @props.mode is 'zh_TW' then 'zh_CN' else 'zh_TW'
  #toggleSettings: ->
  #  $settings = $ @refs.settings.getDOMNode!
  #  $settings.animate height: if $settings.height! isnt 0 then 0 else 48
  render: ->
    data = @props.data
    words = data.childrenOfDepth 0
    div do
      className: 'playground'
      div do
        className: 'comp sentence'
        #div className: 'aligner'
        for let i, word of words
          Word do
            key: word.short
            ref: i
            data: word
            mode: @props.mode
            pinyin: @state.pinyin
            meaning: @state.depth isnt 0 and @state.meaning
            onChildClick: (comp) ~>
              if @state.focus is comp
                comp.setState menu: off
                @setState focus: null
              else
                @state.focus?setState menu: off
                comp.setState menu: on
                @setState focus: comp
        #Stroker ref: 'stroker'
      #nav do
      #  ref: 'settings'
      #  className: 'navbar'
      #  style: height: 0
      #  div do
      #    className: 'ui borderless menu'
      #    div do
      #      className: 'right menu'
      #      @renderDepthButton 'sentence'
      #      @renderDepthButton 'words'
      #      @renderDepthButton 'characters'
      #      a do
      #        className: 'item toggle chinese'
      #        onClick: @toggleMode
      #        if @props.mode is 'zh_TW' then 'T' else 'S'
      RedoCut!
      div do
        className: 'entry'
        if @state.focus isnt null
          focus = @state.focus.props.data
          * span do
              className: 'ui black label'
              focus.flatten!map(~> it[@props.mode])join ''
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
            onClick: ~>
              if not @state.pinyin then try
                syn = window.speechSynthesis
                utt = window.SpeechSynthesisUtterance
                text =
                  if not @state.focus
                    data.flatten!
                  else
                    @state.focus.props.data.flatten!
                text = (for c in text => c[@props.mode])join ''
                lang = switch @props.mode
                  | \zh_TW => \zh-TW
                  | \zh_CN => \zh-CN
                u = new utt text
                  ..lang = lang
                  ..volume = 1.0
                  ..rate = 1.0
                syn.speak u
              @setState pinyin: !@state.pinyin
            \拼
          if @state.depth isnt 0 then a do
            className: "ui toggle basic button chinese #{if @state.meaning then \active else ''}"
            onClick: ~>
              if not @state.meaning then try
                syn = window.speechSynthesis
                utt = window.SpeechSynthesisUtterance
                text =
                  if not @state.focus
                    data.short
                  else
                    @state.focus.props.data.short
                u = new utt text
                  ..lang = \en-US
                  ..volume = 1.0
                  ..rate = 1.0
                syn.speak u
              @setState meaning: !@state.meaning
            \En

(this.CUBEBooks ?= {}) <<< do
  AudioControl:   AudioControl
  SettingsButton: SettingsButton
  Sentence:  Sentence

