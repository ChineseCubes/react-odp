React       = require 'react'
ReactVTT    = require 'react-vtt'
ODP         = require './ODP'
Button      = React.createFactory require './CUBE/UI/Button'
CustomShape = React.createFactory require './CUBE/CustomShape'
Book        = require './CUBE/Book'
NotifyMixin = require './CUBE/NotifyMixin'

IsolatedCue  = React.createFactory ReactVTT.IsolatedCue
AudioControl = React.createFactory Book.AudioControl
Playground   = React.createFactory Book.Playground

{ div, i, small } = React.DOM
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
  getInitialState: ->
    scale: @resize @props.dpcm, @props.width, @props.height
    text: ''
    show-text: true
  componentWillUpdate: (props, state) ->
    state.scale = @resize props.dpcm, props.width, props.height
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
  render: ->
    {setup} = @props.master-page
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
            data: @props.segs.get @state.text
      ODP.components.presentation do
        ref: \presentation
        scale: @state.scale
        data:  @props.data
        renderProps: (props) ~>
          click = if onClick is \onClick then \click else \touchstart
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
            hide = ~>
              $ '.office.presentation' .css \opacity 1
              $ @refs.modal.getDOMNode!
                .fadeOut \fast
                .toggleClass 'hidden' on
              @setState show-text: true
            show = ~>
              @setState text: text
              @setState show-text: false
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
                  hide!
                  $top.off click, hide-once # check the begining of render()
              setTimeout (-> $top.on click, hide-once), 0
            page = @[parents.1.name]
            unless text in page.sentences
              page
                ..sentences.push text
                ..playgrounds.push do
                  toggle: -> if it then show! else hide!
            attrs["#onClick"] = show
            attrs.style <<< display: \none if not @state.show-text
            if @props.vtt
              delete props.data.text
              ODP.components.span do
                props
                IsolatedCue do
                  target: "#{setup.path}/audio.vtt.json"
                  match: text
                  currentTime: @props.current-time
            else
              ODP.renderProps props
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
              '詞彙'
          | data.id is 'read-to-me'
            Button do
              className: 'read-to-me'
              style:
                width:  ODP.scale-length props.scale, data.attrs.width
                height: ODP.scale-length props.scale, data.attrs.height
                left: ODP.scale-length props.scale, data.attrs.x
                top:  ODP.scale-length props.scale, data.attrs.y
              onClick: -> @notify action: \mode data: 'read-to-me'
              '聽讀'
          | data.id is 'learn-by-myself'
            Button do
              className: 'learn-by-myself'
              style:
                width:  ODP.scale-length props.scale, data.attrs.width
                height: ODP.scale-length props.scale, data.attrs.height
                left: ODP.scale-length props.scale, data.attrs.x
                top:  ODP.scale-length props.scale, data.attrs.y
              onClick: -> @notify action: \mode data: 'learn-by-myself'
              '學習'
          | otherwise => ODP.renderProps props

module.exports = Book

