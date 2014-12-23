React       = require 'react'
ReactVTT    = require 'react-vtt'
ODP         = require './ODP'
Data        = require './CUBE/data'
Button      = React.createFactory require './CUBE/UI/Button'
CustomShape = React.createFactory require './CUBE/CustomShape'
Book        = require './CUBE/Book'
NotifyMixin = require './CUBE/NotifyMixin'

Cue          = React.createFactory ReactVTT.Cue
AudioControl = React.createFactory Book.AudioControl
Playground   = React.createFactory Book.Playground

{ div, i, small, span } = React.DOM
{ onClick } = require './CUBE/utils'
{ Howler, Howl } = require 'howler'

win = try window

Book = React.createClass do
  displayName: \CUBE.Book
  mixins: [NotifyMixin]
  getDefaultProps: ->
    master-page: null
    data: null
    segs: null
    vtt: null
    autoplay: off
    loading: true
    playing: false
    current-time: ->
    #pages: [1]
    pages: null
    current-page: 0
    dpcm: 37.79527
    width: 1024
    height: 768
    text: ''
  getInitialState: ->
    scale: @resize @props.dpcm, @props.width, @props.height
    show-text: true
    paragraphs: []
    segments:   []
    dicts:      []
  componentWillMount: ->
    @state.comps = @cca-comps do
      Data.paragraphs-of @props.data
      Data.segments-of   @props.data
      Data.dicts-of      @props.data
  componentWillUpdate: (props, state) ->
    state.scale = @resize props.dpcm, props.width, props.height
    if @props.data isnt props.data
      state.comps = @cca-comps do
        Data.paragraphs-of props.data
        Data.segments-of   props.data
        Data.dicts-of      props.data
    if @props.text isnt props.text
      if props.text.length
        @show!
  hide: ->
    $ '.office.presentation' .css \opacity 1
    $ @refs.modal.getDOMNode!
      .fadeOut \fast
      .toggleClass 'hidden' on
    @setState show-text: true
  show: ->
    click = if onClick is \onClick then \click else \touchstart
    modal = @refs.modal.getDOMNode!
    $modal = $ modal
    height = $modal.height!
    $ '.office.presentation' .css \opacity 0.5
    $modal
      .fadeIn \fast
      # XXX: this state should be managed by React
      .toggleClass 'hidden' off
    $top = $ try window
    hide-once = ~>
      unless $.contains modal, it.target
        @hide!
        $top.off click, hide-once # check the begining of render()
    setTimeout (~> $top.on click, hide-once), 0
    @setState show-text: false
  resize: (dpcm, width, height) ->
    return 0.98 unless win
    $window = $ win
    {setup} = @props.master-page
    ratio     = setup.ratio
    px-width  = setup.width  * @props.dpcm
    px-height = setup.height * @props.dpcm
    if width / ratio < height
      width / px-width
    else
      height / px-height
  cca-comps: (paragraphs, segments, dicts) ->
    comps = {}
    for i of paragraphs
      segs = segments[i]map (.zh)
      for sentence in paragraphs[i]
        children = []
        for let seg in Data.segment sentence, segs
          if seg in segs # FIXME: should not search again
            children.push span do
              style:
                cursor: \pointer
              onClick: ~>
                @notify action: \cca text: seg
              seg
          else
            children.push seg
        comps[sentence] = span {} children
    comps
  render: ->
    { setup } = @props.master-page
    attrs = @props.data.attrs
    offset-x = "-#{@props.current-page * +(attrs.width.replace 'cm' '')}cm"

    div do
      className: 'main'
      div do
        ref: \modal
        className: 'modal hidden'
        div do
          className: 'header'
          Button do
            className: 'settings'
            "#onClick": ~>
              @refs.playground.toggleSettings!
            'Settings'
          'C'
          small null, 'UBE'
          'Control'
        div do
          className: 'content'
          Playground do
            ref: \playground
            data: @props.segs.get @props.text
      ODP.components.presentation do
        ref: \presentation
        scale: @state.scale
        data:  @props.data
        renderProps: (props) ~>
          @props.pages = [1 to setup.total-pages] if not @props.pages
          pages = @props.pages.map (-> "page#it")
          parents = props.parents
          data  = props.data
          attrs = data.attrs
          switch
          | data.name is 'page'
            attrs.x = offset-x
            # expose pages
            @[attrs.name] ?=
              speak: -> ...
              sentences: []
              playgrounds: []
            ODP.renderProps props if attrs.name in pages
          #| data.name is 'image' and attrs.name is 'activity' and not @props.autoplay
          | false
            delete attrs.href
            delete attrs["#onClick"]
            ODP.components.image do
              props
              AudioControl do
                loading: @props.loading
                playing: @props.playing
                "#onClick": ~>
                  @notify unless @props.playing
                    then action: \play, page-num: props.data.attrs.page-num
                    else action: \stop
          | data.name is 'span' and data.text
            text = props.data.text
            page = @[parents.1.name]
            unless text in page.sentences
              page
                ..sentences.push text
                ..playgrounds.push do
                  toggle: ~> if it then @show! else @hide!
            attrs.style <<< display: \none if not @state.show-text
            delete props.data.text
            startTime = 0
            endTime = 0
            for cue in @props.vtt.cues
              if text is cue.text
                { startTime, endTime } = cue
            ODP.components.span do
              props
              Cue do
                {
                  key: text
                  startTime
                  endTime
                  current-time: @props.current-time!
                }
                @state.comps[text]
          | data.name is 'custom-shape'
            CustomShape props if @state.show-text
          | data.id is 'glossary'
            Button do
              className: 'glossary'
              style:
                width:  ODP.scale-length props.scale, data.attrs.width
                height: ODP.scale-length props.scale, data.attrs.height
                left: ODP.scale-length props.scale, data.attrs.x
                top:  ODP.scale-length props.scale, data.attrs.y
              onClick: -> @notify action: \mode data: 'glossary'
          | data.id is 'read-to-me'
            Button do
              className: 'read-to-me'
              style:
                width:  ODP.scale-length props.scale, data.attrs.width
                height: ODP.scale-length props.scale, data.attrs.height
                left: ODP.scale-length props.scale, data.attrs.x
                top:  ODP.scale-length props.scale, data.attrs.y
              onClick: -> @notify action: \mode data: 'read-to-me'
          | data.id is 'learn-by-myself'
            Button do
              className: 'learn-by-myself'
              style:
                width:  ODP.scale-length props.scale, data.attrs.width
                height: ODP.scale-length props.scale, data.attrs.height
                left: ODP.scale-length props.scale, data.attrs.x
                top:  ODP.scale-length props.scale, data.attrs.y
              onClick: -> @notify action: \mode data: 'learn-by-myself'
          | otherwise => ODP.renderProps props

module.exports = Book

