React     = require 'react'
ReactVTT  = require 'react-vtt'
ODP       = require './ODP'
Button    = require './CUBE/UI/Button'

{ div, i, small } = React.DOM
{ onClick } = require './CUBE/utils'
{ Playground, AudioControl } = require './CUBE/Book'
{ Howler, Howl } = require 'howler'

Book = React.createClass do
  displayName: \CUBE.Book
  getDefaultProps: ->
    master-page: null
    data: null
    segs: null
    vtt: null
    #pages: [1]
    pages: null
    dpcm: 37.79527
    width: 1024
    height: 768
    show-text: true
  getInitialState: ->
    scale: @resize @props.dpcm, @props.width, @props.height
    audio: null
    sprite: {}
    current-sprite: null
    text: ''
    page-number: 0
  componentWillMount: ->
    {setup} = @props.master-page
    audio = try
      Howler.iOSAutoEnable = false
      new Howl urls: ["#{setup.path}/audio.mp3"]
    if audio
      audio.on \end ~> @state.current-sprite = null
    # set audio and update sprites after prerendered content has been mounted
    @setState audio: audio
  componentWillUpdate: (props, state) ->
    state.scale = @resize props.dpcm, props.width, props.height
  componentDidMount: ->
    @state.audio?sprite @state.sprite
  resize: (dpcm, width, height) ->
    #return 0.98 if not @props.auto-fit
    $window = $ window
    {setup} = @props.master-page
    ratio     = setup.ratio
    px-width  = setup.width  * @props.dpcm
    px-height = setup.height * @props.dpcm
    if width / ratio < height
      width / px-width
    else
      height / px-height
  render: ->
    {setup} = @props.master-page
    counter = 0
    ranges = []
    attrs = @props.data.attrs
    offset-x = "-#{@state.page-number * +(attrs.width.replace 'cm' '')}cm"
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
            data: @props.segs.get @state.text
        Button do
          className: 'close'
          '✖'
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
              go: ~>
                @setState page-number: +attrs.name.replace('page' '') - 1
              speak: -> ...
              sentences: []
              playgrounds: []
            ODP.renderProps props if attrs.name in pages
          | data.name is 'image' and attrs.name is 'activity'
            delete attrs.href
            delete attrs["#onClick"]
            comp = let counter
              text = ''
              range = start: Infinity, end: -Infinity
              while r = ranges.pop!
                text = r.text + text
                range
                  ..start = r.start if r.start < range.start
                  ..end   = r.end   if r.end   > range.end
              id = "segment-#counter"
              @state.sprite[id] =
                [range.start * 1000, (range.end - range.start) * 1000]
              if range.start < range.end
                book = this
                ODP.components.image do
                  props
                  AudioControl do
                    id: id
                    audio: @state.audio
                    text: text
                    onMount: ->
                      book[parents.1.name]speak := ~> @play!
                    "#onClick": ~>
                      @state.current-sprite = @state.sprite[id]
            ++counter
            comp
          | data.name is 'span' and data.text
            text = props.data.text
            hide = ~>
              $ '.office.presentation' .css \opacity 1
              $ @refs.modal.getDOMNode!
                .fadeOut \fast
                .toggleClass 'hidden' on
              @setProps show-text: true
            show = ~>
              @setState text: text
              @setProps show-text: false
              $modal = $ @refs.modal.getDOMNode!
              height = $modal.height!
              $ '.office.presentation' .css \opacity 0.5
              $modal
                .fadeIn \fast
                # XXX: this state should be managed by React
                .toggleClass 'hidden' off
                .one \click \.close hide
              #$ @refs.modal.getDOMNode!
              #  .modal do
              #    detachable: false
              #    onHide: ~> @setProps show-text: true
              #  .modal \show
            page = @[parents.1.name]
            unless text in page.sentences
              page
                ..sentences.push text
                ..playgrounds.push do
                  toggle: -> if it then show! else hide!
            attrs["#onClick"] = show
            attrs.style <<< display: \none if not @props.show-text
            if not @state.audio
              ranges.push do
                text:  text
                start: 0 # XXX: hack
                end:   1
              ODP.renderProps props
            else
              if @props.vtt
                # search and remember ranges for later use
                for cue in @props.vtt.cues
                  if cue.text is text
                    ranges.push do
                      text:  text
                      start: cue.startTime
                      end:   cue.endTime
                    break
              delete props.data.text
              ODP.components.span do
                props
                ReactVTT.IsolatedCue do
                  target: "#{setup.path}/audio.vtt.json"
                  match: text
                  currentTime: ~>
                    (@state.current-sprite?0 or 0) / 1000 + (@state.audio?pos! or 0)
          | otherwise => ODP.renderProps props

module.exports = Book

